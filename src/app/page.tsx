"use client";

import { Content } from "@/components/Content";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RecordSpinner } from "@/components/fun/RecordSpinner";
import { FunMode } from "@/components/fun/FunMode";
import { useWindowSize } from "@uidotdev/usehooks";

export default function Home() {
  const [funMode, setFunMode] = useState<boolean>(false);
  const [bounds, setBounds] = useState<{
    top: number;
    bottom: number;
    left: number;
    right: number;
  }>({ top: 0, bottom: 0, left: 0, right: 0 });

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (width && height && width > 1400 && height > 700) {
      setFunMode(true);
    } else {
      setFunMode(false);
    }
  }, [width, height]);

  return (
    <div className="h-full flex flex-col items-center">
      {width && height && width > 1400 && height > 700 && (
        <button
          onClick={() => setFunMode(!funMode)}
          className="absolute top-0 left-0 m-3 z-30 text-sm text-gray-400 hover:text-gray-600 hover:underline cursor-pointer"
        >
          {funMode ? "Hide widgets" : "Show widgets"}
        </button>
      )}
      <FunMode excludedBounds={bounds} isVisible={funMode} />
      <Content setBounds={setBounds} />
      {/* <p>∗∗∗</p> */}
    </div>
  );
}
