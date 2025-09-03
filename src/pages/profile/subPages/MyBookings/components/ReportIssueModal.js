import React, { useState, useEffect, useRef, useMemo } from "react";
import Select from "react-select";
import styled from "styled-components";
import Text from "../../../../../components/atoms/Text";
import { isDesktop } from "react-device-detect";
import CustomModal from "../../../../../containers/customModal/customModal";
import Cross from "../../../../../components/molecules/BottomDrawer/assets/cross.svg";
import BottomDrawer from "../../../../../components/molecules/BottomDrawer/BottomDrawer";
import { PrimaryButton } from "../../../../../theme/globalStyleSheet";
import { device } from "../../../../../commons/util/helperFunctions";
import fileUploadConfig from "../../HelpAndSupport/config/fileUploadConfig";
import config from "../../../../../commons/config";
import callAPI from "../../../../../commons/callAPI";
import PushAlert from "../../../../../components/atoms/pushAlert";
import VideoIcon from "../../HelpAndSupport/assets/videoIcon.png";
import Util from "../../../../../commons/util/util";
import FileInput from "../../HelpAndSupport/components/fileInput";
import { getLocalStorage } from "../../../../../util/storageUtil";
import ButtonWithLoading from "components/atoms/ButtonWithLoading";
import { RaiseIssueTitle } from "../config/config";
import { colors } from "theme/colors";

const ReportIssueModal = (props) => {
  const sheetRef = useRef();
  const galleryImagesRef = useRef([]);
  const imageExt = useMemo(() => fileUploadConfig.image, []);
  const maxImageSize = useMemo(() => fileUploadConfig.maxImageSize, []);
  const maxImageDimensions = useMemo(
    () => fileUploadConfig.maxImageDimensions,
    []
  );
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState([]);
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [galleryImages, setGalleryImages] = useState();
  const [galleryImageList, setGalleryImageList] = useState([]);
  const [galleryImageNameList, setGalleryImageNameList] = useState([]);
  const [originalGalleryImageList, setOriginalGalleryImageList] = useState([]);
  const [variantImageSizeList, setVariantImageSizeList] = useState([]);
  const [duplicateGalleryImages, setDuplicateGalleryImages] = useState([]);
  const [deleteGalleryImage, setDeleteGalleryImage] = useState([]);
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [titleOptions, setTitleOptions] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState();

  const customStyles = {
    control: (base) => ({
      ...base,
      background: "#ffffff",
      borderColor: "#25325a",
      padding: "2px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#25325a",
      fontSize: "14px",
      fontWeight: "600",
    }),
  };

  useEffect(() => {
    const user = getLocalStorage("userData");
    if (user?.data?.email) {
      setEmail(atob(user?.data?.email));
    }
    if (user?.data?.roles) {
      setUserRole(user?.data?.roles);
    }
    getTitleOptions();
  }, []);

  const getTitleOptions = () => {
    let titles = RaiseIssueTitle[props?.domain];
    if (titles) {
      titles = titles?.concat(RaiseIssueTitle["Common"]);
    } else {
      titles = RaiseIssueTitle["Common"];
    }
    setTitleOptions(titles || []);
  };

  const closeModal = () => {
    document.body.style.overflow = "auto";
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    try {
      setTicketTitle("");
      setTicketDesc("");
      setGalleryImages();
      setGalleryImageList([]);
      setGalleryImageNameList([]);
      setOriginalGalleryImageList([]);
      setVariantImageSizeList([]);
      setDuplicateGalleryImages([]);
      setDeleteGalleryImage([]);
      setSubmitIsLoading(false);
      setSelectedTitle();
      props.setIsDrawerOpen(false);
    } catch (e) {}
  };

  const IndicatorSeparator = () => {
    return <></>;
  };

  const handleGalleryImages = async (e) => {
    for (let index = 0; index < e.target.files.length; index++) {
      const file = e.target.files[index];
      const fileSize = file.size / 1000;
      try {
        if (
          fileSize < maxImageSize * 1000 &&
          e.target.files.length <= maxImageDimensions.image.limit &&
          galleryImageList.length < maxImageDimensions.image.limit
        ) {
          if (!galleryImageNameList.includes(file.name)) {
            setGalleryImageNameList((oldArray) => [...oldArray, file.name]);
            setGalleryImageList((oldArray) => [...oldArray, file]);
            setVariantImageSizeList((oldArray) => [...oldArray, fileSize]);
          } else {
            setDuplicateGalleryImages((o) => [...o, file.name]);
            PushAlert.error(
              'Duplicate image "' + file.name + '"is not allowed'
            );
          }
        } else {
          if (fileSize > maxImageSize * 1000)
            PushAlert.error(
              `${file.name} size is greater than ${maxImageSize}MB`
            );
          if (
            e.target.files.length > maxImageDimensions.image.limit ||
            galleryImageList.length >= maxImageDimensions.image.limit
          ) {
            PushAlert.error(
              `You are only allowed to upload ${maxImageDimensions.image.limit} files`
            );
            break;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const removeGalleryImage = (i) => {
    const imageName = [...galleryImageNameList].splice(i, 1)[0];
    const imageSize = [...variantImageSizeList].splice(i, 1)[0];

    if (!originalGalleryImageList.includes(imageName)) {
      const images = Array.from(galleryImages).filter(
        (img) => img.name !== imageName
      );
      setGalleryImages(images);
      setGalleryImageList((oldArray) =>
        oldArray.filter((f) => f.name !== imageName)
      );
      setVariantImageSizeList((oldArray) =>
        oldArray.filter((f) => f.name !== imageSize)
      );
    } else {
      let deleteGalleryClone = [...deleteGalleryImage];
      deleteGalleryClone.push(imageName);
      setDeleteGalleryImage(deleteGalleryClone);
      setOriginalGalleryImageList(
        [...originalGalleryImageList].filter((img, index) => index !== i)
      );
    }
    setGalleryImageNameList(
      [...galleryImageNameList].filter((img, index) => index !== i)
    );
    setVariantImageSizeList(
      [...variantImageSizeList].filter((img, index) => index !== i)
    );
  };

  const isSubmitDisabled = () => {
    if (selectedTitle?.label === "Others") {
      return (
        email === "" ||
        ticketTitle === "" ||
        ticketDesc === "" ||
        submitIsLoading
      );
    } else {
      return (
        selectedTitle?.label === "" ||
        selectedTitle?.label === undefined ||
        selectedTitle?.label === null ||
        email === "" ||
        ticketDesc === "" ||
        submitIsLoading
      );
    }
  };

  const handleCreateTicket = async () => {
    try {
      if (!Util.isEmailValid(email)) {
        PushAlert.error("Please enter a valid email id");
        return;
      }
      setSubmitIsLoading(true);
      let title = "";
      if (props.orderId && props.subOrderId) {
        title = `${props.orderId || ""} | ${props.subOrderId || ""} | ${
          selectedTitle?.label === "Others" ? ticketTitle : selectedTitle?.label
        }`;
      } else {
        title =
          selectedTitle?.label === "Others"
            ? ticketTitle
            : selectedTitle?.label;
      }
      let roles = Array.from(
        new Set(userRole?.map((r) => r.split(" ")?.[0]))
      ).join(",");
      let formData = new FormData();
      formData.append("email", btoa(email));
      formData.append("createdBy", roles);
      formData.append("title", title);
      formData.append("description", ticketDesc);
      for (const image of galleryImageList) {
        formData.append("documents", image);
      }
      let apiURL = config.api.helpAndSupport.createTicket;
      let apiResponse = await callAPI.formData(apiURL, formData);
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        PushAlert.success(regResponse.message);
        setSubmitIsLoading(false);
        closeModal();
      } else {
        PushAlert.error(regResponse.message);
        setSubmitIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setSubmitIsLoading(false);
    }
  };

  const renderContent = () => {
    return (
      <Wrapper>
        <ContentContainer>
          <CloseIconContainer>
            <CloseIcon src={Cross} onClick={closeModal} />
          </CloseIconContainer>
          <Title>
            <Text type="extra-bold">Report an issue</Text>
          </Title>
          <SubTitle>
            <Text type="semi-bold">Fill the form below to report an issue</Text>
          </SubTitle>
          <FormContainer>
            <CustomTextField
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              placeholder={"Email*"}
              type="text"
              mandatory={true}
              disabled={false}
              style={{ backgroundColor: "#fff" }}
            />
            <RaiseIssueTitleContainer>
              <Select
                isSearchable={false}
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e)}
                options={titleOptions}
                components={{
                  IndicatorSeparator,
                }}
                styles={{
                  valueContainer: (base) => ({
                    ...base,
                    fontSize: "16px",
                    fontWeight: "500",
                    color: colors?.text?.black300,
                    paddingLeft: "20px",
                    fontFamily: "ManropeRegular",
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "54px",
                    borderRadius: "8px",
                    border: "1px solid #e9e9e9",
                    "&:hover": {
                      border: "1px solid #e9e9e9",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    boxShadow: "none",
                    borderRadius: "8px",
                    marginTop: "5px",
                    marginBottom: "8px",
                    maxHeight: "80px",
                  }),
                  menuList: (base) => ({
                    ...base,
                    maxHeight: "150px",
                  }),
                  option: (base) => ({
                    ...base,
                    border: `1px solid #e9e9e9`,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: colors?.text?.black300,
                    backgroundColor: "#fff",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    fontSize: "16px",
                    fontWeight: "500",
                    letterSpacing: "0.35px",
                    color: colors?.text?.black300,
                    fontFamily: "ManropeRegular",
                  }),
                  noOptionsMessage: (base) => ({
                    ...base,
                    fontSize: "16px",
                    fontWeight: "500",
                    letterSpacing: "0.35px",
                    color: "#181818",
                    fontFamily: "ManropeRegular",
                  }),
                }}
                aria-label="Need help with"
                placeholder="Need help with"
              />
            </RaiseIssueTitleContainer>
            {selectedTitle?.label === "Others" && (
              <CustomTextField
                maxLength={100}
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e?.target?.value)}
                placeholder={"Summarize your issue briefly*"}
                type="text"
                mandatory={true}
                disabled={false}
                style={{ backgroundColor: "#fff" }}
              />
            )}
            <Textarea
              maxLength={250}
              value={ticketDesc}
              onChange={(e) => setTicketDesc(e?.target?.value)}
              placeholder={"Tell us more about your issue"}
            />
            <FileInputContainer>
              <FileInput
                multiple
                allowedExt={imageExt}
                setFile={(f) =>
                  setGalleryImages((o) => [
                    ...Array.from(o || []),
                    ...Array.from(f),
                  ])
                }
                styles={customStyles}
                handleFeaturethumbnail={(e) => handleGalleryImages(e)}
                limit={maxImageDimensions?.variantImage?.limit}
              />
            </FileInputContainer>
            {galleryImageList?.length > 0 ? (
              <ImageDisplayContainer>
                {galleryImageList?.map((image, i) => (
                  <ImageDisplayWrapper>
                    <ImageDisplay
                      ref={(el) =>
                        (galleryImagesRef.current[i] = { image, img: el })
                      }
                      src={
                        image?.type?.includes("video")
                          ? VideoIcon
                          : URL.createObjectURL(image)
                      }
                    />
                    <RemoveImage
                      onClick={() => removeGalleryImage(i)}
                    ></RemoveImage>
                  </ImageDisplayWrapper>
                ))}
              </ImageDisplayContainer>
            ) : null}
          </FormContainer>
        </ContentContainer>
        <DrawerFooterWrapper>
          <ButtonWithLoading
            isLoading={submitIsLoading}
            disabled={isSubmitDisabled()}
            onClick={() => handleCreateTicket()}
            buttonLabel="Confirm"
          />
        </DrawerFooterWrapper>
      </Wrapper>
    );
  };

  if (isDesktop) {
    return (
      <CustomModal isOpen={props.isDrawerOpen} boxStyle={{ maxWidth: "570px" }}>
        <ModalContainer>
          <ModalContentContainer>{renderContent()}</ModalContentContainer>
        </ModalContainer>
      </CustomModal>
    );
  } else {
    return (
      <BottomDrawer
        sheetRef={sheetRef}
        isOpen={props.isDrawerOpen}
        setIsOpen={props.setIsDrawerOpen}
        drawerHeight={"auto"}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: "8px 8px 0px 0px",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag
        hideHeader={true}
        handleClose={closeModal}
      >
        <DrawerContainer>{renderContent()}</DrawerContainer>
      </BottomDrawer>
    );
  }
};

const Wrapper = styled.div`
  width: 100%;
`;
const ContentContainer = styled.div`
  width: 100%;
  position: relative;
  padding: 24px 24px 110px 24px;
`;
const CloseIconContainer = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
`;
const CloseIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
const Title = styled.div`
  font-size: 21px;
  line-height: 28px;
  color: ${colors?.text?.black200};
`;
const SubTitle = styled.div`
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.01px;
  color: ${colors?.text?.black200};
  padding-top: 12px;
`;

const FormContainer = styled.div`
  margin-top: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const CustomTextField = styled.input`
  margin-top: 10px;
  display: flex;
  width: 100%;
  height: 54px;
  font-size: 16px;
  text-align: start;
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  text-transform: none;
  outline: none;
  color: ${colors?.text?.black300};
  background-color: #ffffff;
  padding: 0px 20px;
`;
const Textarea = styled.textarea`
  padding: 12px 20px;
  margin-top: 5px;
  display: flex;
  width: 100%;
  height: 80px;
  font-size: 12pt;
  text-align: start;
  border: 1px solid #e9e9e9;
  border-radius: 10pt;
  text-transform: none;
  background-color: #fff;
  color: ${colors?.text?.black300};
  outline: none;
`;
const RaiseIssueTitleContainer = styled.div`
  width: 100%;
  height: 54px;
  position: relative;
`;
const FileInputContainer = styled.div`
  width: 100%;
  height: 54px;
`;
const ImageDisplayContainer = styled.div`
  display: flex;
  width: 100%;
  overflow: auto;
  margin: 0% 0 0 0%;
  justify-content: flex-start;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  background-color: #fff;
  padding: 16px;
`;
const ImageDisplayWrapper = styled.div`
  position: relative;
  z-index: 999;
  display: flex;
  width: auto;
  justify-content: flex-start;
`;
const ImageDisplay = styled.img`
  width: 75px;
  height: 75px;
`;
const RemoveImage = styled.div`
  display: flex;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAYAAABiFp9rAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF92lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDEtMTFUMTc6NTA6NDIrMDU6MzAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDEtMTFUMTc6NTA6NDIrMDU6MzAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTAxLTExVDE3OjUwOjQyKzA1OjMwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlmYjIwZjRlLWIyMTctNDZjNy1iM2JhLWY2NzBhMzczNWQ4YSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjIzYjRiYzcyLTlmZTQtYmY0OC1iZjM5LWQ2ODA1ZTc3M2Y5OSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjZiZGVmYzUwLWIxYzYtNDI2NS05MzcwLTlkMjM5Nzc4Y2VlNSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NmJkZWZjNTAtYjFjNi00MjY1LTkzNzAtOWQyMzk3NzhjZWU1IiBzdEV2dDp3aGVuPSIyMDIxLTAxLTExVDE3OjUwOjQyKzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OWZiMjBmNGUtYjIxNy00NmM3LWIzYmEtZjY3MGEzNzM1ZDhhIiBzdEV2dDp3aGVuPSIyMDIxLTAxLTExVDE3OjUwOjQyKzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7u2jvxAAACUklEQVRIib3WS4hOYRzH8c97jEIpMyJZoFkoyULGzm1BycJMjCSUcl+QUAYLO9csZIZJoyaXlEtJYiOXXDYiNjazMRIhtxlCyWvxnNe8c3rPeU9GfpvTOed3/t/nOc////yfQrFY9D9U2Lb7aDXPUEzHDEzFWBTwBk9xFw/RkxWkJuNdHdZjFSameJri6wucQSteVzJGKQEW4zH2ZkDKNQ674m9W5wW14CLG5wAkNQYdOFwN1IJ9fwFIaiv2p4Ga/hGkpB3CGvcD1aLtH0JKOiSs3x/QBiFtk2oX0vp6RrAHmCUkTlLDsb0EGoZ1KUHacB+LhARJ6ibmC7XUil8VPCswKkIDJqSADmAIvmMZLpS9uyWsa69QwAdVzuJazIkwMwUCC3Aag/ETK3EDj4RZ9sa+Y/HI0zSnBtMyDNCMYgz5gYUxuCeeyQmsqRKjPhKKrJqW4CpG4FsMGYJzOSAwIopHlUd1GFR2X4if5VEhwtscxpuYi/cxoEaYWSMu5/j+c4QnOSBN+Chk1TlcE9rHN+G3nq8SozvCnQzDPX0pTFj4pZgXA0vZuBxXMuLcjoSm9SrFsFlfnRzXvwU04mwZbJPKBfulBOpFZwqoGZNwStimklqCS5gs9LBKBXsBr0qtfDSeYWQFY1H1zEzz/MAUdJVG8Fa8+VVQnvRP8+xBF/2n2qlCZxyATgp7pSSIMKsDBq4OiY6QdmbYiA9/AfiKnVgrkYFpp6B2YbM9gnc5AJ+FX9UgcVYoKetc9xxbhM45C7NRL/SXAj6hW2h6d/AyayS/AR1les15qUg/AAAAAElFTkSuQmCC);
  background-repeat: no-repeat;
  width: 8px;
  height: 15px;
  cursor: pointer;
  align-self: flex-start;
  position: relative;
  right: 5%;
  bottom: 10%;
  padding: 14px;
`;

const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const DrawerFooterWrapper = styled.div`
  width: 100%;
  height: 68px;
  padding: 0px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 0px;
  background-color: #ffffff;
  box-shadow: 0px 1px 12px rgba(5, 32, 61, 0.05);

  @media ${device.laptop} {
    padding: 0px 24px;
  }
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

export default ReportIssueModal;
