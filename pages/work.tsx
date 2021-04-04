import React, { ReactNode } from "react";
import tw, { styled } from "twin.macro";
import { MainContainer } from "../components/Background";
import AlphabetSoup from "react-alphabet-soup";
import useSWR from "swr";
import { fetcher } from "../helper/fetcher";
import Clock from "react-live-clock";
import { CurrentSong } from "../components/Landing";
import useMobileDetect from "use-mobile-detect-hook";
import { RiArrowLeftLine } from "react-icons/ri";
import Link from "next/link";
import { motion } from "framer-motion";
import { spring } from "../helper/constants";

const Work = () => {
  return (
    <>
      <Link href="/">
        <a tw="flex items-center text-white text-xl m-3 bg-black bg-opacity-20 p-2 w-min rounded-lg cursor-pointer transform hover:scale-110 transition">
          <RiArrowLeftLine />
          &nbsp;Home
        </a>
      </Link>
      <div tw="h-96 items-center justify-center flex w-full flex-col text-white p-6 text-center">
        <Header className="animate__animated animate__zoomInDown">Work</Header>
        <p
          tw="text-lg font-semibold opacity-80"
          className={"animate__animated animate__delay-2s animate__fadeIn"}
        >
          Below are some examples of what I can do!
        </p>
      </div>
      <WorkGrid
        className={"animate__animated animate__delay-3s animate__zoomIn"}
      >
        <WorkItem
          href={"https://ascendagency.net"}
          img={"ascendagency.png"}
          name={"Ascend Agency"}
          text={"A complex, modern 4 page site for a branding agency"}
        />
        <WorkItem
          href={"https://github.com/wyatt/tasktracker"}
          img={"tasktracker.png"}
          name={"Task Tracker"}
          text={"A flexible and simple platform to create progress bars"}
        />

        <WorkItem
          href={"https://wyatt.github.io/seneca"}
          img={"senecalearning.png"}
          name={"Seneca Learning"}
          text={"An unofficial API for SenecaLearning"}
        />
        <WorkItem
          href={"https://coneheadmc.live"}
          img={"conehead.png"}
          name={"Conehead"}
          text={"An attractive and functional website for a minecraft streamer"}
        />
        <h1
          tw="col-span-full text-center text-3xl font-semibold text-white flex justify-center items-center"
          css={{ height: "20vh" }}
          className={"animate__animated animate__delay-4s animate__fadeIn"}
        >
          More Coming Soon!
        </h1>
      </WorkGrid>
    </>
  );
};

const Header = tw.h1`font-bold text-white text-8xl lg:text-9xl`;

const WorkGrid = tw.div`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 h-full auto-rows-auto gap-6 m-6`;
const WorkItem = (props: {
  href: string;
  img: string;
  text: string;
  name: string;
}) => {
  const detectMobile = useMobileDetect();
  return (
    <WorkItemContainer href={props.href} img={props.img} className="group">
      {detectMobile.isMobile() ? (
        <h1 tw="text-3xl pb-6">{props.name}</h1>
      ) : (
        <AlphabetSoup
          text={props.name}
          fontSize="48px"
          fontFamily="Lexend"
          sorting="costFunction"
          transitionStyle="progressive"
          transitionTimingFunction="cubic-bezier(1, 0.24, 0.25, 1)"
          transitionSpeedMultiplier={0.3}
          costFunctionYWeight={3}
          charactersClassName={"letters"}
        />
      )}
      <p
        css={[
          tw`transition delay-300 duration-300 absolute pt-12 pointer-events-none text-center opacity-80 w-72`,
          detectMobile.isDesktop() && tw`opacity-0 group-hover:opacity-100`,
        ]}
      >
        {props.text}
      </p>
    </WorkItemContainer>
  );
};

interface WorkItemContainerTypes {
  img: string;
}

const WorkItemContainer = styled.a<WorkItemContainerTypes>`
  width: 100%;
  height: 30vh;
  position: relative;
  ${tw`text-white flex items-center justify-center font-semibold flex-col overflow-hidden rounded-xl transform hover:-translate-y-8 transition`}
  &:hover {
    * > .letters {
      top: calc(50% - 40px) !important;
      margin-right: 5px;
      ${tw`text-2xl`};
    }
  }
  &::before {
    content: " ";
    background: url("img/${(props) => props.img}") center / cover no-repeat;
    filter: brightness(10%);
    width: 100%;
    height: 100%;
    z-index: -2;
    position: absolute;
  }
`;

export default Work;
