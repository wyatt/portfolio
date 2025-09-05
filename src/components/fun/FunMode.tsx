import { useWindowSize } from "@uidotdev/usehooks";
import { RecordSpinner } from "./RecordSpinner";
import { Painting } from "./Painting";
import Keyboard from "./Keyboard";
import { Art } from "./Art";
import { Car } from "./Car";
import { Earth } from "./Earth";

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
