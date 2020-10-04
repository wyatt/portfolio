/** @format */

import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { visiblePage as visiblePageAtom } from "../../../core/app";

export const Typewriter = (props) => {
  const [, setVisiblePage] = useAtom(visiblePageAtom);
  const [state, setState] = useState({
    mounted: false,
    message: "",
  });

  useEffect(() => {
    const interval = setTimeout(() => {
      const isFinished = state.message.length >= props.message.length;

      if (state.mounted && !isFinished) {
        const nextChar = props.message.charAt(state.message.length);

        setState((prev) => {
          return {
            ...prev,
            message: prev.message + nextChar,
          };
        });
      } else if (isFinished) {
        setVisiblePage("profile");
      }
    }, props.interval);

    return () => {
      clearTimeout(interval);
    };
  }, [
    props.interval,
    props.message,
    state.mounted,
    state.message,
    setVisiblePage,
  ]);

  useEffect(() => {
    setState((s) => ({ ...s, mounted: true }));
    return () => setState((s) => ({ ...s, mounted: false }));
  }, []);

  return <span>{state.message}</span>;
};
