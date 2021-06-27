import { RiDiscordFill, RiGithubFill, RiMediumFill } from "react-icons/ri";
import { CurrentSongType } from "../types/types";
import Image from "next/image";
import tw from "twin.macro";
import React, { ReactNode } from "react";
import { IconContext } from "react-icons";
import Link from "next/link";
import TextLoop from "react-text-loop";

export const CurrentSong = (props: { song: CurrentSongType }) => {
  return (
    <div tw="text-white flex items-center space-x-3 m-3">
      <Image
        src={props.song.album_cover}
        alt="Album Cover"
        width={60}
        height={60}
        tw="rounded-lg"
      />
      <div>
        <a
          href={props.song.href}
          tw="font-semibold md:text-lg text-base hover:underline w-52 flex"
        >
          {props.song.name}
        </a>
        <p tw="md:text-base text-sm">{props.song.artist}</p>
      </div>
    </div>
  );
};

export const Name = (props: { children: ReactNode }) => {
  return (
    <div tw="flex flex-col items-center space-y-5">
      <div tw="text-center space-y-3">
        <h1
          className={"animate__animated animate__zoomInDown"}
          tw="text-white lg:text-8xl text-6xl font-bold text-center"
        >
          {props.children}
        </h1>
        <TextLoop
          tw="text-white text-lg lg:text-2xl font-semibold opacity-80"
          className={"animate__animated animate__delay-2s animate__fadeIn"}
          interval={2000}
          mask={true}
        >
          {[
            "Frontend developer",
            "Open source enthusiast",
            "Web designer",
            "Programmer",
          ].map((s) => (
            <p tw="w-72" key="s">
              {s}
            </p>
          ))}
        </TextLoop>
      </div>
      <div
        tw="flex transition space-x-3"
        className={"animate__animated animate__delay-1s animate__zoomIn"}
      >
        <Button href="mailto:wyattsetonsell@gmail.com">Get In Touch</Button>
        <Link href="/work" passHref>
          <a tw="bg-black text-sm md:text-base bg-opacity-20 py-3 w-32 md:w-40 items-center justify-center text-white font-medium rounded-lg transition transform hover:scale-110 hover:shadow-2xl opacity-80 cursor-pointer flex items-center whitespace-pre">
            See my work
          </a>
        </Link>
      </div>
      <IconContext.Provider value={{ color: "white", size: "2.25em" }}>
        <div tw="flex space-x-2">
          <IconLink
            href="https://github.com/wyatt"
            className={"animate__animated animate__delay-2s animate__fadeIn"}
          >
            <RiGithubFill />
          </IconLink>
          <IconLink
            href="https://dsc.bio/wyatt"
            className={"animate__animated animate__delay-3s animate__fadeIn"}
          >
            <RiDiscordFill />
          </IconLink>
          <IconLink
            href="#"
            className={"animate__animated animate__delay-4s animate__fadeIn"}
          >
            <RiMediumFill />
          </IconLink>
        </div>
      </IconContext.Provider>
    </div>
  );
};

const Button = (props: { children: ReactNode; href?: string }) => {
  return (
    <a
      tw="bg-black text-sm md:text-base bg-opacity-20 py-3 w-32 md:w-40 items-center justify-center text-white font-medium rounded-lg transition transform hover:scale-110 hover:shadow-2xl opacity-80 cursor-pointer flex items-center whitespace-pre"
      href={props.href}
    >
      {props.children}
    </a>
  );
};

const IconLink = tw.a`transform hover:scale-110 transition flex rounded-lg`;
