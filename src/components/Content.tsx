import Image from "next/image";
import { PushButton } from "./PushButton";
import { useEffect, useRef } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "D3.js",
  "Websockets",
  "Python",
  "Java",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Supabase",
  "Git",
  "Docker",
  "CI/CD",
  "HTML",
  "CSS",
  "Tailwind",
  "Figma",
  "UI Design",
  "Excel",
];

export const Content = (props: {
  setBounds: (bounds: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }) => void;
}) => {
  const size = useWindowSize();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      props.setBounds({
        top: contentRef.current.offsetTop,
        bottom: contentRef.current.offsetTop + contentRef.current.offsetHeight,
        left: contentRef.current.offsetLeft,
        right: contentRef.current.offsetLeft + contentRef.current.offsetWidth,
      });
    }
  }, [contentRef, size]);

  return (
    <div
      className="flex flex-col items-center w-full px-6 py-10 md:p-0 md:w-3xl gap-2 overflow-y-scroll bg-white"
      ref={contentRef}
    >
      <h1 className="text-4xl">Wyatt Sell</h1>
      <button
        tabIndex={0}
        className="text-lg underline cursor-pointer"
        onClick={() => {
          window.open(
            "mailto:wyattsetonsell" + "@" + "gmail.com",
            "_blank",
            "noopener,noreferrer"
          );
        }}
      >
        wyattsetonsell (at) gmail (dot) com
      </button>
      <p className="text-lg text-center">
        I'm an Electrical and Computer Engineering (ECE) student at{" "}
        <i>Cornell University</i>, with extensive experience in software
        development, both individually and in large teams. I'm{" "}
        <i>minoring in English</i>, and I enjoy reading and learning about
        everything! You can{" "}
        <i>
          read some of my pieces{" "}
          <a href="https://wyattsell.com/blog" className="underline">
            here
          </a>
        </i>
        {/* I'm a Computer Engineer with 8+ years of experience in software
        development, both individually and in large teams. Proficient in most
        stages of product creation, including UI design, testing, deployment,
        full-stack development etc. Currently studying for a Masters in
        Electrical and Computer Engineering. */}
      </p>
      <Section title="PROFESSIONAL EXPERIENCE">
        <ul className="list-none text-lg">
          <Experience
            url="https://www.samaritanscout.org"
            title="Head of Technical Development"
            company="Samaritan Scout"
            dates="May 2024 - Present"
            description="Developed and maintained the Samaritan Scout web app, a note-taking tool for students."
          />{" "}
          <Experience
            url="https://www.mmc.vc"
            title="Technical Intern"
            company="MMC Ventures"
            dates="Jul - Aug 2025"
          />
          <Experience
            url="https://www.pocdoc.co"
            title="Technical Intern"
            company="PocDoc"
            dates="Jul - Aug 2025"
          />
          <Experience
            url="https://www.remnote.com"
            title="Software Engineer"
            company="Remnote"
            dates="Jan 2022 - Jun 2023"
            description="Developed and maintained the Remnote web app, a note-taking tool for students."
          />
        </ul>
      </Section>
      <Education />

      <Section title="PROJECTS">
        <ul className="list-none space-y-2 text-lg">
          <Project
            url="https://maxims.app"
            title="Maxims"
            dates="May 2024 - Present"
            description="A full-stack web app that visualizes knowledge connections by converting text and images into AI embeddings and projecting them onto interactive 2D maps."
            icon={
              <div className="w-5 h-5 relative flex-shrink-0">
                <Image
                  src="https://maxims.app/favicon.ico"
                  alt="Maxims"
                  fill
                  style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
                />
              </div>
            }
          />
          <Project
            url="https://revisio.app"
            title="Revisio"
            dates="Apr 2021 - May 2023"
            description="A full-stack web app that optimizes exam preparation through spaced repetition and collaborative learning."
            icon={<span className="text-xl">🗂️</span>}
          />
        </ul>
      </Section>
      <Section title="SKILLS">
        {SKILLS.map((skill, index) => (
          <span key={skill}>
            {index !== 0 && " • "}
            {skill}
          </span>
        ))}
      </Section>
    </div>
  );
};

const Project = ({
  url,
  title,
  dates,
  description,
  icon,
}: {
  url: string;
  title: string;
  dates: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <li className="flex flex-col items-start justify-between">
      <div className="flex items-start gap-2 w-full justify-between">
        <div className="flex flex-row gap-2 items-center">
          {icon}
          <h3>
            <a href={url} className="underline">
              <strong>{title}</strong>
            </a>
          </h3>
        </div>
        <span className="italic">{dates}</span>
      </div>
      <p className="ml-7 leading-snug">{description}</p>
    </li>
  );
};

const Education = () => {
  return (
    <Section title="EDUCATION">
      <ul className="list-none gap-2 text-lg">
        <li className="flex justify-between items-start flex-col md:flex-row">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 relative flex-shrink-0">
                <Image
                  src={"https://cornell.edu/favicon.ico"}
                  alt={"Cornell University"}
                  fill
                  style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
                />
              </div>
              <p>
                <strong>{"B.S. in Electrical and Computer Engineering"}</strong>{" "}
                at{" "}
                <a href={"https://cornell.edu"} className="underline">
                  Cornell University
                </a>
                <br />
              </p>
            </div>
            <span className="ml-7 leading-none italic">Aug 2023 - Present</span>
          </div>
          <span className="ml-7 md:ml-0 mt-1 md:mt-0">GPA: 4.03</span>
        </li>
      </ul>
    </Section>
  );
};
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="text-left w-full mt-4">
      <h2 className="text-xl">{title}</h2>
      <hr className="w-full mb-2" />
      {children}
    </div>
  );
};
const Experience = ({
  url,
  title,
  company,
  dates,
  description,
}: {
  url: string;
  title: string;
  company: string;
  dates: string;
  description?: string;
}) => {
  return (
    <li className="flex justify-between md:items-center items-start flex-col md:flex-row">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 relative flex-shrink-0">
          <Image
            src={url + "/favicon.ico"}
            alt={company}
            fill
            style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
          />
        </div>
        <p>
          <strong>{title}</strong> at{" "}
          <a href={url} className="underline whitespace-nowrap">
            {company}
          </a>
        </p>
      </div>
      <span className="italic">{dates}</span>
    </li>
  );
};
