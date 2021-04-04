import tw, { css, styled, theme } from "twin.macro";
import { GradientProps } from "../types/types";
import { ReactNode } from "react";

export const MainContainer = (
  props: GradientProps & { children: ReactNode }
) => {
  return (
    <BackgroundBase colors={props.colors}>
      <Content>{props.children}</Content>
    </BackgroundBase>
  );
};

const BackgroundBase = styled.div<GradientProps>`
  background: linear-gradient(
    -45deg ${(props) => props.colors.map((c) => `,${c.color} ${c.position}%`)}
  );

  ${tw`w-full h-full flex min-h-screen`}
`;

const Content = styled.div`
  min-height: 100vh;
  content: "";
  z-index: 2;
  width: 100%;
  height: 100%;
  -webkit-backdrop-filter: blur(300px); /* apply the blur */
  backdrop-filter: blur(300px); /* apply the blur */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
