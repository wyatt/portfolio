import Image from "next/image";
import clsx from "clsx";
import { PushButton } from "./PushButton";
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";

// Newest first; only the first few are shown
const VISIBLE_PROJECTS = 3;
const PROJECTS = [
  {
    url: "https://intercede.wyattsell.com",
    title: "Intercede",
    dates: "Jul 2026 - Present",
    description:
      "A Chrome extension that sets daily limits on distracting sites. When time runs out, a pixel-art patron saint walks onto the page and sweeps it away.",
    icon: (
      <div className="w-5 h-5 relative flex-shrink-0">
        <Image
          src="/imgs/intercede.png"
          alt="Intercede"
          fill
          style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
          className="rounded"
        />
      </div>
    ),
  },
  {
    url: "https://ece4760.github.io/Projects/Fall2025/wss58/report.html",
    title: "WiFi Bike Computer",
    dates: "Sep 2025 - Dec 2025",
    description:
      "A RPi Pico W powered bike computer which displays my location on a map using WiFi signals to determine position using a custom algorithm.",
    icon: <span className="text-xl">🚲</span>,
  },
  {
    url: "https://maxims.app",
    title: "Maxims",
    dates: "May 2025 - Aug 2025",
    description:
      "A full-stack web app that visualizes knowledge connections by converting text and images into AI embeddings and projecting them onto interactive 2D maps.",
    icon: (
      <div className="w-5 h-5 relative flex-shrink-0">
        <Image
          src="https://maxims.app/favicon.ico"
          alt="Maxims"
          fill
          style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
        />
      </div>
    ),
  },
  {
    url: "https://revisio.app",
    title: "Revisio",
    dates: "Apr 2021 - May 2023",
    description:
      "A full-stack web app that optimizes exam preparation through spaced repetition and collaborative learning.",
    icon: <span className="text-xl">🗂️</span>,
  },
];

// Columns in The Cornell Daily Sun, newest first
const WRITING = [
  {
    url: "https://www.cornellsun.com/article/2026/11/sell-the-data-center-that-saves-lives",
    title: "The Data Center That Saves Lives",
    date: "Nov 2026",
  },
  {
    url: "https://www.cornellsun.com/article/2026/04/6s7jkggdzhgq",
    title: "In Defense of Alcohol",
    date: "Apr 2026",
  },
  {
    url: "https://www.cornellsun.com/article/2026/02/sell-fix-the-elevator",
    title: "Fix the Elevator",
    date: "Feb 2026",
  },
  {
    url: "https://www.cornellsun.com/article/2025/11/sell-i-want-to-ride-my-bicycle-i-want-to-ride-it-where-i-like",
    title: "I Want To Ride My Bicycle, I Want To Ride It Where I Like",
    date: "Nov 2025",
  },
  {
    url: "https://www.cornellsun.com/article/2025/10/sell-why-does-everything-look-like-a-mid-market-hotel-now",
    title: "Why Does Everything Look Like a Mid-Market Hotel Now?",
    date: "Oct 2025",
  },
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
  const [showAllProjects, setShowAllProjects] = useState(false);

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
      className="flex flex-col items-center w-full px-4 pt-4 pb-16 md:w-3xl gap-2 paper z-10"
      ref={contentRef}
    >
      <a
        href="/Wyatt_Sell_Resume.pdf"
        className="text-lg underline cursor-pointer pb-6 text-gray-400"
      >
        Download Resumé (PDF)
      </a>
      <h1 className="text-4xl">Wyatt Sell</h1>
      <button
        tabIndex={0}
        className="text-lg underline cursor-pointer"
        onClick={() => {
          window.open(
            "mailto:wyattsetonsell" + "@" + "gmail.com",
            "_blank",
            "noopener,noreferrer",
          );
        }}
      >
        wyattsetonsell (at) gmail (dot) com
      </button>
      <p className="text-lg text-center">
        I'm an Electrical and Computer Engineering (ECE) student at{" "}
        <i>Cornell University</i>, with extensive experience in software
        development, both individually and in large teams. I'm{" "}
        <i>minoring in English</i>, enjoy reading and learning about everything
      </p>
      <div className="flex gap-2 items-center">
        <a
          href="https://github.com/wyatt"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg underline cursor-pointer"
        >
          GitHub
        </a>
        <p>⋅</p>
        <a
          href="https://www.linkedin.com/in/wyattsell/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg underline cursor-pointer"
        >
          LinkedIn
        </a>
      </div>
      <Education />
      <Section title="PROFESSIONAL EXPERIENCE">
        <ul className="list-none text-lg">
          <Experience
            url="https://www.kisotechnology.com"
            imgUrl="/imgs/kiso.png"
            title="Member of Technical Staff Intern"
            company="Kiso Technology"
            dates="June - August 2026"
            description={
              <ul className="list-disc p-1">
                <li>
                  Researched, implemented, and tuned a Temporal Fusion
                  Transformer from the original paper; ensembling its forecasts
                  with existing models yielded $15M in projected client savings
                  over the next-best approach.
                </li>
                <li>
                  Improved demand forecasts across 10K+ SKUs and 2M+ observations
                  by combining deep learning and LightGBM residual forecasts with
                  tailored ensembles for warm- and cold-start products.
                </li>
                <li>
                  Built a modular time-series forecasting framework supporting
                  cross-validation, hyperparameter optimization, configurable
                  aggregation strategies, and custom error metrics.
                </li>
              </ul>
            }
          />
          <Experience
            url="https://www.samaritanscout.org"
            imgUrl="/imgs/scout.png"
            title="Head of Technical Development"
            company="Samaritan Scout"
            dates="May 2024 - August 2025"
            description={
              <ul className="list-disc p-1">
                <li>
                  Built ETL pipelines using LLMs to scrape, process, and ingest
                  large-scale volunteer data; implemented WebSocket servers and
                  job-tracking interface
                </li>
                <li>
                  Developed full-stack account, search, and flagging features
                  with Supabase, TypeScript, and React; managed infrastructure
                  and deployments
                </li>
                <li>
                  Redesigned onboarding, login, search UI (with filters), and
                  account pages to improve UX and engagement
                </li>
              </ul>
            }
          />{" "}
          <Experience
            url="https://www.mmc.vc"
            imgUrl="/imgs/mmc.png"
            title="Technical Intern"
            company="MMC Ventures"
            dates="Jul 2025"
            description={
              <ul className="list-disc p-1">
                <li>
                  Wrote custom software to handle large scale data migrations
                  and enrichment to better leverage client information.
                </li>
                <li>
                  Automated client withdrawal workflow, saving hours of work
                  each week.
                </li>
                <li>
                  Attended investment committees, board meetings and startup
                  pitches, taking notes and analysing financial reports.
                </li>
              </ul>
            }
          />
          <Experience
            url="https://www.pocdoc.co"
            imgUrl="/imgs/pocdoc.png"
            title="Technical Intern"
            company="PocDoc"
            dates="Jul 2025"
            description={
              <ul className="list-disc p-1">
                <li>
                  Developed robust computer vision software to identify
                  manufacturing defects rapidly, in a range of lighting
                  environments.
                </li>
                <li>
                  Created sensitivity analysis models for staffing, stock levels
                  and optimal order frequency
                </li>
              </ul>
            }
          />
          <Experience
            url="https://www.remnote.com"
            imgUrl="/imgs/remnote.svg"
            title="Software Engineer"
            company="Remnote"
            dates="Jan 2022 - Jun 2023"
            description={
              <ul className="list-disc p-1">
                <li>
                  Shipped key features for a knowledge management platform,
                  including PDF annotation, rich text formatting, and dark mode
                </li>
                <li>
                  Collaborated with 12+ developers on feature proposals, code
                  reviews, and team culture initiatives
                </li>
                <li>
                  Improved developer experience by creating style guides, tests,
                  and utilities; refactored major components to reduce
                  regressions
                </li>
              </ul>
            }
          />
        </ul>
      </Section>

      <Section title="PROJECTS">
        <ul className="list-none space-y-2 text-lg">
          {PROJECTS.slice(0, VISIBLE_PROJECTS).map((project) => (
            <Project key={project.title} {...project} />
          ))}
        </ul>
        <AnimatePresence initial={false}>
          {showAllProjects && (
            <motion.ul
              className="list-none space-y-2 text-lg overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {PROJECTS.slice(VISIBLE_PROJECTS).map((project, i) => (
                <Project
                  key={project.title}
                  {...project}
                  // Matches the space-y-2 gap between the visible projects
                  className={i === 0 ? "pt-2" : undefined}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
        {PROJECTS.length > VISIBLE_PROJECTS && (
          <button
            className="mt-2 mx-auto flex w-fit items-center gap-1 text-base italic text-gray-500 hover:text-foreground transition-colors cursor-pointer"
            onClick={() => setShowAllProjects((prev) => !prev)}
            aria-expanded={showAllProjects}
          >
            <motion.span
              className="inline-flex"
              animate={{ rotate: showAllProjects ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <RiArrowDownSLine />
            </motion.span>
            {showAllProjects ? "Show less" : "Show more"}
          </button>
        )}
      </Section>

      <Section title="WRITING">
        <ul className="list-none space-y-1 text-lg">
          {WRITING.map((piece) => (
            <li
              key={piece.url}
              className="flex flex-col md:flex-row md:items-baseline justify-between gap-x-4"
            >
              <a href={piece.url} className="underline">
                {piece.title}
              </a>
              <span className="italic whitespace-nowrap">{piece.date}</span>
            </li>
          ))}
        </ul>
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
  className,
}: {
  url: string;
  title: string;
  dates: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}) => {
  return (
    <li
      className={clsx("flex flex-col items-start justify-between", className)}
    >
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
                  // Cornell's seal, public domain via Wikimedia Commons
                  src={"/imgs/cornell-seal.svg"}
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
          <span className="ml-7 md:ml-0 mt-1 md:mt-0">GPA: 4.01</span>
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
  imgUrl,
  title,
  company,
  dates,
  description,
}: {
  url: string;
  imgUrl?: string;
  title: string;
  company: string;
  dates: string;
  description?: React.ReactNode;
}) => {
  const [showDescription, setShowDescription] = useState<boolean>(false);

  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url.replace(/(^\w+:|^)\/\//, "").replace(/\/.*$/, "");
    }
  })();

  return (
    <li
      className="flex  flex-col px-1"
    >
      <div
        className="flex flex-col md:flex-row items-start -mx-2 px-2 justify-between md:items-center cursor-pointer hover:bg-black/[0.07] transition"
        onClick={() => setShowDescription(!showDescription)}
      >
        <div className="flex items-center gap-2 relative">
          <motion.p
            className="text-xl absolute -left-6"
            animate={{
              rotate: showDescription ? 90 : 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            <RiArrowRightSLine />
          </motion.p>
          <div className="w-5 h-5 relative flex-shrink-0">
            <Image
              src={
                imgUrl ||
                `https://img.logo.dev/${domain}?token=pk_djTjNvb9R1mRMEGZlAwQ6A`
              }
              alt={company}
              fill
              style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
              className="rounded-full"
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
      </div>
      <motion.div
        className="pl-6 leading-snug overflow-hidden h-0"
        animate={{
          height: showDescription ? "auto" : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        {description}
      </motion.div>
    </li>
  );
};
