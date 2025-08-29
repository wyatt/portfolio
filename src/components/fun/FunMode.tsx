import { useWindowSize } from "@uidotdev/usehooks";
import { RecordSpinner } from "./RecordSpinner";
import { Painting } from "./Painting";
import Keyboard from "./Keyboard";

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
      top: "22%",
      left: excludedBounds.left / 2,
    },
    {
      title: "Painting",
      component: Painting,
      top: "30%",
      left: (excludedBounds.left / 2) * 0.8,
    },
    {
      title: "Keyboard",
      component: Keyboard,
      top: "64%",
      left: (excludedBounds.left / 2) * 1.2,
    },
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {FUN_CONTENT.map((content) => (
        <content.component
          key={content.title}
          style={{
            top: content.top,
            left: content.left,
            zIndex: 30,
          }}
        />
      ))}
    </div>
  );
};
