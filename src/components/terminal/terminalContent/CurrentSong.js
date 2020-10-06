import React from "react";
import { useLastFM } from "use-last-fm";
import styled, { keyframes, css } from "styled-components";
import { color } from "../../colorScheme";

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
      <SongContainer>
        <SpotifyIndicator backgroundColor="rgb(185 173 29)" />
        <SongText onMouseEnter={(e) => scrollText(e, "enter")}>
          Connecting
        </SongText>
      </SongContainer>
    );
  }

  if (song === "idle") {
    return (
      <SongContainer>
        <SpotifyIndicator backgroundColor="rgb(29, 185, 84)" />
        <SongText
          onMouseEnter={(e) => scrollText(e, "enter")}
          onMouseLeave={(e) => scrollText(e, "leave")}
        >
          Not listening to anything
        </SongText>
      </SongContainer>
    );
  }
  return (
    <SongContainer>
      <SpotifyIndicator backgroundColor="rgb(29, 185, 84)" online />
      <SongText
        onMouseOver={(e) => scrollText(e, "enter")}
        onMouseLeave={(e) => scrollText(e, "leave")}
      >
        Listening to <SongSpan part="variable">{song.name}</SongSpan> by{" "}
        <SongSpan part="variable2">{song.artist}</SongSpan>
      </SongText>
    </SongContainer>
  );
};

// Styles
const SongText = styled.p`
  font-family: "Courier Prime", monospace;
  font-size: 100%;
  line-height: 1;
  color: white;
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  align-items: center;
  width: calc(100% - 22px);
`;

const SongSpan = styled.span`
  color: ${(props) => color[props.part]};
  pointer-events: none;
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  } 
  70% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  } 
`;

const SpotifyIndicator = styled.div`
  height: 12px;
  width: 12px;
  display: inline-block;
  background-color: ${(props) => props.backgroundColor};
  margin-right: 10px;
  border-radius: 50%;
  animation: ${(props) =>
    props.online
      ? css`
          ${pulse} 2s infinite linear
        `
      : "none"};
`;

const SongContainer = styled.div`
  margin-top: 16px;
  width: 30vh;
  overflow: hidden;
  align-items: center;
  @media (max-width: 1000px), (max-height: 700px) {
    justify-content: center;
    text-align: center;
    width: 100%;
  }
`;
