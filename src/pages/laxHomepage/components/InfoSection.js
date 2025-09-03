import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { device } from "../../../commons/util/helperFunctions";
import Text from "../../../components/atoms/Text";
import useCustomNavigation from "../../../hooks/useCustomNavigation";
import { colors } from "theme/colors";
import ReactHtmlParser from "react-html-parser";

const InfoSection = (props) => {
  const { pushHistory } = useCustomNavigation();

  const handleButtonClick = (url, isExternal, isNewWindow) => {
    if (isExternal) {
      if (isNewWindow) {
        window.open(url, "_blank");
      } else {
        window.open(url, "_self");
      }
    } else {
      pushHistory(url);
    }
  };
  return (
    <Wrapper>
      <ContentContainer>
        <TextContainer>
          <Title>
            <Text type="bold">
              {ReactHtmlParser(props.data?.attributes?.body) || ""}
            </Text>
          </Title>
          <Description>
            <Text>{ReactHtmlParser(props.data?.attributes?.html) || ""}</Text>
          </Description>
        </TextContainer>
        <ButtonContainer>
          <Button
            onClick={() =>
              handleButtonClick(
                props.data?.attributes?.redirectLink,
                props.data?.attributes?.isExternal,
                props.data?.attributes?.isNewWindow
              )
            }
          >
            <Text>{props.data?.attributes?.header || ""}</Text>
          </Button>
        </ButtonContainer>
      </ContentContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;
const ContentContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media ${device.laptop} {
    flex-direction: row;
  }
`;
const TextContainer = styled.div`
  width: 100%;
`;
const Title = styled.div`
  font-size: 36px;
  line-height: 1.2;
  color: ${colors?.text?.black200};
`;
const Description = styled.div`
  margin-top: 8px;
  font-size: 16px;
  line-height: 1.2;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Button = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px 6px;
  background-color: ${({ disabled }) =>
    disabled ? "transparent" : `${colors?.button?.primaryBackground}`};
  border: ${({ disabled }) => (disabled ? "1px solid #a7a9ac" : "none")};
  border-radius: 6px;
  padding: 10px 32px;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
  cursor: pointer;
  margin-top: 16px;

  font-size: 18px;
  color: ${({ disabled }) => (disabled ? "#a7a9ac" : `${colors?.button?.primaryText}`)};

  @media ${device.laptop} {
    margin-top: 0px;
    width: fit-content;
    font-size: 28px;
  }
`;
export default InfoSection;
