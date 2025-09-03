import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Loader from "../../../../components/atoms/loader";
import Text from "../../../../components/atoms/Text";
import CloseIcon from "../../../../assets/images/image_close.svg";
import { isMobile } from "react-device-detect";
import { NavContext } from "../../../../context/navContext";
import config from "../../../../commons/config";
import Util from "../../../../commons/util/util";
import callAPI from "../../../../commons/callAPI";
import { PrimaryButton } from "../../../../theme/globalStyleSheet";
import ButtonWithLoading from "components/atoms/ButtonWithLoading";

function EventAccess(props) {
  const useNav = useContext(NavContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [data, setData] = useState({});
  const [employeeId, setEmployeeId] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [submitIsLoading, setIsSubmitLoading] = useState(false);

  useEffect(() => {
    if (isMobile) {
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
    } else {
      useNav.showFooterNavs();
    }
    useNav.showHeaderGoBack();

    return () => {
      useNav.showFooterNavs();
      useNav.hideHeaderGoBack();
      useNav.showBottomNavs();
    };
  }, [useNav]);

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    try {
      let apiURL = config.api.pages.replace(
        "{{pageId}}",
        Util.getSlug(props.location.pathname)
      );

      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (apiResponse.status === 200) {
        setData(regResponse);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (value) => {
    if (value.length <= 6) {
      setEmployeeId(value);
    }
  };

  const handleUserIdSubmit = async () => {
    try {
      setIsSubmitLoading(true);
      const apiURL = config.api.eventAccess.saveEmpId;
      const response = await callAPI.post(apiURL, {
        empId: employeeId,
      });
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        setEmployeeId("");
        setIsSubmitLoading(false);
        setShowQRCode(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <Wrapper>
        <ContentWrapper>
          <FormContainer>
            <UserInputLabel>
              <Text>{data?.name}</Text>
            </UserInputLabel>
            <UserInput
              placeholder="Enter Employee Id"
              value={employeeId}
              onChange={(e) => handleChange(e.target.value)}
            />
          </FormContainer>
          <SubmitButtonContainer>
            <ButtonWithLoading
              isLoading={submitIsLoading}
              disabled={employeeId.length !== 6}
              onClick={() => handleUserIdSubmit()}
              buttonLabel="Submit"
            />
          </SubmitButtonContainer>
          {showQRCode && (
            <>
              <TitleText>
                <Text type="bold">{data?.description}</Text>
              </TitleText>
              <QRCodeContainer>
                {data?.content_blocks[0]?.images[0]?.url && (
                  <QRCodeImage
                    src={data?.content_blocks[0]?.images[0]?.url}
                    onClick={() => {
                      setPreviewImage(data?.content_blocks[0]?.images[0]?.url);
                      setShowImagePreview(true);
                    }}
                  />
                )}
              </QRCodeContainer>
            </>
          )}
        </ContentWrapper>
        {showImagePreview && (
          <PreviewImageWrapper>
            <PreviewImageContainer>
              <PreviewCloseIconWrapper
                onClick={() => setShowImagePreview(false)}
              >
                <PreviewCloseIcon src={CloseIcon} />
              </PreviewCloseIconWrapper>
              <PreviewImage src={previewImage} />
            </PreviewImageContainer>
          </PreviewImageWrapper>
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #f5f5f5;
`;
const ContentWrapper = styled.div`
  width: 100%;
  padding: 24px;
`;
const TitleText = styled.div`
  font-size: 16px;
  padding-top: 24px;
`;
const QRCodeContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;
const QRCodeImage = styled.img`
  width: 225px;
  height: 225px;
`;
const PreviewImageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #000;
  position: absolute;
  top: 0px;
  left: 0px;
`;
const PreviewImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-bottom: 100px;
`;
const PreviewCloseIconWrapper = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
`;
const PreviewCloseIcon = styled.img``;
const PreviewImage = styled.img`
  width: 225px;
  height: 225px;
`;
const FormContainer = styled.div`
  width: 100%;
`;
const UserInputLabel = styled.div`
  font-size: 16px;
`;

const UserInput = styled.input.attrs((props) => ({
  type: "number",
}))`
  margin-top: 10px;
  display: flex;
  width: 100%;
  height: 54px;
  font-size: 16px;
  text-align: start;
  text-indent: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  text-transform: none;
  outline: none;
  color: #222222;
  background-color: #ffffff;
  outline: none;
`;
const SubmitButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`;

export default EventAccess;
