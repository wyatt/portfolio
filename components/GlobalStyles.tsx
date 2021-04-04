import React from "react";
import { createGlobalStyle } from "styled-components";
import tw, { theme, GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle`
  :root {
    --animate-delay: 0.4s;
  }
  body {
    -webkit-tap-highlight-color: ${theme`colors.blue.300`};
    ${tw`antialiased`}
  }
  html, body, #__next {
    width: 100%
  }
  ::selection { background-color: ${theme`colors.blue.300`} }
`;

export const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);
