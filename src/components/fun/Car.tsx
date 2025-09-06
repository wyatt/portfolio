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

  // Spring-mass-damper animation state
  const [scaleAnimation, setScaleAnimation] = useState({
    scale: 0,
    velocity: 0,
    target: 1,
    isAnimating: false,
  });

  // Opacity animation state
  const [opacityAnimation, setOpacityAnimation] = useState({
    opacity: 0,
    velocity: 0,
    target: 1,
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

    if (
      props.shouldAnimate &&
      scaleAnimation.scale < 0.95 &&
      opacityAnimation.opacity < 0.95
    ) {
      setScaleAnimation((prev) => ({ ...prev, isAnimating: true }));
      setOpacityAnimation((prev) => ({ ...prev, isAnimating: true }));
    }
  }, [
    scaleAnimation.scale,
    opacityAnimation.opacity,
    props.incrementStep,
    props.shouldAnimate,
  ]);

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

  // Handle keyboard input
  useEffect(() => {
    let decelInterval: NodeJS.Timeout | null = null;
    const handleKeyDown = (e: KeyboardEvent) => {
      setPosition((prev) => {
        const rotationSpeed = 0.1;
        const speedChange = 0.5;
        const maxSpeed = 12;
        const minSpeed = -4;

        switch (e.key) {
          case "ArrowUp":
            return {
              ...prev,
              speed: Math.min(prev.speed + speedChange, maxSpeed),
            };
          case "ArrowDown":
            return {
              ...prev,
              speed: Math.max(prev.speed - speedChange, minSpeed),
            };
          case "ArrowLeft":
            return {
              ...prev,
              rotation: prev.rotation - rotationSpeed,
            };
          case "ArrowRight":
            return {
              ...prev,
              rotation: prev.rotation + rotationSpeed,
            };
          default:
            return prev;
        }
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          // Gradually decelerate to zero
          const deceleration = 0.2;
          const decelerate = () => {
            setPosition((prev) => {
              if (Math.abs(prev.speed) <= deceleration) {
                if (decelInterval) {
                  clearInterval(decelInterval);
                }
                return { ...prev, speed: 0 };
              }
              return {
                ...prev,
                speed:
                  prev.speed > 0
                    ? prev.speed - deceleration
                    : prev.speed + deceleration,
              };
            });
          };
          // Decelerate every 16ms until speed is zero
          decelInterval = setInterval(decelerate, 30);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [position.speed, props.style]);

  useEffect(() => {
    if (position.speed === 0) {
      setResetTimer(
        setTimeout(() => {
          setPosition(ROOT_POS);
        }, 5000)
      );
    }

    return () => {
      clearTimeout(resetTimer ?? undefined);
    };
  }, [ROOT_POS, position.speed]);

  // Spring-mass-damper animation using useAnimationFrame
  useAnimationFrame((time, delta) => {
    const isAnimating =
      scaleAnimation.isAnimating || opacityAnimation.isAnimating;
    if (!isAnimating) return;

    // Update scale animation
    setScaleAnimation((prev) => {
      const springConstant = 200; // Controls spring stiffness
      const damping = 50; // Controls damping (0 = no damping, 1 = critical damping)
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
      const springConstant = 8; // Slightly slower than scale for smoother fade
      const damping = 2.5;
      const mass = 0.1;

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
        <p className="font-sans text-sm text-gray-400 font-semibold uppercase z-30 absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap inline-flex items-center gap-1">
          USE ARROW KEYS TO DRIVE
        </p>
      </div>
    </>
  );
};
