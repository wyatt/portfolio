import { useLastFM } from "use-last-fm";
import styles from "./RecordSpinner.module.css";
import { RiSpotifyFill } from "react-icons/ri";

export const RecordSpinner = (props: { style: React.CSSProperties }) => {
  const song = useLastFM("wyattsell", "d573f0784116580179348a453766d1df");

  return (
    <div
      className="relative h-28 w-28 hover:scale-110 z-20 transition-all duration-300 cursor-pointer"
      style={{
        ...props.style,
        transform: `translate(-65%, -50%) rotate(-10deg)`,
      }}
      onClick={() => {
        window.open(song.song?.url, "_blank");
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
    </div>
  );
};
