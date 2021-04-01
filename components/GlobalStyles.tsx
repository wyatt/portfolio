import React from "react";
import { createGlobalStyle } from "styled-components";
import tw, { theme, GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle`
  body {
    -webkit-tap-highlight-color: ${theme`colors.purple.500`};
    ${tw`antialiased`}
  }
  html, body, #__next {
    height: 100%;
    width: 100%
  }
`;

export const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);
