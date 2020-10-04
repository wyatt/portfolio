import React from "react";
import styled from "styled-components";

const ProfileImage = styled.img`
  display: flex;
  border-radius: 10px;
  width: 30vh;
  @media (max-width: 1000px), (max-height: 700px) {
    width: 35vh;
  }
`;

export const ProfilePicture = () => {
  return (
    <ProfileImage
      src="https://www.gravatar.com/avatar/cba36b4d3e6a638f887c6f34feab4197?size=500"
      alt="ProfileImg"
    />
  );
};
