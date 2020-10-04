import React from "react";
import styled from "styled-components";
import { RiGithubLine, RiDiscordLine, RiDribbbleLine } from "react-icons/ri";

export const MainBody = () => {
  return (
    <MainContentContainer>
      <h1>Wyatt Sell</h1>
      <p>
        Hey, I'm Wyatt!{" "}
        <span role="img" aria-label="wave">
          👋
        </span>{" "}
        I'm a student, programmer, designer, and a soon-to-be startup founder. I
        enjoy tinkering with Linux machines, designing user interfaces and
        learning new things. I'm proficient in HTML + CSS, Javascript, Python,
        and a little Bash. Currently learning React.
        <br />
        <br />
        If you need a website, let's talk. All websites are designed using the
        latest standards to ensure speed, usability and simplicity.
      </p>
      <Buttons>
        <SecondaryButtons>
          <Button href="https://dsc.bio/wyatt">
            <RiDiscordLine />
          </Button>
          <Button href="https://dribbble.com/wyattsell">
            <RiDribbbleLine />
          </Button>
          <Button href="https://github.com/wyatt">
            <RiGithubLine />
          </Button>
        </SecondaryButtons>
        <ContactButton href="mailto:wyatt@wyattsell.com">
          Get in touch
        </ContactButton>
      </Buttons>
    </MainContentContainer>
  );
};

//Styles
const MainContentContainer = styled.div`
  h1 {
    margin: 0;
  }
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0px 0px 0px 24px;
  @media (max-width: 1000px) {
    margin: 24px 0 0 0;
    width: 100%;
    text-align: center;
  }
`;

const Buttons = styled.div`
  justify-content: flex-end;
  align-items: center;
  align-self: flex-end;
  width: 100%;
  height: 40px;
  margin-top: auto;
  @media (max-width: 1000px) {
    margin-top: 24px;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
`;

const ContactButton = styled.a`
  display: flex;
  font-size: 120%;
  height: 100%;
  width: 200px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: all 0.25s;
  background-color: #82b1ff;
  text-decoration: none;
  margin-left: 5px;
  color: rgb(38, 50, 56);
  box-sizing: border-box;
  font-size: 100%;
  &:focus {
    outline: none;
  }
  &:hover {
    background: rgba(0, 0, 0, 0);
    border: 1px solid white;
    color: white;
  }
  @media (max-width: 1000px) {
    margin-top: 24px;
    width: 100%;
    height: 35px;
    margin-left: 0;
  }
`;

const Button = styled.a`
  display: flex;
  width: 40px;
  margin: 0 5px;
  border: 1px solid white;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: white;
    color: rgb(38, 50, 56);
  }
`;

const SecondaryButtons = styled.div`
  height: 40px;
  justify-content: flex-end;
  @media (max-width: 1000px) {
    width: 100%;
    justify-content: center;
  }
`;
