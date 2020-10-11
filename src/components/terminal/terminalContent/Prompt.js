import React from "react";
import styled from "styled-components";

import { Typewriter } from "./Typewriter";

export const Prompt = () => {
  return (
    <PromptContainer>
      <PromptText part="user">wyatt</PromptText>
      <PromptText part="host">@sell</PromptText>
      <PromptText>:~ </PromptText>
      <PromptText part="prompt">$ </PromptText>
      <Typewriter message={"./portfolio.sh"} interval={150} />
    </PromptContainer>
  );
};

//Styles
const PromptText = styled.span`
  color: ${(props) => textColorHandle(props.part)};
`;

const PromptContainer = styled.p`
  margin-top: 10px;
  font-family: "Courier Prime", monospace;
  font-size: 100%;
  line-height: 1;
`;

const textColorHandle = (color) => {
  switch (color) {
    case "user":
      return "rgb(130, 177, 255);";
    case "host":
      return "rgb(128, 203, 196);";
    case "prompt":
      return "rgb(222, 203, 107);";
    default:
      return "rgb(255, 255, 255);";
  }
};
