import React from "react";
import styled from "styled-components";
import {
  GeneralPageWrapper,
  PrimaryButton,
} from "../../theme/globalStyleSheet";
import useCustomNavigation from "../../hooks/useCustomNavigation";

function NotFound(props) {
  const { pushHistory } = useCustomNavigation();

  return (
    <Wrapper>
      <meta name="robots" content="noindex, nofollow" />
      <H1>404</H1>
      <H2>You've caught a flight to nowhere</H2>
      <H5>
        Sorry, the page you're looking for is either unavailable, removed or the
        link is broken.
      </H5>

      <RedirectButton onClick={() => pushHistory("/")}>Go Home</RedirectButton>
    </Wrapper>
  );
}

const Wrapper = styled(GeneralPageWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const H1 = styled.h1`
  font-family: ManropeBold;
  text-align: center;
  margin-top: 95px;
  font-size: 120px;
`;
const H2 = styled.h2`
  font-family: ManropeExtraBold;
  font-size: 21px;
  line-height: 27.3px;
  text-align: center;
  color: #273135;
  margin-top: 50px;
`;
const H5 = styled.h5`
  font-family: ManropeRegular;
  font-size: 16px;
  font-weight: 400;
  line-height: 20.8px;
  text-align: center;
  color: #273135;
  opacity: 70%;
  margin-top: 8px;
`;
const RedirectButton = styled(PrimaryButton)`
  width: 180px;
  margin-top: 50px;
`;
export default NotFound;
