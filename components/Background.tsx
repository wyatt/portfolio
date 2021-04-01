import tw, { css, styled, theme } from "twin.macro";
import { useLastFM } from "use-last-fm";

export const Background = () => {
  const lastFM = useLastFM("wyattsell", "8940782d87e4253f45b8329ae65107a8");
  console.log(lastFM);
  return <BackgroundBase></BackgroundBase>;
};

const BackgroundBase = styled.div`
  background: linear-gradient(
    -45deg,
    #e74b58,
    #f47e3e,
    #33658a,
    #70c1b3,
    #8ca861
  );
  ${tw`w-full h-full`}
`;
