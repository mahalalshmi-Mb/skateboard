import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import Text from "../../../../components/atoms/Text";
import { getSessionStorage } from "../../../../util/storageUtil";
import { device } from "../../../../commons/util/helperFunctions";
import CustomModal from "containers/customModal/customModal";
import { isDesktop } from "react-device-detect";

const defaultData = {
  name: "Hang tight, we're fixing a few things.",
  html: `<p>
	Our ordering site is taking a quick break due to some technical issues. We're working behind the scenes to get everything back up and running smoothly. We expect to be back next week, better than ever.
	<br />
	Thanks for your patience and your cravings. We'll be serving you soon.
    </p>`,
};

function DarkSitePrompt(props) {
  const [displayData, setDisplayData] = useState({});

  useEffect(() => {
    getDisplayData();
  }, []);

  const getDisplayData = () => {
    const data = getSessionStorage("darkSiteData") || props?.data;
    if (data?.darkSitePromptData) {
      setDisplayData(data.darkSitePromptData);
    } else {
      setDisplayData(defaultData);
    }
  };

  const renderContent = () => {
    return (
      <ContentWrapper>
        <TitleText style={props.titleTextStyle}>
          <Text type="bold">{displayData?.name}</Text>
        </TitleText>
        <SubTitleText style={props.subTitleTextStyle}>
          <Text>{ReactHtmlParser(displayData?.html)}</Text>
        </SubTitleText>
      </ContentWrapper>
    );
  };

  if (isDesktop) {
    return (
      <CustomModal
        isOpen={props.isDrawerOpen}
        boxStyle={{
          maxWidth: "570px",
          backgroundColor: "#F4F5F5",
        }}
      >
        <ModalContainer>
          <ModalContentContainer>{renderContent()}</ModalContentContainer>
        </ModalContainer>
      </CustomModal>
    );
  } else {
    return (
      <CustomModal
        isOpen={props.isDrawerOpen}
        boxStyle={{
          maxWidth: "90%",
          backgroundColor: "#F4F5F5",
        }}
      >
        <ModalContainer>
          <ModalContentContainer>{renderContent()}</ModalContentContainer>
        </ModalContainer>
      </CustomModal>
    );
  }
}

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 24px;

  @media ${device.tablet} {
    padding: 40px 48px;
  }
`;
const TitleText = styled.div`
  color: #273135;
  font-size: 24px;
  font-weight: 700;
  line-height: 23px;
`;
const SubTitleText = styled.div`
  color: #273135;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  margin-top: 8px;
  padding-top: 8px;
`;
const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const ModalContentContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export default DarkSitePrompt;
