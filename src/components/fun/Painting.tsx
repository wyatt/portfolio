import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import Image from "next/image";
import clsx from "clsx";
import PushButton from "../PushButton";
import { motion } from "motion/react";

const cursorURI = (color: string) =>
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><image href='data:image/png;base64,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' x='0' y='0' width='100' height='100' /><path fill='${color}' d='m20.3 68.4c0 0-7.9 8.5-5.8 11.6 2 3 12 8 13 9.9 1.8 3.7 10.3 4.3 10.3 4.3 0 0 8-0.3 6.7-8.8-0.6-4.2-3.3-3.6-4.9-4-1.6-0.5-3 1.9-5.8 0.1-3.9-2.5 0.1-8.2-8.9-11.9-1.8-0.7-4.6-1.2-4.6-1.2z'/></svg>") 30 87, pointer`;

// Brush class implementation
class Brush {
  private _SPLASHING_BRUSH_SPEED: number = 75;
  private _drops: Drop[] = [];
  private _tip: Hair[] = [];
  private _latestPos: { x: number; y: number } | null = null;
  private _strokeId: string | null = null;

  constructor(
    public x: number = 0,
    public y: number = 0,
    public color: string = "#000",
    public size: number = 35,
    public inkAmount: number = 7,
    public splashing: boolean = false,
    public dripping: boolean = true
  ) {
    this._resetTip();
  }

  isStroke(): boolean {
    return Boolean(this._strokeId);
  }

  startStroke(): void {
    if (this.isStroke()) return;

    this._resetTip();

    // Initialize the latest position to the current brush position
    this._latestPos = { x: this.x, y: this.y };

    // Generate UUID for stroke
    this._strokeId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  endStroke(): void {
    this._strokeId = null;
    this._latestPos = null;
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const isStroke = this.isStroke();
    let dx: number, dy: number;
    let i: number, len: number;

    // Ensure _latestPos exists (it should be initialized in startStroke)
    if (!this._latestPos) return;

    // Update the latest position and set new position
    this._latestPos.x = this.x;
    this._latestPos.y = this.y;
    this.x = x;
    this.y = y;

    if (this._drops.length) {
      const drops = this._drops;
      let drop: Drop;
      const sizeSq = this.size * this.size;

      for (i = 0, len = drops.length; i < len; i++) {
        drop = drops[i];

        dx = this.x - drop.x;
        dy = this.y - drop.y;

        if (
          (isStroke &&
            sizeSq > dx * dx + dy * dy &&
            this._strokeId !== drop.strokeId) ||
          drop.life <= 0
        ) {
          drops.splice(i, 1);
          len--;
          i--;
          continue;
        }

        drop.render(ctx);
      }
    }

    if (isStroke && this._latestPos) {
      const tip = this._tip;
      const strokeId = this._strokeId;
      let dist: number;

      dx = this.x - this._latestPos.x;
      dy = this.y - this._latestPos.y;
      dist = Math.sqrt(dx * dx + dy * dy);

      if (this.splashing && dist > this._SPLASHING_BRUSH_SPEED) {
        const maxNum = ((dist - this._SPLASHING_BRUSH_SPEED) * 0.5) | 0;
        let r: number, a: number, sr: number, sx: number, sy: number;

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (i = 0, len = (maxNum * Math.random()) | 0; i < len; i++) {
          r = (dist - 1) * Math.random() + 1;
          a = Math.PI * 2 * Math.random();
          sr = 5 * Math.random();
          sx = this.x + r * Math.sin(a);
          sy = this.y + r * Math.cos(a);
          ctx.moveTo(sx + sr, sy);
          ctx.arc(sx, sy, sr, 0, Math.PI * 2, false);
        }
        ctx.fill();
        ctx.restore();
      } else if (
        this.dripping &&
        dist < this.inkAmount * 2 &&
        Math.random() < 0.05
      ) {
        this._drops.push(
          new Drop(
            this.x,
            this.y,
            (this.size + this.inkAmount) *
              0.5 *
              ((0.25 - 0.1) * Math.random() + 0.1),
            this.color,
            this._strokeId
          )
        );
      }

      for (i = 0, len = tip.length; i < len; i++) {
        tip[i].render(ctx, dx, dy, dist);
      }
    }
  }

  dispose(): void {
    this._tip.length = 0;
    this._drops.length = 0;
  }

  private _resetTip(): void {
    this._tip = [];
    const tip: Hair[] = this._tip;
    const rad = this.size * 0.5;
    let x0: number,
      y0: number,
      a0: number,
      x1: number,
      y1: number,
      a1: number,
      cv: number,
      sv: number;
    let i: number, len: number;

    a1 = Math.PI * 2 * Math.random();
    len = ((rad * rad * Math.PI) / this.inkAmount) | 0;
    if (len < 1) len = 1;

    for (i = 0; i < len; i++) {
      x0 = rad * Math.random();
      y0 = x0 * 0.5;
      a0 = Math.PI * 2 * Math.random();
      x1 = x0 * Math.sin(a0);
      y1 = y0 * Math.cos(a0);
      cv = Math.cos(a1);
      sv = Math.sin(a1);

      tip.push(
        new Hair(
          this.x + x1 * cv - y1 * sv,
          this.y + x1 * sv + y1 * cv,
          this.inkAmount,
          this.color
        )
      );
    }
  }
}

// Hair class for brush tip
class Hair {
  private _latestPos: { x: number; y: number };

  constructor(
    public x: number = 0,
    public y: number = 0,
    public inkAmount: number = 7,
    public color: string = "#000"
  ) {
    this._latestPos = { x: this.x, y: this.y };
  }

  render(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    offsetLength: number
  ): void {
    this._latestPos.x = this.x;
    this._latestPos.y = this.y;
    this.x += offsetX;
    this.y += offsetY;

    let per = offsetLength ? this.inkAmount / offsetLength : 0;
    if (per > 1) per = 1;
    else if (per < 0) per = 0;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.inkAmount * per;
    ctx.beginPath();
    ctx.moveTo(this._latestPos.x, this._latestPos.y);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.restore();
  }
}

// Drop class for dripping effects
class Drop {
  private _latestPos: { x: number; y: number };
  private _xOffRatio: number = 0;

  constructor(
    public x: number = 0,
    public y: number = 0,
    public size: number = 7,
    public color: string = "#000",
    public strokeId: string | null = null
  ) {
    this.life = this.size * 1.5;
    this._latestPos = { x: this.x, y: this.y };
  }

  life: number;

  render(ctx: CanvasRenderingContext2D): void {
    if (Math.random() < 0.03) {
      this._xOffRatio += 0.06 * Math.random() - 0.03;
    } else if (Math.random() < 0.1) {
      this._xOffRatio *= 0.003;
    }

    this._latestPos.x = this.x;
    this._latestPos.y = this.y;
    this.x += this.life * this._xOffRatio;
    this.y += this.life * 0.5 * Math.random();

    this.life -= (0.05 - 0.01) * Math.random() + 0.01;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size + this.life * 0.3;
    ctx.beginPath();
    ctx.moveTo(this._latestPos.x, this._latestPos.y);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.restore();
  }
}

// Helper functions
const randomColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
};

const random = (max: number, min: number = 0): number => {
  return Math.random() * (max - min) + min;
};

export const Painting = (props: {
  style: React.CSSProperties;
  shouldAnimate: boolean;
  incrementStep: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [brush, setBrush] = useState<Brush | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [useRandomSize] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [color, setColor] = useState("transparent");
  const [previewColor, setPreviewColor] = useState("transparent");
  const [paletteRef, setPaletteRef] = useState<{
    canvas: HTMLCanvasElement;
    cssWidth: number;
    cssHeight: number;
    pixelWidth: number;
    pixelHeight: number;
  } | null>(null);

  // Initialize brush and canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();

    // Initialize brush
    const newBrush = new Brush(canvas.width / 2, canvas.height / 2, color);
    setBrush(newBrush);

    // Handle window resize
    const handleResize = () => {
      resizeCanvas();
      newBrush.dispose();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasRef]);

  // Animation loop
  useEffect(() => {
    if (!brush || !canvasRef.current || !isActivated) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const animate = () => {
      // Only render when actively painting
      if (isPainting) {
        brush.render(ctx, mousePos.x, mousePos.y);
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [brush, mousePos, isActivated, isPainting]);

  // Unified event handlers for both mouse and touch
  const handlePointerStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!brush || !isActivated) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      let x: number, y: number;

      // Handle both mouse and touch events
      if ("touches" in e) {
        // Touch event
        const touch = e.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        // Mouse event
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      // Random color and size on start
      brush.color = color;
      if (useRandomSize && Math.random() < 0.2) {
        brush.size = Math.floor(random(51, 5));
      }

      // Set the brush position before starting the stroke
      brush.x = x;
      brush.y = y;

      // Update position for the animation loop
      setMousePos({ x, y });

      brush.startStroke();
      setIsPainting(true);
    },
    [brush, isActivated, color]
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isPainting || !canvasRef.current || !isActivated) return;

      const rect = canvasRef.current.getBoundingClientRect();
      let x: number, y: number;

      // Handle both mouse and touch events
      if ("touches" in e) {
        // Touch event
        const touch = e.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        // Mouse event
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      setMousePos({ x, y });
    },
    [isPainting, isActivated]
  );

  const handlePointerEnd = useCallback(() => {
    if (!brush || !isActivated) return;

    brush.endStroke();
    setIsPainting(false);
  }, [brush, isActivated]);

  // Update brush properties when controls change
  useEffect(() => {
    if (!brush) return;

    brush.size = 45;
    brush.inkAmount = 7;
    brush.splashing = false;
    brush.dripping = true;
  }, [brush]);

  const setColorAtPosition = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      stateFn: React.Dispatch<React.SetStateAction<string>>
    ) => {
      if (!paletteRef) return;

      const ctx = paletteRef.canvas.getContext("2d");
      if (!ctx) return;

      const boundingRect = paletteRef.canvas.getBoundingClientRect();

      const rect = {
        width: paletteRef.cssWidth,
        height: paletteRef.cssHeight,
        left: boundingRect.left,
        top: boundingRect.top,
      };

      // Set color to the color at the mouse position

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const scaleX = paletteRef.pixelWidth / rect.width;
      const scaleY = paletteRef.pixelHeight / rect.height;

      const imageX = x * scaleX;
      const imageY = y * scaleY;

      const color = ctx.getImageData(
        Math.round(imageX),
        Math.round(imageY),
        1,
        1
      ).data;

      stateFn(`rgb(${color[0]},${color[1]},${color[2]})`);
    },
    [paletteRef]
  );

  // Clear canvas function
  const clearCanvas = useCallback(() => {
    if (!canvasRef.current || !brush) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fade out the canvas by animating opacity, then clear
    canvas.style.transition = "opacity 0.5s";
    canvas.style.opacity = "0";

    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      brush.dispose();
      canvas.style.opacity = "0.7";
    }, 500);
  }, [brush]);

  const isReady = useMemo(() => {
    return paletteRef && canvasRef.current && props.shouldAnimate;
  }, [paletteRef, canvasRef.current, props.shouldAnimate]);

  return (
    <>
      <motion.div
        className={clsx("absolute z-30 pointer-events-none")}
        style={{
          ...props.style,
          display: "inline-block",
          filter: isActivated
            ? "drop-shadow(0 0 7px rgba(0, 0, 0, 0.5))"
            : "none",
        }}
        initial={{
          scale: 0,
          opacity: 0,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          scale: isReady ? 1 : 0,
          opacity: isReady ? 1 : 0,
          x: "-50%",
          y: "-50%",
        }}
        whileHover={{ scale: 1.1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        onAnimationComplete={() => {
          if (isReady) {
            props.incrementStep();
          }
        }}
      >
        <canvas
          ref={useCallback((node: HTMLCanvasElement | null) => {
            if (!node) return;
            const ctx = node.getContext("2d");
            if (!ctx) return;
            const img = new window.Image();
            img.src = "/fun/palette/palette.png";
            img.onload = () => {
              // Set canvas size to match rendered height (9rem = 144px), maintaining aspect ratio
              // But use devicePixelRatio to make the backing store higher-res for sharpness
              const targetHeightCSS = 144; // 9rem in px
              const aspect = img.width / img.height;
              const dpr = window.devicePixelRatio || 1;

              // Set the canvas's internal pixel size for high-DPI screens
              node.height = Math.round(targetHeightCSS * dpr);
              node.width = Math.round(targetHeightCSS * aspect * dpr);

              // Set the CSS size to keep it visually the same
              node.style.height = "9rem";
              node.style.width = `${Math.round(targetHeightCSS * aspect)}px`;
              node.style.maxHeight = "9rem";
              node.style.display = "block";
              node.style.filter = "drop-shadow(0 0 7px rgba(0, 0, 0, 0.5))";

              // Draw the image at native resolution, scaled for devicePixelRatio
              ctx.clearRect(0, 0, node.width, node.height);
              ctx.drawImage(img, 0, 0, node.width, node.height);

              // Store both the canvas element and its dimensions for accurate calculations
              setPaletteRef({
                canvas: node,
                cssWidth: Math.round(targetHeightCSS * aspect),
                cssHeight: targetHeightCSS,
                pixelWidth: node.width,
                pixelHeight: node.height,
              });
            };
          }, [])}
          style={{
            height: "9rem", // h-36 = 9rem
            width: "auto",
            maxHeight: "9rem",
            display: "block",
            filter: "drop-shadow(0 0 7px rgba(0, 0, 0, 0.5))",
            pointerEvents: "none",
          }}
        />
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-auto"
          style={{
            clipPath:
              "polygon(5.00% 45.20%, 4.69% 53.20%, 6.25% 60.80%, 11.56% 71.20%, 17.81% 80.00%, 27.19% 87.60%, 36.88% 92.00%, 46.56% 94.80%, 65.63% 94.80%, 77.81% 89.60%, 82.19% 86.80%, 84.69% 84.80%, 89.06% 78.40%, 93.75% 66.80%, 95.00% 61.20%, 95.00% 52.00%, 94.06% 46.40%, 90.31% 34.80%, 86.88% 29.20%, 79.38% 21.20%, 67.81% 13.20%, 59.06% 8.40%, 48.13% 5.20%, 43.44% 4.40%, 34.06% 5.20%, 27.19% 9.20%, 25.62% 13.20%, 25.62% 18.40%, 27.50% 26.40%, 30.00% 31.60%, 29.69% 34.80%, 27.19% 36.80%, 12.19% 36.00%, 8.44% 38.40%, 6.25% 41.60%, 5.00% 45.20%)",
            cursor: cursorURI(previewColor),
          }}
          onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
            setColorAtPosition(e, setPreviewColor);
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            setIsActivated(true);
            setColorAtPosition(e, setColor);
          }}
        />

        <p className="font-sans text-sm text-gray-400 font-semibold uppercase z-30 absolute -bottom-4 left-12 whitespace-nowrap inline-flex items-center gap-1">
          CLICK TO PAINT
        </p>
      </motion.div>

      <canvas
        ref={canvasRef}
        className={clsx("absolute top-0 left-0 w-full h-full z-20 opacity-70")}
        onMouseDown={handlePointerStart}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerEnd}
        onMouseUp={handlePointerEnd}
        onTouchStart={handlePointerStart}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerEnd}
        style={{
          touchAction: "none",
          pointerEvents: isActivated ? "auto" : "none",
          cursor: cursorURI(color),
        }}
      />
      {isActivated && (
        <div className="absolute top-0 right-0 flex justify-end m-8">
          <div className="relative flex gap-2 z-20">
            <PushButton
              onClick={clearCanvas}
              colors={{
                front: "bg-gray-600",
                edge: "bg-gray-800",
              }}
              className="relative"
            >
              Clear
            </PushButton>

            <PushButton
              onClick={() => {
                clearCanvas();
                setIsActivated(false);
              }}
              colors={{
                front: "bg-red-500",
                edge: "bg-red-800",
              }}
              className="relative"
            >
              Exit
            </PushButton>
          </div>
        </div>
      )}
    </>
  );
};
