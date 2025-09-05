import { useWindowSize } from "@uidotdev/usehooks";
import { RecordSpinner } from "./RecordSpinner";
import dynamic from "next/dynamic";

const Earth = dynamic(() => import("./Earth").then((mod) => mod.Earth), {
  ssr: false,
});

const Car = dynamic(() => import("./Car").then((mod) => mod.Car), {
  ssr: false,
});

const Art = dynamic(() => import("./Art").then((mod) => mod.Art), {
  ssr: false,
});

const Keyboard = dynamic(() => import("./Keyboard"), {
  ssr: false,
});

const Painting = dynamic(
  () => import("./Painting").then((mod) => mod.Painting),
  {
    ssr: false,
  }
);

const SPACING = 4;

export const FunMode = ({
  excludedBounds,
}: {
  excludedBounds: { top: number; bottom: number; left: number; right: number };
}) => {
  const FUN_CONTENT = [
    {
      title: "Record Spinner",
      component: RecordSpinner,
      style: {
        top: "25%",
        left: excludedBounds.left / 2,
      },
    },
    {
      title: "Painting",
      component: Painting,
      style: {
        top: "38%",
        left: (excludedBounds.left / 2) * 0.8,
      },
      left: (excludedBounds.left / 2) * 0.8,
    },
    {
      title: "Car",
      component: Car,
      style: {
        top: "80%",
        left: excludedBounds.left / 2,
      },
    },
    {
      title: "Art",
      component: Art,
      style: {
        top: "20%",
        right: excludedBounds.left / 2,
      },
    },
    {
      title: "Keyboard",
      component: Keyboard,
      style: {
        top: "52%",
        right: (excludedBounds.left / 2) * 1.2,
      },
    },
    {
      title: "Earth",
      component: Earth,
      style: {
        top: "75%",
        right: excludedBounds.left / 2,
      },
    },
  ];

  console.log(excludedBounds);

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {FUN_CONTENT.map((content) => (
        <content.component
          key={content.title}
          style={{
            ...content.style,
            zIndex: 30,
          }}
        />
      ))}
    </div>
  );
};
