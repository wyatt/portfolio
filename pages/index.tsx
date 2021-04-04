import React, { ReactNode } from "react";
import useSWR from "swr";
import { MainContainer } from "../components/Background";
import Clock from "react-live-clock";
import { Name, CurrentSong } from "../components/Landing";
import { fetcher } from "../helper/fetcher";
import tw from "twin.macro";
import { RiInformationLine } from "react-icons/ri";

const Home = () => {
  const { data, error } = useSWR("/spotify", fetcher);
  if (error) return <div>failed to load</div>;

  return (
    <>
      <Clock
        format={"HH:mm"}
        timezone={"Europe/London"}
        ticking={true}
        tw="text-white m-3 text-lg"
        //@ts-ignore
        className={"animate__animated animate__delay-1s animate__fadeIn"}
      />
      <Name>Wyatt Sell</Name>
      {data?.message?.song ? (
        <div tw="flex justify-between align-bottom">
          <CurrentSong song={data.message.song} />
          {/* <a
            href="#"
            tw="flex items-end text-white m-3 text-3xl transform transition hover:scale-110"
          >
            <RiInformationLine />
          </a> */}
        </div>
      ) : (
        <div css={{ height: "68px" }} tw="m-3"></div>
      )}
    </>
  );
};

export default Home;
