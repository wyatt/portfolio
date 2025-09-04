import clsx from "clsx";
import styles from "./Art.module.css";
import { useEffect, useRef, useState } from "react";

export const Art = (props: { style: React.CSSProperties }) => {
  const [art, setArt] = useState<
    { title: string; artist: string; url: string }[]
  >([]);
  const [artIdx, setCurrentArtIdx] = useState<number>(0);
  const [prevArtIdx, setPrevArtIdx] = useState<number>(0);

  useEffect(() => {
    getArtwork().then((data) => {
      setArt(data);
    });
  }, []);

  useEffect(() => {
    const intervalCurrent = setInterval(() => {
      setCurrentArtIdx((prev) => (prev + 1) % art.length);
      setTimeout(() => {
        setPrevArtIdx((prev) => (prev + 1) % art.length);
      }, 2500);
    }, 5000);
    return () => clearInterval(intervalCurrent);
  }, [art]);

  console.log(artIdx, (artIdx - 1) % art.length, art);

  return (
    <div
      className={clsx("absolute h-48 w-72 transition", styles.container)}
      style={{
        ...props.style,
      }}
    >
      <img
        src="/fun/picture_frame.png"
        alt="Picture Frame"
        className="h-full absolute z-10"
        style={{
          filter: "drop-shadow(0 0 7px rgba(0, 0, 0, 0.5))",
        }}
      />
      {art.length > 0 && (
        <div className="relative px-14 pt-12 pb-10 w-full h-full box-border">
          <img
            src={art[prevArtIdx].url}
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
            src={art[artIdx].url}
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
    </div>
  );
};

const ARTWORK_IDS = [
  27992, // La Grande Jatte
  64818, // End of Summer
  111628, // Nighthawks
  20684, // Paris Street; Rainy Day
];

export const getArtwork = async (): Promise<
  { title: string; artist: string; url: string }[]
> => {
  const artworkData = await fetch(
    `https://api.artic.edu/api/v1/artworks?ids=${ARTWORK_IDS.join(",")}&fields=title,artist_title,image_id`
  );
  const data = await artworkData.json().then((data) => {
    console.log(data);
    return data.data.map(
      (artwork: { title: string; artist_title: string; image_id: string }) => {
        return {
          title: artwork.title,
          artist: artwork.artist_title,
          url: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
        };
      }
    );
  });
  return data;
};
