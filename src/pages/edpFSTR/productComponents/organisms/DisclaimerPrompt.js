import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import BottomDrawer from "../../../../components/molecules/BottomDrawer/BottomDrawer";
import Loader from "../../../../components/atoms/loader";
import Text from "../../../../components/atoms/Text";

import DisclaimerImage from "../../assets/DisclaimerImage.svg";
import CancelBlack from "../../assets/CancelBlack.svg";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import { device } from "../../../../commons/util/helperFunctions";
import { colors } from "theme/colors";
import CustomModal from "containers/customModal/customModal";
import { isDesktop } from "react-device-detect";

const defaultAgeRestrictionPromptData = {
  Title: "Before continuing, please verify your age",
  SubTitle: "You need to be 21 years or above for alcohol purchases",
  Description:
    "Products listed in this section are exclusively offered by\nlicensed duty-free outlet (Licensee) and operator of the Platform\nmerely acts as a collection agent of the Licensee\nI declare that I am above the prescribed age limit to purchase\nalcoholic beverages in the State of Karnataka. I also understand\nthat sale of alcoholic beverages by the duty-free Licensee is\nsubject to mandatory physical verification of certain documents,\nincluding passport and boarding pass, and other applicable laws.\nWe retain the right to report accounts that do not adhere to the\nabove mentioned condition.",
  successCtaLabel: "I am above 21",
  failureCtaLabel: "Cancel",
  createdAt: "2025-02-19T10:05:53.022Z",
  updatedAt: "2025-02-19T11:42:49.085Z",
  publishedAt: null,
  Images: {
    data: [
      {
        id: 2707,
        attributes: {
          name: "DisclaimerImage.svg",
          alternativeText: null,
          caption: null,
          width: 231,
          height: 193,
          formats: null,
          hash: "Disclaimer_Image_d542e1955d",
          ext: ".svg",
          mime: "image/svg+xml",
          size: 1.98,
          url: "https://d10sbcma66shuy.cloudfront.net/strapi-assets/Disclaimer_Image_d542e1955d.svg",
          previewUrl: null,
          provider: "strapi-provider-upload-aws-s3-advanced",
          provider_metadata: null,
          createdAt: "2025-02-19T10:05:40.996Z",
          updatedAt: "2025-02-19T10:05:40.996Z",
        },
      },
    ],
  },
};

function DisclaimerPrompt(props) {
  const sheetRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [displayData, setDisplayData] = useState({});

  useEffect(() => {
    getDisplayData();
  }, []);

  const getDisplayData = () => {
    const data = getSessionStorage("configData");
    if (data?.ageRestrictionPromptData) {
      setDisplayData(data.ageRestrictionPromptData);
    } else {
      setDisplayData(defaultAgeRestrictionPromptData);
    }
  };

  const closeModal = () => {
    document.body.style.overflow = "auto";
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    props.setIsDrawerOpen(false);
  };

  const onSuccess = () => {
    setSessionStorage("isAgeDeclared", true);
    props.successHandler();
    closeModal();
  };

  const renderContent = () => {
    return (
      <ContentWrapper>
        <CancelButtonWrapper>
          <CancelImageButton onClick={() => closeModal()} src={CancelBlack} />
        </CancelButtonWrapper>
        <TitleText style={props.titleTextStyle}>
          <Text type="bold">{displayData?.Title}</Text>
        </TitleText>
        <SubTitleText style={props.subTitleTextStyle}>
          <Text>{displayData?.SubTitle}</Text>
        </SubTitleText>
        {/* <ImageContainer>
              <Image src={DisclaimerImage} />
            </ImageContainer> */}
        <Description>
          <Text>{displayData?.Description}</Text>
        </Description>
        <FooterWrapper>
          <FailureButton
            style={props.failureButtonStyle}
            onClick={() => props.setIsDrawerOpen(false)}
          >
            <Text type="extra-bold" style={props.failureButtonTextStyle}>
              {displayData?.failureCtaLabel}
            </Text>
          </FailureButton>
          <SuccessButton style={props.successButtonStyle} onClick={onSuccess}>
            <Text type="extra-bold" style={props.successButtonTextStyle}>
              {displayData?.successCtaLabel}
            </Text>
          </SuccessButton>
        </FooterWrapper>
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
        {isLoading ? (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        ) : (
          <ModalContainer>
            <ModalContentContainer>{renderContent()}</ModalContentContainer>
          </ModalContainer>
        )}
      </CustomModal>
    );
  } else {
    return (
      <BottomDrawer
        sheetRef={sheetRef}
        isOpen={props.isDrawerOpen}
        setIsOpen={props.setIsDrawerOpen}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F4F4F5",
          borderRadius: "8px 8px 0px 0px",
          overflow: "scroll",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag
        hideHeader={true}
        hideCloseIcon={true}
        handleClose={closeModal}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <DrawerContainer>{renderContent()}</DrawerContainer>
        )}
      </BottomDrawer>
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
const CancelButtonWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 14px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const CancelImageButton = styled.img`
  width: 20px;
  height: 20px;
`;
const TitleText = styled.div`
  color: #273135;
  font-size: 24px;
  font-weight: 700;
  line-height: 23px;
  text-align: center;
  padding: 0px 22px;
`;
const SubTitleText = styled.div`
  color: #273135;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  margin-top: 8px;
  text-align: center;
  padding: 8px 22px 0px 22px;
`;
const ImageContainer = styled.div`
  padding-top: 46px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Image = styled.img``;
const Description = styled.div`
  color: #222;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  opacity: 0.6;
  margin-top: 30px;
  max-height: 300px;
  overflow-y: scroll;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }
`;
const FooterWrapper = styled.div`
  width: 100%;
  height: 77px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 30px;
`;
const SuccessButton = styled.div`
  display: flex;
  height: 47px;
  padding: 16px 32px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background-color: ${colors?.button?.primaryBackground};

  color: ${colors?.button?.primaryText};
  font-size: 16px;
  font-weight: 800;
  line-height: 21px;
  cursor: pointer;

  @media ${device.mobileS} {
    font-size: 12px;
    line-height: 16px;
  }

  @media ${device.mobileL} {
    font-size: 16px;
    line-height: 21px;
  }
`;
const FailureButton = styled.div`
  display: flex;
  height: 47px;
  padding: 16px 32px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  border: 1px solid ${colors?.button?.primaryBackground};

  color: ${colors?.button?.primaryBackground};
  font-size: 16px;
  font-weight: 800;
  line-height: 21px;
  cursor: pointer;

  @media ${device.mobileS} {
    font-size: 12px;
    line-height: 16px;
  }

  @media ${device.mobileL} {
    font-size: 16px;
    line-height: 21px;
  }
`;
const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export default DisclaimerPrompt;
