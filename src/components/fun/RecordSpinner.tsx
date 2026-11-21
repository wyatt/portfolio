import { useLastFM } from "use-last-fm";
import styles from "./RecordSpinner.module.css";
import { RiSpotifyFill } from "react-icons/ri";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import clsx from "clsx";

const FALLBACK_LABEL_COLOR = "#1db954";
// Last.fm serves this grey star when a track has no artwork
const LASTFM_PLACEHOLDER_ART = "2a96cbd8b46e442fc41c2b86b821562f";

// Picks the most prominent colour in an image, favouring vivid colours over
// near-black and near-white so the record label isn't drab
const getProminentColor = (img: HTMLImageElement) => {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  // Group similar colours into buckets (4 bits per channel)
  const buckets = new Map<
    number,
    { r: number; g: number; b: number; count: number }
  >();
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, count: 0 };
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    bucket.count++;
    buckets.set(key, bucket);
  }

  // Score each colour: vivid, mid-lightness colours win even when they only
  // cover a small part of the cover (e.g. a title), so area counts sub-linearly
  let best: { rgb: number[]; lightness: number; score: number } | null = null;
  for (const bucket of buckets.values()) {
    const rgb = [bucket.r, bucket.g, bucket.b].map((v) => v / bucket.count);
    const max = Math.max(...rgb);
    const min = Math.min(...rgb);
    const saturation = max === 0 ? 0 : (max - min) / max;
    const lightness = (max + min) / 2 / 255;
    const lightnessWeight = Math.max(0.05, 1 - Math.abs(lightness - 0.5) * 1.6);
    const score =
      Math.sqrt(bucket.count) * Math.pow(0.1 + saturation, 2) * lightnessWeight;
    if (!best || score > best.score) best = { rgb, lightness, score };
  }
  if (!best) return null;

  // Lighten colours that would vanish against the black vinyl
  const MIN_LIGHTNESS = 0.3;
  let rgb = best.rgb;
  if (best.lightness < MIN_LIGHTNESS) {
    const mix = (MIN_LIGHTNESS - best.lightness) / (1 - best.lightness);
    rgb = rgb.map((v) => v + (255 - v) * mix);
  }
  return `rgb(${rgb.map(Math.round).join(", ")})`;
};

const useProminentColor = (url: string | undefined) => {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!url || url.includes(LASTFM_PLACEHOLDER_ART)) {
      setColor(null);
      return;
    }
    let cancelled = false;
    const img = new Image();
    // Needed to read the pixels of an image from another origin
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      try {
        setColor(getProminentColor(img));
      } catch {
        setColor(null); // Image didn't allow cross-origin reads
      }
    };
    img.onerror = () => !cancelled && setColor(null);
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [url]);

  return color;
};

export const RecordSpinner = (props: {
  style: React.CSSProperties;
  shouldAnimate: boolean;
  incrementStep: () => void;
  onReady?: () => void;
}) => {
  const song = useLastFM("wyattsell", "d573f0784116580179348a453766d1df");
  const isReady = props.shouldAnimate;

  // Nothing heavy to prepare; the cover streams in on its own
  const { onReady } = props;
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  const labelColor = useProminentColor(song.song?.art) ?? FALLBACK_LABEL_COLOR;

  return (
    <motion.div
      className={clsx(
        "relative h-28 w-28 z-20",
        song.status === "playing" && "cursor-pointer",
      )}
      style={{
        ...props.style,
      }}
      onClick={() => {
        if (song.status === "playing") {
          window.open(song.song?.url, "_blank");
        }
      }}
      initial={{
        scale: 0,
        opacity: 0,
        x: "-65%",
        y: "-50%",
        rotate: "-10deg",
      }}
      animate={{
        scale: isReady ? 1 : 0,
        opacity: isReady ? 1 : 0,
        x: "-65%",
        y: "-50%",
        rotate: "-10deg",
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
      <div id={styles.album}>
        <div
          id={styles.cover}
          style={{
            [song.song?.art ? "backgroundImage" : "background"]: song.song?.art
              ? `url(${song.song?.art})`
              : "linear-gradient(to right, #1db954, #1db954, #1db954)",
          }}
        />
      </div>
      <div id={styles.vinyl} data-paused={song.status !== "playing"}>
        <div id={styles.print} style={{ backgroundColor: labelColor }} />
      </div>
      <p className="font-sans text-sm text-gray-400 font-semibold uppercase z-30 absolute -bottom-6 left-8 whitespace-nowrap inline-flex items-center gap-1">
        <RiSpotifyFill size={18} />
        {song.status === "playing" ? "NOW PLAYING" : "NOT PLAYING"}
      </p>
    </motion.div>
  );
};
