/** @format */

import styled from "styled-components";

export const TerminalContent = styled.div`
  margin: 0px 24px 24px 24px;
  display: flex;
  flex-direction: row;
  height: calc(100% - 64px);
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
`;

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 1000px) {
    width: 100%;
  }
`;

export const SimpleDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
