import React from "react";
import { useLastFM } from "use-last-fm";
import styled from "styled-components";
import { color } from "./colorScheme";

const SongText = styled.p`
  margin-top: 10px;
  font-family: "Courier Prime", monospace;
  font-size: 100%;
  line-height: 1;
  color: white;
  white-space: nowrap;
  display: inline-block;
  width: 30vh;
  overflow: hidden;
  text-align: center;
  @media (max-width: 1000px), (max-height: 700px) {
    width: 100%;
  }
`;

const SongSpan = styled.span`
  color: ${(props) => color[props.part]};
  pointer-events: none;
`;

export const CurrentSong = () => {
  const song = useLastFM(
    "wyattsell",
    "8940782d87e4253f45b8329ae65107a8",
    15000
  );
  const scrollText = (e, event) => {
    switch (event) {
      case "enter":
        e.target.scroll({
          left: e.target.scrollWidth,
          behavior: "smooth",
        });
        return;
      case "leave":
        e.target.scroll({
          left: -e.target.scrollWidth,
          behavior: "smooth",
        });
        return;
      default:
        return;
    }
  };
  if (song === "connecting") {
    return (
      <SongText onMouseEnter={(e) => scrollText(e, "enter")}>
        Connecting
      </SongText>
    );
  }

  if (song === "idle") {
    return (
      <SongText
        onMouseEnter={(e) => scrollText(e, "enter")}
        onMouseLeave={(e) => scrollText(e, "leave")}
      >
        Not listening to anything
      </SongText>
    );
  }
  return (
    <SongText
      onMouseOver={(e) => scrollText(e, "enter")}
      onMouseLeave={(e) => scrollText(e, "leave")}
    >
      Listening to <SongSpan part="variable">{song.name}</SongSpan> by{" "}
      <SongSpan part="variable2">{song.artist}</SongSpan>
    </SongText>
  );
};
