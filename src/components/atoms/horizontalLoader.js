import styled, { keyframes } from "styled-components";
import { colors } from "theme/colors";

function HorizontalLoader(props) {
  return (
    <Wrapper style={props?.wrapperStyle} height={props?.height}>
      <LoaderWrapper color={colors?.primary}></LoaderWrapper>
    </Wrapper>
  );
}

const bblFadInOut = keyframes`
  0%, 80%, 100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height:  ${({ height }) => height || "100vh"} ;
`;

const LoaderWrapper = styled.div`
  color: ${({ color }) => color || "#FFF"};
  font-size: 7px;
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  animation-fill-mode: both;
  animation: ${bblFadInOut} 1.8s infinite ease-in-out;
  animation-delay: -0.16s;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    width: 2.5em;
    height: 2.5em;
    border-radius: 50%;
    animation-fill-mode: both;
    animation: ${bblFadInOut} 1.8s infinite ease-in-out;
  }

  &::before {
    left: -3.5em;
    animation-delay: -0.32s;
  }

  &::after {
    left: 3.5em;
  }
`;

export default HorizontalLoader;
