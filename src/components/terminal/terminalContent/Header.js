import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { useAtom } from "jotai";
import { visiblePage as visiblePageAtom } from "../../../core/app";

const WindowButtons = () => {
  return (
    <div>
      <WindowButton backgroundColor={"rgb(255, 95, 86)"} />
      <WindowButton backgroundColor={"rgb(255, 189, 46)"} />
      <WindowButton backgroundColor={"rgb(39, 201, 63)"} />
    </div>
  );
};

export const Header = () => {
  const [visiblePage] = useAtom(visiblePageAtom);
  const [state, setState] = useState({
    title: "",
  });
  useEffect(() => {
    if (visiblePage === "terminal") {
      setState(() => {
        return { title: "Terminal" };
      });
    } else {
      setState(() => {
        return { title: "./portfolio.sh" };
      });
    }
  }, [state.title, visiblePage]);
  return (
    <HeaderContainer className="profile">
      <WindowButtons />
      <p>{state.title}</p>
      <ScaffoldDiv />
    </HeaderContainer>
  );
};

// Styles
const HeaderContainer = styled.div`
  align-items: center;
  height: 64px;
  justify-content: space-between;
  margin: 0 24px;
  &.terminal {
    height: 64px;
  }
  &.profile {
    height: 64px;
  }
`;

const WindowButton = styled.div`
  height: 16px;
  width: 16px;
  margin-right: 10px;
  border-radius: 16px;
  background-color: ${(props) => props.backgroundColor};
`;

export const ScaffoldDiv = styled.div`
  width: 78px;
`;
