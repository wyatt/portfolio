import React from "react";

import { useAtom } from "jotai";
import { visiblePage as visiblePageAtom } from "../../../core/app";

import { ProfilePicture } from "./ProfilePicture";
import { CurrentSong } from "../../CurrentSong";
import { Header } from "./Header";
import { MainBody } from "./MainBody";

import * as Styled from "../Terminal.styles";

import { Prompt } from "./Prompt";

const Left = () => {
  return (
    <Styled.LeftContainer>
      <ProfilePicture />
      <CurrentSong />
    </Styled.LeftContainer>
  );
};

const Right = () => {
  return (
    <Styled.RightContainer>
      <MainBody />
    </Styled.RightContainer>
  );
};

export const TerminalContent = () => {
  const [visiblePage] = useAtom(visiblePageAtom);

  if (visiblePage === "profile") {
    return (
      <Styled.SimpleDiv>
        <Header className="profile" />
        <Styled.TerminalContent>
          <Left />
          <Right />
        </Styled.TerminalContent>
      </Styled.SimpleDiv>
    );
  }

  return (
    <Styled.SimpleDiv>
      <Header className="terminal" />
      <Styled.TerminalContent>
        <Prompt />
      </Styled.TerminalContent>
    </Styled.SimpleDiv>
  );
};
