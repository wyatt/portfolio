import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { FUN_MODE_ATTRIBUTE } from "./usePageHeight";

// Widgets are memoised so stepping through the sequence only re-renders the
// one widget whose visibility changed
const Earth = memo(
  dynamic(() => import("./Earth").then((mod) => mod.Earth), {
    ssr: false,
  }),
);

const Car = memo(
  dynamic(() => import("./Car").then((mod) => mod.Car), {
    ssr: false,
  }),
);

const Art = memo(
  dynamic(() => import("./Art").then((mod) => mod.Art), {
    ssr: false,
  }),
);

const Keyboard = memo(
  dynamic(() => import("./Keyboard"), {
    ssr: false,
  }),
);

const Painting = memo(
  dynamic(() => import("./Painting").then((mod) => mod.Painting), {
    ssr: false,
  }),
);

const RecordSpinner = memo(
  dynamic(() => import("./RecordSpinner").then((mod) => mod.RecordSpinner)),
);

const WIDGET_COUNT = 6;
const STEP_INTERVAL = 70; // ms between one widget appearing and the next
// Start anyway if a widget is slow to load (e.g. on a slow network)
const READY_TIMEOUT = 2500;

const noop = () => {};

// Fisher-Yates shuffle of [0, 1, ..., n - 1]
const shuffledRanks = (n: number) => {
  const ranks = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
  }
  return ranks;
};

export const FunMode = ({
  excludedBounds,
  isVisible,
}: {
  excludedBounds: { top: number; bottom: number; left: number; right: number };
  isVisible: boolean;
}) => {
  const [animateStep, setAnimateStep] = useState<number>(0);
  // ranks[i] is when widget i appears; widgets disappear in reverse rank order
  const [ranks, setRanks] = useState<number[]>(() =>
    Array.from({ length: WIDGET_COUNT }, (_, i) => i),
  );
  const animateStepRef = useRef(0);
  animateStepRef.current = animateStep;

  // Hold the first zoom-ins until every widget has finished its heavy setup
  // (loading code and images, compiling the globe's shaders), so none of that
  // work lands mid-animation and makes another widget stutter
  const readyWidgets = useRef(new Set<string>());
  const [allReady, setAllReady] = useState(false);
  const markReady = useMemo(() => {
    const callbacks: Record<string, () => void> = {};
    for (const title of [
      "Car",
      "Painting",
      "Record Spinner",
      "Art",
      "Keyboard",
      "Earth",
    ]) {
      callbacks[title] = () => {
        readyWidgets.current.add(title);
        if (readyWidgets.current.size === WIDGET_COUNT) setAllReady(true);
      };
    }
    return callbacks;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setAllReady(true), READY_TIMEOUT);
    return () => clearTimeout(timer);
  }, []);

  // Give the browser a couple of frames to settle after the last widget is
  // ready before starting
  const [canStart, setCanStart] = useState(false);
  useEffect(() => {
    if (!allReady) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setCanStart(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [allReady]);

  // Pick a fresh random order each time the widgets start appearing or
  // disappearing. Mid-transition the order is kept, so reversing direction
  // doesn't make widgets pop in or out.
  useEffect(() => {
    const step = animateStepRef.current;
    if (step === 0 || step === WIDGET_COUNT) {
      setRanks(shuffledRanks(WIDGET_COUNT));
    }
  }, [isVisible]);

  const targetStep = isVisible && canStart ? WIDGET_COUNT : 0;
  useEffect(() => {
    if (animateStep === targetStep) return;
    const timer = setTimeout(() => {
      setAnimateStep((prev) => prev + Math.sign(targetStep - prev));
    }, STEP_INTERVAL);
    return () => clearTimeout(timer);
  }, [animateStep, targetStep]);

  const funContent = useMemo(
    () => [
      {
        title: "Car",
        component: Car,
        style: {
          top: "80%",
          left: excludedBounds.left / 2,
          zIndex: 30,
        },
      },
      {
        title: "Painting",
        component: Painting,
        style: {
          top: "51%",
          left: (excludedBounds.left / 2) * 0.8,
          zIndex: 30,
        },
      },
      {
        title: "Record Spinner",
        component: RecordSpinner,
        style: {
          top: "25%",
          left: excludedBounds.left / 2,
          zIndex: 30,
        },
      },
      {
        title: "Art",
        component: Art,
        style: {
          top: "20%",
          right: excludedBounds.left / 2,
          zIndex: 30,
        },
      },
      {
        title: "Keyboard",
        component: Keyboard,
        style: {
          top: "52%",
          right: (excludedBounds.left / 2) * 1.2,
          zIndex: 30,
        },
      },
      {
        title: "Earth",
        component: Earth,
        style: {
          top: "75%",
          right: excludedBounds.left / 2,
          zIndex: 30,
        },
      },
    ],
    [excludedBounds.left],
  );

  return (
    <div
      className="absolute top-0 left-0 w-full h-full"
      {...{ [FUN_MODE_ATTRIBUTE]: "" }}
    >
      {funContent.map((content, i) => (
        <AnimatePresence key={content.title}>
          <content.component
            key={content.title}
            shouldAnimate={animateStep > ranks[i]}
            incrementStep={noop}
            onReady={markReady[content.title]}
            style={content.style}
          />
        </AnimatePresence>
      ))}
    </div>
  );
};
