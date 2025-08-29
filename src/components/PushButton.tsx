import clsx from "clsx";

export const PushButton = (props: {
  onClick: () => void;
  colors: {
    front: string;
    edge: string;
  };
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx("z-20", props.className)}
      onClick={() => {
        props.onClick();
      }}
    >
      <button className="focus:not-[:focus-visible]:outline-none text-white font-sans font-semibold bg-transparent cursor-pointer group text-sm">
        <span className="bg-gray-300 [transform:translateY(3px)] group-active:[transform:translateY(1px)] absolute top-0 left-0 w-full h-full rounded-md p-0 transition-transform duration-300 ease-in-out" />
        <span
          className={clsx(
            "edge absolute top-0 left-0 w-full h-full rounded-md p-0 transition",
            props.colors.edge
          )}
        />
        <span
          className={clsx(
            "front block px-4 py-2 rounded-md [transform:translateY(-6px)] group-active:[transform:translateY(-2px)] transition duration-300 ease-in-out",
            props.colors.front
          )}
        >
          {props.children}
        </span>
      </button>
    </div>
  );
};

export default PushButton;
