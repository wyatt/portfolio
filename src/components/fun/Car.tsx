import {
  useEffect,
  useRef,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useAnimationFrame } from "motion/react";

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  maxAge: number;
}

interface TrailLine {
  points: TrailPoint[];
  maxAge: number;
}

const WIDTH = 110;
const ASPECT_RATIO = 300 / 450;

export const Car = (props: {
  style: React.CSSProperties;
  shouldAnimate: boolean;
  incrementStep: () => void;
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [position, setPosition] = useState<{
    x: number;
    y: number;
    rotation: number;
    speed: number;
  }>({
    x: 0, // Temporary initial value
    y: 0,
    rotation: 0,
    speed: 0,
  });

  // Track which keys are currently pressed
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Physics state for smooth acceleration/deceleration
  const [physics, setPhysics] = useState({
    targetSpeed: 0,
    currentSpeed: 0,
    targetRotation: 0,
    currentRotation: 0,
  });

  // Smooth transition state for reset
  const [resetTransition, setResetTransition] = useState({
    isTransitioning: false,
    targetX: 0,
    targetY: 0,
    targetRotation: 0,
    startX: 0,
    startY: 0,
    startRotation: 0,
    progress: 0,
  });

  // Track if mouse is over the car for cursor styling
  const [isMouseOverCar, setIsMouseOverCar] = useState(false);

  // Spring-mass-damper animation state
  const [scaleAnimation, setScaleAnimation] = useState({
    scale: 0,
    velocity: 0,
    target: 0,
    isAnimating: false,
  });

  // Opacity animation state
  const [opacityAnimation, setOpacityAnimation] = useState({
    opacity: 0,
    velocity: 0,
    target: 0,
    isAnimating: false,
  });

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

  useEffect(() => {
    if (scaleAnimation.scale > 0.95 && opacityAnimation.opacity > 0.95) {
      props.incrementStep();
    }
  }, [scaleAnimation.scale, opacityAnimation.opacity, props.incrementStep]);

  // Handle animation based on shouldAnimate prop changes only
  useEffect(() => {
    if (props.shouldAnimate) {
      // Animate to visible state (scale and opacity to 1)
      setScaleAnimation((prev) => ({ ...prev, target: 1, isAnimating: true }));
      setOpacityAnimation((prev) => ({
        ...prev,
        target: 1,
        isAnimating: true,
      }));
    } else {
      // Animate to hidden state (scale and opacity to 0)
      setScaleAnimation((prev) => ({ ...prev, target: 0, isAnimating: true }));
      setOpacityAnimation((prev) => ({
        ...prev,
        target: 0,
        isAnimating: true,
      }));
    }
  }, [props.shouldAnimate]);

  // Calculate ROOT_POS using useMemo to ensure it's recalculated when dependencies change
  const ROOT_POS = useMemo(
    () => ({
      x: props.style.left as number,
      y:
        (parseInt((props.style.top as string).split("%")[0]) / 100) *
        (windowHeight || window.innerHeight),
      rotation: 0.2,
      speed: 0,
    }),
    [props.style.left, props.style.top, windowWidth, windowHeight]
  );

  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);
  const [leftTrail, setLeftTrail] = useState<TrailLine>({
    points: [],
    maxAge: 1500,
  });
  const [rightTrail, setRightTrail] = useState<TrailLine>({
    points: [],
    maxAge: 1500,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize position with correct ROOT_POS after component mounts
  useEffect(() => {
    setPosition(ROOT_POS);
    // Set initial rotation to 0.2 when component first loads
    setPhysics((prev) => ({
      ...prev,
      targetRotation: 0.2,
      currentRotation: 0.2,
    }));
  }, [ROOT_POS]);

  // Play audio, loop smoothly while in motion, adjust volume by speed, stop when stopped
  // useEffect(() => {
  //   // Create audio only once
  //   if (!audioRef.current) {
  //     audioRef.current = new Audio("/fun/car-engine.mp3");
  //     audioRef.current.loop = false; // We'll handle looping manually for smoothness
  //     audioRef.current.volume = 0;
  //   }
  //   const audio = audioRef.current;

  //   // Duration to trim from start/end for smooth loop (in seconds)
  //   const TRIM = 0.235;

  //   // Helper to handle smooth looping
  //   const handleTimeUpdate = () => {
  //     if (audio.duration && audio.currentTime > audio.duration - TRIM) {
  //       audio.currentTime = TRIM;
  //       audio.play().catch(() => {});
  //     }
  //   };

  //   if (position.speed > 0) {
  //     // Set volume based on speed (clamp between 0.2 and 1)
  //     const minVol = 0.4;
  //     const maxVol = 1;
  //     const maxSpeed = 12;
  //     const vol = Math.min(
  //       maxVol,
  //       minVol + (Math.abs(position.speed) / maxSpeed) * (maxVol - minVol)
  //     );
  //     audio.volume = vol;

  //     // Attach timeupdate for smooth loop
  //     audio.removeEventListener("timeupdate", handleTimeUpdate);
  //     audio.addEventListener("timeupdate", handleTimeUpdate);

  //     // Play if not already playing, start at TRIM for smoothness
  //     if (audio.paused) {
  //       audio.currentTime = TRIM;
  //       audio.play().catch(() => {});
  //     }
  //   } else {
  //     // Pause and reset if stopped
  //     audio.removeEventListener("timeupdate", handleTimeUpdate);
  //     if (!audio.paused) {
  //       audio.pause();
  //       audio.currentTime = 0;
  //     }
  //     audio.volume = 0;
  //   }

  //   return () => {
  //     audio.removeEventListener("timeupdate", handleTimeUpdate);
  //     if (audio) {
  //       audio.pause();
  //       audio.currentTime = 0;
  //       audio.volume = 0;
  //     }
  //   };
  // }, [position.speed]);

  // Handle keyboard input with proper key tracking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        setPressedKeys((prev) => new Set(prev).add(e.key));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        setPressedKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(e.key);
          return newSet;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Track if the car has ever been driven to prevent initial reset timer
  const [hasBeenDriven, setHasBeenDriven] = useState(false);

  // Handle reset timeout - 5 seconds after speed becomes 0, cancel if speed increases
  useEffect(() => {
    // Clear any existing timer when speed changes
    if (resetTimer) {
      clearTimeout(resetTimer);
      setResetTimer(null);
    }

    // Only start timer when speed becomes 0 AND the car has been driven before
    if (Math.abs(position.speed) < 0.01 && hasBeenDriven) {
      const timer = setTimeout(() => {
        // Start smooth transition back to original position
        setResetTransition({
          isTransitioning: true,
          targetX: ROOT_POS.x,
          targetY: ROOT_POS.y,
          targetRotation: ROOT_POS.rotation,
          startX: position.x,
          startY: position.y,
          startRotation: position.rotation,
          progress: 0,
        });
        setPhysics((prev) => ({
          ...prev,
          targetSpeed: 0,
          currentSpeed: 0,
        }));
        setResetTimer(null);
      }, 5000);

      setResetTimer(timer);
    }

    return () => {
      if (resetTimer) {
        clearTimeout(resetTimer);
      }
    };
  }, [ROOT_POS, position.speed, hasBeenDriven]);

  // Check if a point is within the car's bounds
  const isPointInCar = (mouseX: number, mouseY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const rect = canvas.getBoundingClientRect();
    const canvasX = mouseX - rect.left;
    const canvasY = mouseY - rect.top;

    // Car dimensions
    const carWidth = WIDTH;
    const carHeight = WIDTH / ASPECT_RATIO;

    // Calculate car bounds in canvas coordinates
    const carLeft = position.x - carWidth / 2;
    const carRight = position.x + carWidth / 2;
    const carTop = position.y - carHeight / 2;
    const carBottom = position.y + carHeight / 2;

    // Simple rectangular bounds check (not accounting for rotation for simplicity)
    return (
      canvasX >= carLeft &&
      canvasX <= carRight &&
      canvasY >= carTop &&
      canvasY <= carBottom
    );
  };

  // Handle mouse move to update cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const isOverCar = isPointInCar(e.clientX, e.clientY);
    setIsMouseOverCar(isOverCar);
  };

  // Handle mouse leave to reset cursor
  const handleMouseLeave = () => {
    setIsMouseOverCar(false);
  };

  // Handle click to reset car to original position
  const handleCarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent default and stop propagation to avoid triggering underlying elements
    e.preventDefault();
    e.stopPropagation();

    // Clear any existing reset timer
    if (resetTimer) {
      clearTimeout(resetTimer);
      setResetTimer(null);
    }

    // Start smooth transition back to original position
    setResetTransition({
      isTransitioning: true,
      targetX: ROOT_POS.x,
      targetY: ROOT_POS.y,
      targetRotation: ROOT_POS.rotation,
      startX: position.x,
      startY: position.y,
      startRotation: position.rotation,
      progress: 0,
    });
    setPhysics((prev) => ({
      ...prev,
      targetSpeed: 0,
      currentSpeed: 0,
    }));
  };

  // Combined animation frame loop for physics and UI animations
  useAnimationFrame((time, delta) => {
    const deltaSeconds = delta / 1000;

    // Handle smooth reset transition
    if (resetTransition.isTransitioning) {
      const transitionSpeed = 2.0; // How fast the transition happens
      const newProgress = Math.min(
        1,
        resetTransition.progress + transitionSpeed * deltaSeconds
      );

      if (newProgress >= 1) {
        // Transition complete
        setPosition((prev) => ({
          ...prev,
          x: resetTransition.targetX,
          y: resetTransition.targetY,
          rotation: resetTransition.targetRotation,
          speed: 0,
        }));
        setPhysics((prev) => ({
          ...prev,
          targetRotation: resetTransition.targetRotation,
          currentRotation: resetTransition.targetRotation,
        }));
        setResetTransition((prev) => ({ ...prev, isTransitioning: false }));
      } else {
        // Interpolate position during transition
        const easeProgress = 1 - Math.pow(1 - newProgress, 3); // Ease-out cubic
        const newX =
          resetTransition.startX +
          (resetTransition.targetX - resetTransition.startX) * easeProgress;
        const newY =
          resetTransition.startY +
          (resetTransition.targetY - resetTransition.startY) * easeProgress;
        const newRotation =
          (resetTransition.startRotation % (2 * Math.PI)) +
          (resetTransition.targetRotation -
            (resetTransition.startRotation % (2 * Math.PI))) *
            easeProgress;

        setPosition((prev) => ({
          ...prev,
          x: newX,
          y: newY,
          rotation: newRotation,
          speed: 0,
        }));
        setPhysics((prev) => ({
          ...prev,
          targetRotation: newRotation,
          currentRotation: newRotation,
        }));
        setResetTransition((prev) => ({ ...prev, progress: newProgress }));
      }
    }

    // Physics update for smooth acceleration/deceleration and rotation
    // Skip physics updates during reset transitions
    if (!resetTransition.isTransitioning) {
      setPhysics((prevPhysics) => {
        // Calculate target speed based on pressed keys
        let targetSpeed = 0;
        if (pressedKeys.has("ArrowUp")) {
          targetSpeed = 12; // Forward speed
        } else if (pressedKeys.has("ArrowDown")) {
          targetSpeed = -6; // Reverse speed (slower)
        }

        // Mark that the car has been driven if any movement keys are pressed
        if (
          pressedKeys.has("ArrowUp") ||
          pressedKeys.has("ArrowDown") ||
          pressedKeys.has("ArrowLeft") ||
          pressedKeys.has("ArrowRight")
        ) {
          setHasBeenDriven(true);
        }

        // Calculate target rotation based on pressed keys
        let targetRotation = prevPhysics.targetRotation;
        if (pressedKeys.has("ArrowLeft")) {
          targetRotation -= 0.05; // Turn left
        }
        if (pressedKeys.has("ArrowRight")) {
          targetRotation += 0.05; // Turn right
        }

        // Smooth acceleration/deceleration
        const acceleration = 0.5; // How fast to reach target speed

        let newSpeed = prevPhysics.currentSpeed;
        if (Math.abs(targetSpeed) > 0) {
          // Accelerating
          const speedDiff = targetSpeed - prevPhysics.currentSpeed;
          newSpeed += speedDiff * acceleration * deltaSeconds;
        } else {
          // Decelerating (much slower)
          newSpeed *= Math.pow(0.95, deltaSeconds * 20); // Exponential decay
          if (Math.abs(newSpeed) < 0.01) {
            newSpeed = 0;
          }
        }

        // Smooth rotation
        const rotationSpeed = 2.0; // How fast to reach target rotation
        const rotationDiff = targetRotation - prevPhysics.currentRotation;
        const newRotation =
          prevPhysics.currentRotation +
          rotationDiff * rotationSpeed * deltaSeconds;

        // Update position with new physics values
        setPosition((prevPos) => ({
          ...prevPos,
          speed: newSpeed,
          rotation: newRotation,
        }));

        return {
          targetSpeed,
          currentSpeed: newSpeed,
          targetRotation,
          currentRotation: newRotation,
        };
      });
    }

    // Spring-mass-damper animation for UI elements
    const isAnimating =
      scaleAnimation.isAnimating || opacityAnimation.isAnimating;
    if (!isAnimating) return;

    // Update scale animation
    setScaleAnimation((prev) => {
      const springConstant = 300; // Controls spring stiffness
      const damping = 20;
      const mass = 1; // Mass of the object

      // Calculate spring force (F = -kx)
      const displacement = prev.target - prev.scale;
      const springForce = springConstant * displacement;

      // Calculate damping force (F = -cv)
      const dampingForce = damping * prev.velocity;

      // Calculate acceleration (F = ma, so a = F/m)
      const acceleration = (springForce - dampingForce) / mass;

      // Update velocity and position using Euler integration
      const newVelocity = prev.velocity + acceleration * (delta / 1000); // Convert delta to seconds
      const newScale = prev.scale + newVelocity * (delta / 1000);

      // Check if animation is complete (close enough to target and low velocity)
      const isComplete =
        Math.abs(newScale - prev.target) < 0.001 &&
        Math.abs(newVelocity) < 0.001;

      return {
        scale: Math.max(0, newScale), // Ensure scale doesn't go below 0
        velocity: newVelocity,
        target: prev.target,
        isAnimating: !isComplete,
      };
    });

    // Update opacity animation
    setOpacityAnimation((prev) => {
      const springConstant = 300; // Match scale animation speed
      const damping = 20;
      const mass = 1;

      // Calculate spring force (F = -kx)
      const displacement = prev.target - prev.opacity;
      const springForce = springConstant * displacement;

      // Calculate damping force (F = -cv)
      const dampingForce = damping * prev.velocity;

      // Calculate acceleration (F = ma, so a = F/m)
      const acceleration = (springForce - dampingForce) / mass;

      // Update velocity and position using Euler integration
      const newVelocity = prev.velocity + acceleration * (delta / 1000);
      const newOpacity = prev.opacity + newVelocity * (delta / 1000);

      // Check if animation is complete
      const isComplete =
        Math.abs(newOpacity - prev.target) < 0.001 &&
        Math.abs(newVelocity) < 0.001;

      return {
        opacity: Math.max(0, Math.min(1, newOpacity)), // Clamp between 0 and 1
        velocity: newVelocity,
        target: prev.target,
        isAnimating: !isComplete,
      };
    });
  });

  // Update position based on speed and rotation using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      setPosition((prev) => {
        // Remove old points from trails even if not moving
        const now = Date.now();
        setLeftTrail((prevTrail) => {
          const filteredPoints = prevTrail.points.filter(
            (point) => now - point.age < point.maxAge
          );
          return { ...prevTrail, points: filteredPoints };
        });
        setRightTrail((prevTrail) => {
          const filteredPoints = prevTrail.points.filter(
            (point) => now - point.age < point.maxAge
          );
          return { ...prevTrail, points: filteredPoints };
        });

        if (Math.abs(prev.speed) < 0.1) {
          return prev; // Don't move if speed is very low
        }

        const newX = prev.x + Math.sin(prev.rotation) * prev.speed;
        const newY = prev.y - Math.cos(prev.rotation) * prev.speed;

        // Get canvas dimensions for wrapping
        const canvas = canvasRef.current;
        if (!canvas) return prev;
        const width = canvas.width / (window.devicePixelRatio || 1);
        const height = canvas.height / (window.devicePixelRatio || 1);

        // Wrap around screen edges
        const wrappedX = newX < 0 ? width : newX > width ? 0 : newX;
        const wrappedY = newY < 0 ? height : newY > height ? 0 : newY;

        // Add trail points for back wheels when moving
        if (Math.abs(prev.speed) > 0.1) {
          // Back wheels are at y=12 (back of car) and x=-18 and x=14
          const backWheelY = 50; // Distance from center to back of car
          const leftBackWheelX = WIDTH * 0.3 - WIDTH / 2; // Left wheel x offset
          const rightBackWheelX = WIDTH * 0.7 - WIDTH / 2; // Right wheel x offset

          // Calculate wheel positions in world coordinates
          const leftBackWheelWorldX =
            wrappedX +
            Math.cos(prev.rotation) * leftBackWheelX -
            Math.sin(prev.rotation) * backWheelY;
          const leftBackWheelWorldY =
            wrappedY +
            Math.sin(prev.rotation) * leftBackWheelX +
            Math.cos(prev.rotation) * backWheelY;
          const rightBackWheelWorldX =
            wrappedX +
            Math.cos(prev.rotation) * rightBackWheelX -
            Math.sin(prev.rotation) * backWheelY;
          const rightBackWheelWorldY =
            wrappedY +
            Math.sin(prev.rotation) * rightBackWheelX +
            Math.cos(prev.rotation) * backWheelY;

          const now = Date.now();

          // Update left trail
          setLeftTrail((prevTrail) => {
            const newPoints = [
              ...prevTrail.points,
              {
                x: leftBackWheelWorldX,
                y: leftBackWheelWorldY,
                age: now,
                maxAge: prevTrail.maxAge,
              },
            ];
            return { ...prevTrail, points: newPoints };
          });

          // Update right trail
          setRightTrail((prevTrail) => {
            const newPoints = [
              ...prevTrail.points,
              {
                x: rightBackWheelWorldX,
                y: rightBackWheelWorldY,
                age: now,
                maxAge: prevTrail.maxAge,
              },
            ];
            return { ...prevTrail, points: newPoints };
          });
        }

        return {
          ...prev,
          x: wrappedX,
          y: wrappedY,
        };
      });

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [canvasRef.current, props.style, position.speed]);

  // Handle canvas sizing and resize
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Set canvas size to match display size
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Set device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, [windowWidth, windowHeight]);

  // Draw the car
  useEffect(() => {
    if (!canvasRef.current || !imageLoaded) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw trails first (behind the car)
    const now = Date.now();

    // Draw left trail line
    if (leftTrail.points.length > 1) {
      ctx.save();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Group points by opacity and distance to create discontinuous segments
      const segments: TrailPoint[][] = [];
      let currentSegment: TrailPoint[] = [];
      const maxDistance = 50; // Maximum distance between consecutive points

      leftTrail.points.forEach((point, index) => {
        const age = now - point.age;
        const opacity = Math.max(0, 1 - age / point.maxAge);

        if (opacity > 0) {
          // Check if this point is too far from the previous point
          if (currentSegment.length > 0) {
            const prevPoint = currentSegment[currentSegment.length - 1];
            const distance = Math.sqrt(
              Math.pow(point.x - prevPoint.x, 2) +
                Math.pow(point.y - prevPoint.y, 2)
            );

            if (distance > maxDistance) {
              // Start a new segment
              segments.push([...currentSegment]);
              currentSegment = [];
            }
          }
          currentSegment.push(point);
        } else if (currentSegment.length > 0) {
          segments.push([...currentSegment]);
          currentSegment = [];
        }
      });

      if (currentSegment.length > 0) {
        segments.push(currentSegment);
      }

      // Draw each segment separately
      segments.forEach((segment) => {
        if (segment.length > 1) {
          ctx.beginPath();
          segment.forEach((point, index) => {
            const age = now - point.age;
            const opacity = Math.max(0, 1 - age / point.maxAge);
            ctx.globalAlpha = opacity * 0.6;

            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              // Smooth interpolation between points
              const prevPoint = segment[index - 1];
              const midX = (prevPoint.x + point.x) / 2;
              const midY = (prevPoint.y + point.y) / 2;
              ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY);
            }
          });
          ctx.stroke();
        }
      });
      ctx.restore();
    }

    // Draw right trail line
    if (rightTrail.points.length > 1) {
      ctx.save();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Group points by opacity and distance to create discontinuous segments
      const segments: TrailPoint[][] = [];
      let currentSegment: TrailPoint[] = [];
      const maxDistance = 50; // Maximum distance between consecutive points

      rightTrail.points.forEach((point, index) => {
        const age = now - point.age;
        const opacity = Math.max(0, 1 - age / point.maxAge);

        if (opacity > 0) {
          // Check if this point is too far from the previous point
          if (currentSegment.length > 0) {
            const prevPoint = currentSegment[currentSegment.length - 1];
            const distance = Math.sqrt(
              Math.pow(point.x - prevPoint.x, 2) +
                Math.pow(point.y - prevPoint.y, 2)
            );

            if (distance > maxDistance) {
              // Start a new segment
              segments.push([...currentSegment]);
              currentSegment = [];
            }
          }
          currentSegment.push(point);
        } else if (currentSegment.length > 0) {
          segments.push([...currentSegment]);
          currentSegment = [];
        }
      });

      if (currentSegment.length > 0) {
        segments.push(currentSegment);
      }

      // Draw each segment separately
      segments.forEach((segment) => {
        if (segment.length > 1) {
          ctx.beginPath();

          // Start at first point
          ctx.moveTo(segment[0].x, segment[0].y);

          // Draw smooth curves through all points
          for (let i = 1; i < segment.length; i++) {
            const currentPoint = segment[i];
            const prevPoint = segment[i - 1];

            if (i === segment.length - 1) {
              // Last point - draw straight line
              ctx.lineTo(currentPoint.x, currentPoint.y);
            } else {
              // Middle points - use quadratic curves for smoothness
              const nextPoint = segment[i + 1];
              const cp1x = (prevPoint.x + currentPoint.x) / 2;
              const cp1y = (prevPoint.y + currentPoint.y) / 2;
              const cp2x = (currentPoint.x + nextPoint.x) / 2;
              const cp2y = (currentPoint.y + nextPoint.y) / 2;

              ctx.quadraticCurveTo(cp1x, cp1y, cp2x, cp2y);
            }
          }

          // Set opacity based on the segment's average age
          const avgAge =
            segment.reduce((sum, point) => sum + (now - point.age), 0) /
            segment.length;
          const avgOpacity = Math.max(0, 1 - avgAge / segment[0].maxAge);
          ctx.globalAlpha = avgOpacity * 0.6;

          ctx.stroke();
        }
      });
      ctx.restore();
    }

    // Save context for rotation, scaling, and opacity
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(scaleAnimation.scale, scaleAnimation.scale);
    ctx.globalAlpha = opacityAnimation.opacity;
    ctx.rotate(position.rotation);

    // Drop shadow settings
    const shadowColor = "rgba(0,0,0,0.7)";
    const shadowBlur = 16;
    const shadowOffsetX = 0;
    const shadowOffsetY = 6;

    const drawCarWithShadow = (ctxToUse: CanvasRenderingContext2D) => {
      ctxToUse.save();
      // Set drop shadow
      ctxToUse.shadowColor = shadowColor;
      ctxToUse.shadowBlur = shadowBlur;
      ctxToUse.shadowOffsetX = shadowOffsetX;
      ctxToUse.shadowOffsetY = shadowOffsetY;
      ctxToUse.drawImage(
        carImage,
        -WIDTH / 2,
        -WIDTH / ASPECT_RATIO / 2,
        WIDTH,
        WIDTH / ASPECT_RATIO
      );
      ctxToUse.restore();
    };

    // Only draw if image is loaded and animations are ready
    if (
      imageLoaded &&
      scaleAnimation.scale > 0.01 &&
      opacityAnimation.opacity > 0.01
    ) {
      drawCarWithShadow(ctx);
    }

    // Restore context
    ctx.restore();
  }, [
    position,
    leftTrail,
    rightTrail,
    scaleAnimation.scale,
    opacityAnimation.opacity,
    imageLoaded,
    carImage,
    canvasRef.current,
  ]);

  return (
    <>
      {/* Global mouse tracking overlay */}
      <div
        className="absolute w-full h-full top-0 left-0 z-50"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: isMouseOverCar ? "pointer" : "default",
          pointerEvents: "none",
        }}
      />
      {/* Clickable area that follows the car */}
      <div
        className="absolute z-40"
        onClick={handleCarClick}
        style={{
          left: position.x - WIDTH / 2,
          top: position.y - WIDTH / ASPECT_RATIO / 2,
          width: WIDTH,
          height: WIDTH / ASPECT_RATIO,
          pointerEvents: "auto",
          cursor: "pointer",
        }}
      />
      <canvas
        className="absolute w-full h-full top-0 left-0 transition z-100 pointer-events-none"
        ref={canvasRef}
      ></canvas>
      <div
        style={{
          top: ROOT_POS.y,
          left: ROOT_POS.x,
          width: WIDTH * 0.95,
          height: (WIDTH / ASPECT_RATIO) * 1.05,
          // border: "3px solid #cdcdcd",
          position: "absolute",
          transform: `translate(-50%, -50%) rotate(${ROOT_POS.rotation}rad)`,
          pointerEvents: "none",
        }}
      >
        <p
          className="font-sans text-sm text-gray-400 font-semibold uppercase z-30 absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap inline-flex items-center gap-1"
          style={{
            opacity: opacityAnimation.opacity,
            transform: `scale(${scaleAnimation.scale})`,
          }}
        >
          USE ARROW KEYS TO DRIVE
        </p>
      </div>
    </>
  );
};
