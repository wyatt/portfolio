import React from "react";
import { TerminalContent } from "./terminalContent/TerminalContent";
import styled from "styled-components";

// Global State
import { useAtom } from "jotai";
import { visiblePage as visiblePageAtom } from "../../core/app";

const TerminalContainer = styled.div`
  background: rgb(38, 50, 56);
  box-shadow: rgba(0, 0, 0, 0.55) 0px 20px 68px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.5s;

  &.isTerminal {
    min-width: 25%;
    max-width: 90%;
    max-height: 20%;
    @media (max-width: 1300px) {
      min-width: 70%;
    }
  }
  &.isProfile {
    overflow: auto;
    max-height: 70%;
    max-width: 50%;
    @media (max-width: 1400px) {
      max-width: 75%;
    }
    @media (max-width: 1000px) {
      max-width: 90%;
      min-width: 60%;
      max-height: 87%;
      min-height: 70%;
      overflow: auto;
    }
    animation: hide-scroll 1.2s backwards;
    @keyframes hide-scroll {
      from,
      to {
        overflow: hidden;
      }
    }
  }
`;

export const Terminal = () => {
  const [visiblePage] = useAtom(visiblePageAtom);

  return (
    <TerminalContainer
      className={visiblePage === "terminal" ? "isTerminal" : "isProfile"}
    >
      <TerminalContent />
    </TerminalContainer>
  );
};
