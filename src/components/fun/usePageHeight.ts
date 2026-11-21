import { useEffect, useState } from "react";

// Height of the page's content, for canvases that need to cover the whole page.
//
// html and body are fixed at height: 100%, so the content overflows them and
// watching the document's own size never sees the page grow (fonts and images
// loading, rows expanding). Instead this watches the elements that make up the
// page and takes the lowest bottom edge. The fun widgets' container is skipped
// so their full-page canvases don't hold the height open after content shrinks.
export const FUN_MODE_ATTRIBUTE = "data-fun-mode";

export const usePageHeight = () => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const getPageElements = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          `body > * > *:not([${FUN_MODE_ATTRIBUTE}])`,
        ),
      );

    const measure = () => {
      let bottom = window.innerHeight;
      for (const element of getPageElements()) {
        bottom = Math.max(
          bottom,
          element.getBoundingClientRect().bottom + window.scrollY,
        );
      }
      setHeight(Math.ceil(bottom));
    };

    const resizeObserver = new ResizeObserver(measure);
    const observeAll = () => {
      resizeObserver.disconnect();
      getPageElements().forEach((element) => resizeObserver.observe(element));
      measure();
    };
    observeAll();

    // Re-observe if the page's top-level elements change (e.g. on navigation)
    const mutationObserver = new MutationObserver(observeAll);
    document.body
      .querySelectorAll(":scope > *")
      .forEach((element) =>
        mutationObserver.observe(element, { childList: true }),
      );

    window.addEventListener("resize", measure);
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return height;
};
