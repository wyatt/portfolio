import { useEffect, useRef, useState, useMemo } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

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

export const Car = (props: { style: React.CSSProperties }) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

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
    if (!canvasRef.current) return;
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

    // Save context for rotation
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.rotate(position.rotation);

    // Draw car using mustang.png image
    const carImage = new window.Image();
    carImage.src = "/fun/mustang.png";

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

    if (carImage.complete) {
      drawCarWithShadow(ctx);
    } else {
      carImage.onload = () => {
        if (canvasRef.current) {
          const ctx2 = canvasRef.current.getContext("2d");
          if (ctx2) {
            ctx2.save();
            ctx2.translate(position.x, position.y);
            ctx2.rotate(position.rotation);
            // Draw with drop shadow
            drawCarWithShadow(ctx2);
            ctx2.restore();
          }
        }
      };
      // fallback while loading
    }

    // Restore context
    ctx.restore();
  }, [position, leftTrail, rightTrail, canvasRef.current]);

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
