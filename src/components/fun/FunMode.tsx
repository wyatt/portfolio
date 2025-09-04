import { useWindowSize } from "@uidotdev/usehooks";
import { RecordSpinner } from "./RecordSpinner";
import { Painting } from "./Painting";
import Keyboard from "./Keyboard";
import { Art } from "./Art";

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
      title: "Keyboard",
      component: Keyboard,
      style: {
        top: "80%",
        left: (excludedBounds.left / 2) * 1.2,
      },
      left: (excludedBounds.left / 2) * 1.2,
    },
    {
      title: "Art",
      component: Art,
      style: {
        top: "15%",
        right: excludedBounds.left / 2,
      },
    },
  ];

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
