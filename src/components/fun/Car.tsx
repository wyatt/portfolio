import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { AnimatePresence, motion, useAnimationFrame } from "motion/react";
import { CarSounds } from "./carSounds";
import { usePageHeight } from "./usePageHeight";
import { CANVAS_HIGH_SHADOW } from "./shadows";

const WIDTH = 110;
const ASPECT_RATIO = 300 / 450;
const HEIGHT = WIDTH / ASPECT_RATIO;

// Driving tuning. Distances are in CSS px, times in seconds.
const MAX_SPEED = 750;
const MAX_REVERSE_SPEED = 260;
const ENGINE_ACCEL = 950; // Full-throttle acceleration from a standstill
const REVERSE_ACCEL = 600;
const BRAKE_DECEL = 1900;
const COAST_DRAG = 0.9; // Fraction of speed lost per second when coasting
const ROLLING_RESISTANCE = 60;
const MAX_YAW_RATE = 3.2; // Turn rate at full lock, rad/s
const FULL_STEER_SPEED = 220; // Steering is weaker below this speed
const HIGH_SPEED_STEER_LOSS = 0.4; // Steering lost at top speed, for stability
const STEER_RESPONSE = 9; // How quickly the wheel follows the keys
const GRIP = 9; // How strongly the tyres cancel sideways sliding
// The handbrake is for drifting, not stopping: it unloads the rear tyres and
// adds rotation, while the throttle keeps (reduced) drive
const HANDBRAKE_GRIP = 2.2;
const HANDBRAKE_DECEL = 120;
const HANDBRAKE_YAW_BOOST = 1.7;
const HANDBRAKE_THROTTLE = 0.5;
const GRIP_LOSS_RATE = 40; // How fast grip drops when the handbrake goes on
const GRIP_RECOVERY_RATE = 36; // How fast it returns, so drifts exit smoothly
const DRIFT_RECOVERY = 0.5; // Share of sideways speed turned back into forward speed when grip returns
const WALL_BOUNCE = 0.35; // Fraction of speed kept when bouncing off a page edge
const MAX_STEP = 1 / 120; // Physics substep, keeps handling identical at any refresh rate

// Skid marks
const SKID_THRESHOLD = 90; // Sideways speed before the tyres leave marks
const SKID_LIFETIME = 2500;
const REAR_AXLE_OFFSET = 50; // Distance from the car's centre to the rear axle
const REAR_WHEEL_OFFSET = WIDTH * 0.2;

const RESET_DELAY = 5000; // Idle time before the car drives itself home
const RESET_DURATION = 0.5;
const FOLLOW_MARGIN = 140; // Scroll the page when the car gets this close to the viewport edge

// Room around the car sprite for its blurred shadow
const SHADOW_PAD = 24;

interface CarSprites {
  dpr: number;
  car: HTMLCanvasElement;
  shadow: HTMLCanvasElement;
}

// Pre-render the car and its blurred shadow once. Blurring a canvas shadow
// every frame is slow, and the zoom-in redraws the car every frame.
const buildCarSprites = (img: HTMLImageElement, dpr: number): CarSprites => {
  const makeCanvas = (width: number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    return { canvas, ctx };
  };

  const car = makeCanvas(WIDTH, HEIGHT);
  car.ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);

  // Draw the car far off the canvas so only its shadow lands on it. Shadow
  // settings are in device pixels, matching how the car's shadow always looked.
  const shadow = makeCanvas(WIDTH + SHADOW_PAD * 2, HEIGHT + SHADOW_PAD * 2);
  const offscreen = 10000;
  shadow.ctx.shadowColor = CANVAS_HIGH_SHADOW.color;
  shadow.ctx.shadowBlur = CANVAS_HIGH_SHADOW.blur;
  shadow.ctx.shadowOffsetX = offscreen * dpr;
  shadow.ctx.drawImage(img, SHADOW_PAD - offscreen, SHADOW_PAD, WIDTH, HEIGHT);

  return { dpr, car: car.canvas, shadow: shadow.canvas };
};

interface CarState {
  x: number;
  y: number;
  heading: number; // 0 points up the page
  vx: number;
  vy: number;
  steer: number; // -1 (full left) to 1 (full right)
  grip: number;
}

interface SkidPoint {
  x: number;
  y: number;
  time: number;
  intensity: number;
}

interface Spring {
  value: number;
  velocity: number;
  target: number;
}

const stepSpring = (spring: Spring, dt: number) => {
  const stiffness = 300;
  const damping = 20;
  const acceleration =
    stiffness * (spring.target - spring.value) - damping * spring.velocity;
  spring.velocity += acceleration * dt;
  spring.value += spring.velocity * dt;
  return (
    Math.abs(spring.target - spring.value) > 0.001 ||
    Math.abs(spring.velocity) > 0.001
  );
};

const approach = (value: number, target: number, amount: number) =>
  value < target
    ? Math.min(target, value + amount)
    : Math.max(target, value - amount);

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const Car = (props: {
  style: React.CSSProperties;
  shouldAnimate: boolean;
  incrementStep: () => void;
  onReady?: () => void;
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitboxRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  // The drift and horn hints appear once someone starts driving
  const [showExtraControls, setShowExtraControls] = useState(false);
  const hasShownExtraControls = useRef(false);

  // Everything the animation loop touches lives in refs, so driving never
  // re-renders React
  const car = useRef<CarState>({
    x: 0,
    y: 0,
    heading: 0,
    vx: 0,
    vy: 0,
    steer: 0,
    grip: GRIP,
  });
  const pressedKeys = useRef<Set<string>>(new Set());
  const skids = useRef<{ left: SkidPoint[][]; right: SkidPoint[][] }>({
    left: [],
    right: [],
  });
  const wasSkidding = useRef(false);
  const hasBeenDriven = useRef(false);
  const idleTime = useRef(0);
  const reset = useRef<{
    from: { x: number; y: number; heading: number };
    progress: number;
  } | null>(null);
  const scaleSpring = useRef<Spring>({ value: 0, velocity: 0, target: 0 });
  const opacitySpring = useRef<Spring>({ value: 0, velocity: 0, target: 0 });
  const hasIncrementedStep = useRef(false);
  const needsDraw = useRef(true);
  const sounds = useRef<CarSounds | null>(null);

  // Preload the car image
  const carImage = useMemo(() => {
    const img = new Image();
    img.src = "/fun/mustang.png";
    return img;
  }, []);

  // Track image loading state
  const [imageLoaded, setImageLoaded] = useState(false);

  // Monitor image loading
  useEffect(() => {
    if (carImage.complete) {
      setImageLoaded(true);
    } else {
      carImage.onload = () => setImageLoaded(true);
    }
  }, [carImage]);

  const sprites = useRef<CarSprites | null>(null);
  // The area the car was last drawn in, so only that needs clearing
  const lastCarRect = useRef<{ x: number; y: number; size: number } | null>(
    null,
  );
  const hadSkidMarks = useRef(false);

  useEffect(() => {
    if (imageLoaded) {
      sprites.current = buildCarSprites(carImage, window.devicePixelRatio || 1);
    }
    needsDraw.current = true;
  }, [imageLoaded, carImage]);

  const { onReady } = props;
  useEffect(() => {
    if (imageLoaded) onReady?.();
  }, [imageLoaded, onReady]);

  // Animate in or out when shouldAnimate changes
  useEffect(() => {
    scaleSpring.current.target = props.shouldAnimate ? 1 : 0;
    opacitySpring.current.target = props.shouldAnimate ? 1 : 0;
    if (!props.shouldAnimate) hasIncrementedStep.current = false;
  }, [props.shouldAnimate]);

  // Track full page height so the car can roam the entire page
  const documentHeight = usePageHeight();

  // Calculate ROOT_POS using useMemo to ensure it's recalculated when dependencies change
  const ROOT_POS = useMemo(
    () => ({
      x: props.style.left as number,
      y:
        (parseInt((props.style.top as string).split("%")[0]) / 100) *
        (windowHeight || window.innerHeight),
      heading: 0.2,
    }),
    [props.style.left, props.style.top, windowWidth, windowHeight],
  );

  // Park the car at its home position whenever that position changes
  useEffect(() => {
    car.current = { ...ROOT_POS, vx: 0, vy: 0, steer: 0, grip: GRIP };
    reset.current = null;
    needsDraw.current = true;
  }, [ROOT_POS]);

  // Release the audio context when the car goes away
  useEffect(() => {
    sounds.current = new CarSounds();
    return () => sounds.current?.dispose();
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const DRIVING_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const isCarVisible = () => scaleSpring.current.target === 1;

    const isTyping = (e: KeyboardEvent) =>
      e.target instanceof HTMLElement &&
      (e.target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      if (DRIVING_KEYS.includes(e.key)) {
        e.preventDefault();
        pressedKeys.current.add(e.key);
        // Audio can only start from a user gesture, so wake it on the first key
        if (isCarVisible()) sounds.current?.start();
      } else if (e.code === "KeyB" && !e.repeat && isCarVisible()) {
        sounds.current?.start();
        sounds.current?.hornOn();
      } else if (e.code === "Space") {
        // Space is the handbrake, but only steal it from page scrolling while driving
        const { vx, vy } = car.current;
        const isDriving =
          Math.hypot(vx, vy) > 20 ||
          DRIVING_KEYS.some((key) => pressedKeys.current.has(key));
        if (isDriving) {
          e.preventDefault();
          pressedKeys.current.add("Space");
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (DRIVING_KEYS.includes(e.key)) {
        e.preventDefault();
        pressedKeys.current.delete(e.key);
      } else if (e.code === "Space") {
        pressedKeys.current.delete("Space");
      } else if (e.code === "KeyB") {
        sounds.current?.hornOff();
      }
    };

    // Don't leave keys stuck down if the window loses focus mid-drive
    const handleBlur = () => {
      pressedKeys.current.clear();
      sounds.current?.hornOff();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const startReset = () => {
    const { x, y, heading } = car.current;
    reset.current = { from: { x, y, heading }, progress: 0 };
    idleTime.current = 0;
  };

  // Handle click to reset car to original position
  const handleCarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    startReset();
  };

  const stepPhysics = (
    dt: number,
    bounds: { width: number; height: number },
  ) => {
    const state = car.current;
    const keys = pressedKeys.current;
    const throttle = keys.has("ArrowUp");
    const brake = keys.has("ArrowDown");
    const handbrake = keys.has("Space");
    const steerInput =
      (keys.has("ArrowRight") ? 1 : 0) - (keys.has("ArrowLeft") ? 1 : 0);

    // Split velocity into the part along the car and the part sliding sideways
    const forwardX = Math.sin(state.heading);
    const forwardY = -Math.cos(state.heading);
    let forwardSpeed = state.vx * forwardX + state.vy * forwardY;
    let lateralSpeed = state.vx * -forwardY + state.vy * forwardX;

    // Engine, brakes and reverse
    if (throttle && forwardSpeed >= -1) {
      forwardSpeed +=
        ENGINE_ACCEL *
        (handbrake ? HANDBRAKE_THROTTLE : 1) *
        (1 - forwardSpeed / MAX_SPEED) *
        dt;
    } else if (throttle) {
      forwardSpeed = approach(forwardSpeed, 0, BRAKE_DECEL * dt);
    } else if (brake && forwardSpeed > 1) {
      forwardSpeed = approach(forwardSpeed, 0, BRAKE_DECEL * dt);
    } else if (brake) {
      forwardSpeed -=
        REVERSE_ACCEL * (1 + forwardSpeed / MAX_REVERSE_SPEED) * dt;
    } else {
      forwardSpeed -= forwardSpeed * COAST_DRAG * dt;
      forwardSpeed = approach(forwardSpeed, 0, ROLLING_RESISTANCE * dt);
    }

    if (handbrake) {
      forwardSpeed = approach(forwardSpeed, 0, HANDBRAKE_DECEL * dt);
    }

    // Tyres resist sliding sideways; the handbrake lets the rear step out
    state.grip = handbrake
      ? approach(state.grip, HANDBRAKE_GRIP, GRIP_LOSS_RATE * dt)
      : approach(state.grip, GRIP, GRIP_RECOVERY_RATE * dt);
    const keptLateral = lateralSpeed * Math.exp(-state.grip * dt);
    // While drifting, some of the slide carries the car forward out of the corner
    if (forwardSpeed > 0 && state.grip < GRIP) {
      forwardSpeed = Math.min(
        MAX_SPEED,
        forwardSpeed + Math.abs(lateralSpeed - keptLateral) * DRIFT_RECOVERY,
      );
    }
    lateralSpeed = keptLateral;

    // The wheel eases towards the keys instead of snapping
    state.steer = approach(state.steer, steerInput, STEER_RESPONSE * dt);

    // Steering needs the car to be rolling, flips in reverse, and calms at speed
    const speedFactor =
      clamp(forwardSpeed / FULL_STEER_SPEED, -1, 1) *
      (1 -
        HIGH_SPEED_STEER_LOSS *
          Math.min(Math.abs(forwardSpeed) / MAX_SPEED, 1));
    state.heading +=
      state.steer *
      MAX_YAW_RATE *
      speedFactor *
      (handbrake ? HANDBRAKE_YAW_BOOST : 1) *
      dt;

    // Recombine velocity along the old heading so momentum lags the turn;
    // grip pulls it back in line next step, and a lack of grip is a drift
    state.vx = forwardX * forwardSpeed - forwardY * lateralSpeed;
    state.vy = forwardY * forwardSpeed + forwardX * lateralSpeed;
    state.x += state.vx * dt;
    state.y += state.vy * dt;

    // Bounce off the edges of the page, using the rotated car's real
    // footprint (it is much longer than it is wide) so no part leaves the page
    const cos = Math.abs(Math.cos(state.heading));
    const sin = Math.abs(Math.sin(state.heading));
    const halfExtentX = (cos * WIDTH + sin * HEIGHT) / 2;
    const halfExtentY = (sin * WIDTH + cos * HEIGHT) / 2;
    if (state.x < halfExtentX || state.x > bounds.width - halfExtentX) {
      state.x = clamp(state.x, halfExtentX, bounds.width - halfExtentX);
      state.vx *= -WALL_BOUNCE;
    }
    if (state.y < halfExtentY || state.y > bounds.height - halfExtentY) {
      state.y = clamp(state.y, halfExtentY, bounds.height - halfExtentY);
      state.vy *= -WALL_BOUNCE;
    }

    // Lock-ups and slides leave marks
    const isLockingUp = (brake || handbrake) && forwardSpeed > 300 && !throttle;
    const slip = Math.max(
      Math.abs(lateralSpeed) - SKID_THRESHOLD,
      isLockingUp ? 120 : 0,
    );
    return slip > 0 ? clamp(slip / 300, 0.2, 0.7) : 0;
  };

  const addSkidPoints = (intensity: number, time: number) => {
    const { x, y, heading } = car.current;
    const cos = Math.cos(heading);
    const sin = Math.sin(heading);
    const wheelAt = (offsetX: number): SkidPoint => ({
      x: x + cos * offsetX - sin * REAR_AXLE_OFFSET,
      y: y + sin * offsetX + cos * REAR_AXLE_OFFSET,
      time,
      intensity,
    });

    for (const [side, offsetX] of [
      ["left", -REAR_WHEEL_OFFSET],
      ["right", REAR_WHEEL_OFFSET],
    ] as const) {
      const segments = skids.current[side];
      // A new mark starts each time the tyres begin sliding again
      if (!wasSkidding.current || segments.length === 0) segments.push([]);
      segments[segments.length - 1].push(wheelAt(offsetX));
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, now: number) => {
    const canvas = ctx.canvas;
    const hasSkidMarks =
      skids.current.left.length > 0 || skids.current.right.length > 0;

    // Clearing the whole page-sized canvas is expensive, so when there are no
    // skid marks only the car's previous spot is cleared
    if (hasSkidMarks || hadSkidMarks.current || !lastCarRect.current) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else {
      const { x, y, size } = lastCarRect.current;
      ctx.clearRect(x - size / 2, y - size / 2, size, size);
    }
    hadSkidMarks.current = hasSkidMarks;
    lastCarRect.current = null;

    // Skid marks, fading with age
    if (hasSkidMarks) {
      ctx.save();
      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      for (const side of ["left", "right"] as const) {
        for (const segment of skids.current[side]) {
          for (let i = 1; i < segment.length; i++) {
            const point = segment[i];
            const fade = 1 - (now - point.time) / SKID_LIFETIME;
            if (fade <= 0) continue;
            ctx.globalAlpha = fade * point.intensity;
            ctx.beginPath();
            ctx.moveTo(segment[i - 1].x, segment[i - 1].y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }

    const scale = scaleSpring.current.value;
    const opacity = clamp(opacitySpring.current.value, 0, 1);
    if (!imageLoaded || scale < 0.01 || opacity < 0.01) return;

    const dpr = window.devicePixelRatio || 1;
    if (!sprites.current || sprites.current.dpr !== dpr) {
      sprites.current = buildCarSprites(carImage, dpr);
    }
    const { car: carSprite, shadow: shadowSprite } = sprites.current;
    const { x, y, heading } = car.current;
    const shadowWidth = WIDTH + SHADOW_PAD * 2;
    const shadowHeight = HEIGHT + SHADOW_PAD * 2;
    const shadowOffsetX = CANVAS_HIGH_SHADOW.offsetX / dpr;
    const shadowOffsetY = CANVAS_HIGH_SHADOW.offsetY / dpr;

    ctx.save();
    ctx.globalAlpha = opacity;
    // Shadow falls straight down the page whichever way the car faces
    ctx.translate(x + shadowOffsetX, y + shadowOffsetY);
    ctx.scale(scale, scale);
    ctx.rotate(heading);
    ctx.drawImage(
      shadowSprite,
      -shadowWidth / 2,
      -shadowHeight / 2,
      shadowWidth,
      shadowHeight,
    );
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(heading);
    ctx.drawImage(carSprite, -WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);
    ctx.restore();

    // A square that covers the rotated car and its shadow, plus a margin for
    // antialiasing and the spring overshooting
    const size =
      Math.hypot(shadowWidth, shadowHeight) * Math.max(scale, 1) +
      2 * Math.hypot(shadowOffsetX, shadowOffsetY) +
      4;
    lastCarRect.current = { x, y, size };
  };

  useAnimationFrame((time, delta) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clamp long frames (e.g. after switching tabs) so the car doesn't jump
    const dt = Math.min(delta / 1000, 0.1);
    const now = performance.now();
    const dpr = window.devicePixelRatio || 1;
    const bounds = { width: canvas.width / dpr, height: canvas.height / dpr };
    const state = car.current;
    const keys = pressedKeys.current;

    // Entrance / exit springs
    const scaleMoving = stepSpring(scaleSpring.current, dt);
    const opacityMoving = stepSpring(opacitySpring.current, dt);
    if (scaleMoving || opacityMoving) needsDraw.current = true;
    if (
      !hasIncrementedStep.current &&
      scaleSpring.current.value > 0.95 &&
      opacitySpring.current.value > 0.95
    ) {
      hasIncrementedStep.current = true;
      props.incrementStep();
    }
    if (labelRef.current) {
      labelRef.current.style.opacity = String(
        clamp(opacitySpring.current.value, 0, 1),
      );
      labelRef.current.style.transform = `scale(${Math.max(0, scaleSpring.current.value)})`;
    }

    if (keys.size > 0) {
      hasBeenDriven.current = true;
      if (!hasShownExtraControls.current) {
        hasShownExtraControls.current = true;
        setShowExtraControls(true);
      }
      reset.current = null;
    }

    if (reset.current) {
      // Glide home
      const r = reset.current;
      r.progress = Math.min(1, r.progress + dt / RESET_DURATION);
      const ease = 1 - Math.pow(1 - r.progress, 3);
      const TWO_PI = 2 * Math.PI;
      const rawDiff = ROOT_POS.heading - r.from.heading;
      const shortestDiff =
        (((rawDiff % TWO_PI) + TWO_PI + Math.PI) % TWO_PI) - Math.PI;
      state.x = r.from.x + (ROOT_POS.x - r.from.x) * ease;
      state.y = r.from.y + (ROOT_POS.y - r.from.y) * ease;
      state.heading = r.from.heading + shortestDiff * ease;
      state.vx = state.vy = state.steer = 0;
      state.grip = GRIP;
      if (r.progress >= 1) {
        reset.current = null;
        hasBeenDriven.current = false;
      }
      needsDraw.current = true;
    } else {
      const speed = Math.hypot(state.vx, state.vy);
      const isActive =
        keys.size > 0 || speed > 0.5 || Math.abs(state.steer) > 0;

      if (isActive) {
        let skidIntensity = 0;
        for (let remaining = dt; remaining > 0; remaining -= MAX_STEP) {
          skidIntensity = Math.max(
            skidIntensity,
            stepPhysics(Math.min(MAX_STEP, remaining), bounds),
          );
        }
        if (Math.hypot(state.vx, state.vy) < 0.5 && keys.size === 0) {
          state.vx = state.vy = 0;
        }
        if (skidIntensity > 0) addSkidPoints(skidIntensity, now);
        wasSkidding.current = skidIntensity > 0;
        needsDraw.current = true;

        // Keep the car on screen by scrolling the page with it
        if (keys.size > 0) {
          const screenY = canvas.getBoundingClientRect().top + state.y;
          if (screenY > window.innerHeight - FOLLOW_MARGIN) {
            window.scrollBy(0, screenY - (window.innerHeight - FOLLOW_MARGIN));
          } else if (screenY < FOLLOW_MARGIN) {
            window.scrollBy(0, screenY - FOLLOW_MARGIN);
          }
        }
      }

      // Drive home after sitting still for a while
      if (!isActive && hasBeenDriven.current) {
        idleTime.current += delta;
        if (idleTime.current > RESET_DELAY) startReset();
      } else {
        idleTime.current = 0;
      }
    }

    const speed = Math.hypot(state.vx, state.vy);
    sounds.current?.update(
      Math.min(speed / MAX_SPEED, 1),
      keys.has("ArrowUp"),
      keys.size > 0 || speed > 5,
    );

    // Drop faded skid marks
    for (const side of ["left", "right"] as const) {
      const segments = skids.current[side]
        .map((segment) =>
          segment.filter((point) => now - point.time < SKID_LIFETIME),
        )
        .filter((segment) => segment.length > 0);
      if (segments.length > 0 || skids.current[side].length > 0) {
        needsDraw.current = true;
      }
      skids.current[side] = segments;
    }

    if (hitboxRef.current) {
      hitboxRef.current.style.left = `${state.x - WIDTH / 2}px`;
      hitboxRef.current.style.top = `${state.y - HEIGHT / 2}px`;
    }

    if (needsDraw.current) {
      draw(ctx, now);
      needsDraw.current = false;
    }
  });

  // Handle canvas sizing and resize
  useEffect(() => {
    if (!canvasRef.current || !documentHeight) return;

    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = document.documentElement.scrollWidth * dpr;
    canvas.height = documentHeight * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    lastCarRect.current = null;
    needsDraw.current = true;
  }, [windowWidth, windowHeight, documentHeight]);

  return (
    <>
      {/* Clickable area that follows the car */}
      <div
        ref={hitboxRef}
        className="absolute z-40"
        onClick={handleCarClick}
        title="Click to send the car home"
        style={{
          width: WIDTH,
          height: HEIGHT,
          pointerEvents: "auto",
          cursor: "pointer",
        }}
      />
      <canvas
        className="absolute w-full top-0 left-0 z-100 pointer-events-none"
        style={{ height: documentHeight || "100%" }}
        ref={canvasRef}
      ></canvas>
      <div
        style={{
          top: ROOT_POS.y,
          left: ROOT_POS.x,
          width: WIDTH * 0.95,
          height: HEIGHT * 1.05,
          position: "absolute",
          transform: `translate(-50%, -50%) rotate(${ROOT_POS.heading}rad)`,
          pointerEvents: "none",
        }}
      >
        <div
          ref={labelRef}
          className="font-sans text-sm text-gray-400 font-semibold uppercase z-30 absolute top-full -mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap flex flex-col items-center"
          style={{ opacity: 0, transform: "scale(0)" }}
        >
          <span>ARROWS TO DRIVE</span>
          <AnimatePresence>
            {showExtraControls &&
              ["SPACE TO DRIFT", "B TO HONK"].map((hint, i) => (
                // Fade only: the column grows downward below the car, so
                // nothing above it moves when these appear
                <motion.span
                  key={hint}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: 0.15 + i * 0.15,
                  }}
                >
                  {hint}
                </motion.span>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
