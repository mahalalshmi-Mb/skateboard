import { device } from "commons/util/helperFunctions";
import styled, { keyframes } from "styled-components";
import { colors } from "theme/colors";

function Loader() {
  return (
    <Wrapper>
      <LoaderWrapper secondaryColor={colors?.primary}></LoaderWrapper>
    </Wrapper>
  );
}

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const prixClipFix = keyframes`
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  75%, 100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ width }) => width || "56px"};
  height: ${({ height }) => height || "56px"};
  border-radius: 50%;
  position: relative;
  animation: ${rotate} 1s linear infinite;

  &::before,
  &::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 5px solid ${({ primaryColor }) => primaryColor || "#FFF"};
    animation: ${prixClipFix} 2s linear infinite;
  }

  &::after {
    transform: rotate3d(90, 90, 0, 180deg);
    border-color: ${({ secondaryColor }) => secondaryColor || "#FF3D00"};
  }

  @media ${device.laptop} {
    width: ${({ width }) => width || "72px"};
    height: ${({ height }) => height || "72px"};
  }
`;

export default Loader;
