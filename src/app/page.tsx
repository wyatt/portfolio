"use client";

import { Content } from "@/components/Content";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PushButton } from "@/components/PushButton";
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
    if (width && height && width > 1024 && height > 768) {
      setFunMode(true);
    } else {
      setFunMode(false);
    }
  }, [width, height]);

  return (
    <div className="h-full flex flex-col justify-center items-center">
      {width && height && width > 1024 && height > 768 && (
        <PushButton
          onClick={() => setFunMode(!funMode)}
          colors={{
            front: funMode ? "bg-gray-600" : "bg-red-500",
            edge: funMode ? "bg-gray-800" : "bg-red-800",
          }}
          className="absolute top-0 left-0 m-8 z-30"
        >
          {funMode ? "Activate Boring Mode" : "Activate Fun Mode"}
        </PushButton>
      )}
      <FunMode excludedBounds={bounds} isVisible={funMode} />
      <Content setBounds={setBounds} />
    </div>
  );
}
