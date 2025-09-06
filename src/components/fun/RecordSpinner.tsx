import { useLastFM } from "use-last-fm";
import styles from "./RecordSpinner.module.css";
import { RiSpotifyFill } from "react-icons/ri";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { motion } from "motion/react";
import clsx from "clsx";

export const RecordSpinner = (props: {
  style: React.CSSProperties;
  shouldAnimate: boolean;
  incrementStep: () => void;
}) => {
  const song = useLastFM("wyattsell", "d573f0784116580179348a453766d1df");
  const isReady = props.shouldAnimate;

  return (
    <motion.div
      className={clsx(
        "relative h-28 w-28 z-20",
        song.status === "playing" && "cursor-pointer"
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
        <div id={styles.print} />
      </div>
      <p className="font-sans text-sm text-gray-400 font-semibold uppercase z-30 absolute -bottom-6 left-8 whitespace-nowrap inline-flex items-center gap-1">
        <RiSpotifyFill size={18} />
        {song.status === "playing" ? "NOW PLAYING" : "NOT PLAYING"}
      </p>
    </motion.div>
  );
};
