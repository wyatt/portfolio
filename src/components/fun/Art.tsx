import clsx from "clsx";
import styles from "./Art.module.css";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import { dropShadow } from "./shadows";

export const Art = (props: {
  style: React.CSSProperties;
  shouldAnimate: boolean;
  incrementStep: () => void;
  onReady?: () => void;
}) => {
  const art = ARTWORK;
  const [artIdx, setCurrentArtIdx] = useState<number>(0);
  const [prevArtIdx, setPrevArtIdx] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isArtDecoded, setIsArtDecoded] = useState(false);

  // Decode every painting up front so neither the zoom-in nor a crossfade
  // has to decode a large image mid-animation
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      art.map((artwork) => {
        const img = new Image();
        img.src = artwork.image_url;
        return img.decode().catch(() => {});
      })
    ).then(() => !cancelled && setIsArtDecoded(true));
    return () => {
      cancelled = true;
    };
  }, [art]);

  const { onReady } = props;
  useEffect(() => {
    if (isLoaded && isArtDecoded) onReady?.();
  }, [isLoaded, isArtDecoded, onReady]);

  useEffect(() => {
    const intervalCurrent = setInterval(() => {
      setCurrentArtIdx((prev) => (prev + 1) % art.length);
      setTimeout(() => {
        setPrevArtIdx((prev) => (prev + 1) % art.length);
      }, 2500);
    }, 5000);
    return () => clearInterval(intervalCurrent);
  }, [art]);

  const isReady = useMemo(() => {
    return isLoaded && art.length > 0 && props.shouldAnimate;
  }, [isLoaded, art, props.shouldAnimate]);

  return (
    <motion.div
      className={clsx("absolute h-48 w-72 cursor-pointer")}
      style={{
        ...props.style,
      }}
      onClick={() => {
        window.open(art[artIdx].url, "_blank");
      }}
      initial={{
        scale: 0,
        opacity: 0,
        x: "50%",
        y: "-50%",
        rotate: "-10deg",
      }}
      animate={{
        scale: isReady ? 1 : 0,
        opacity: isReady ? 1 : 0,
        x: "50%",
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
      <img
        src="/fun/picture_frame.png"
        alt="Picture Frame"
        className="h-full absolute z-10"
        onLoad={() => {
          console.log("loaded");
          setIsLoaded(true);
        }}
        style={{
          filter: dropShadow("mid"),
        }}
      />
      {art.length > 0 && (
        <div className="relative px-14 pt-12 pb-10 w-full h-full box-border">
          <img
            src={art[prevArtIdx].image_url}
            alt={"Previous Image"}
            className={clsx(
              "absolute top-0 left-0 w-full h-full object-cover",
              styles["prev-image"]
            )}
            style={{
              padding: "inherit",
            }}
          />
          <img
            src={art[artIdx].image_url}
            alt={art[artIdx].title}
            className={clsx(
              "absolute top-0 left-0 w-full h-full object-cover",
              styles["current-image"]
            )}
            style={{
              padding: "inherit",
            }}
            key={artIdx}
          />
          <div
            className="absolute w-42 h-26 top-12 left-15"
            style={{
              boxShadow: "inset 0 0 7px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
      )}
      {art.length > 0 && (
        <p className="text-sm text-gray-400 font-semibold font-sans uppercase z-30 text-center w-full px-8">
          {art[artIdx].title}
          <br />
          <i>{art[artIdx].artist}</i>
        </p>
      )}
    </motion.div>
  );
};

const CONSTABLE = "John Constable";

// Public domain images from the Art Institute of Chicago and The Met (CC0)
const ARTWORK = [
  {
    title: "Stoke-by-Nayland",
    image_url: "/fun/art/stoke-by-nayland-1836.jpg",
    url: "https://www.artic.edu/artworks/4758",
  },
  {
    title: "Salisbury Cathedral from the Bishop's Grounds",
    image_url: "/fun/art/salisbury-cathedral.jpg",
    url: "https://www.metmuseum.org/art/collection/search/435922",
  },
  {
    title: "Hampstead, Stormy Sky",
    image_url: "/fun/art/hampstead-stormy-sky.jpg",
    url: "https://www.artic.edu/artworks/47582",
  },
  {
    title: "Landscape (The Lock)",
    image_url: "/fun/art/the-lock.jpg",
    url: "https://www.artic.edu/artworks/879",
  },
  {
    title: "Cloud Study",
    image_url: "/fun/art/cloud-study.jpg",
    url: "https://www.metmuseum.org/art/collection/search/727706",
  },
  {
    title: "Landscape with Cottages",
    image_url: "/fun/art/landscape-with-cottages.jpg",
    url: "https://www.artic.edu/artworks/49651",
  },
  {
    title: "Stoke-by-Nayland",
    image_url: "/fun/art/stoke-by-nayland-1810.jpg",
    url: "https://www.metmuseum.org/art/collection/search/435923",
  },
].map((artwork) => ({ ...artwork, artist: CONSTABLE }));
