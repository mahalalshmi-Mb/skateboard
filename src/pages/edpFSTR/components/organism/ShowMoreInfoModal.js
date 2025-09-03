import React, { useRef, useState, useEffect } from "react";
import BottomDrawer from "../../../../components/molecules/BottomDrawer/BottomDrawer";
import CustomModal from "../../../../containers/customModal/customModal";
import {
  device,
  isDesktopDevice,
} from "../../../../commons/util/helperFunctions";
import styled from "styled-components";
import Text from "components/atoms/Text";
import { colors } from "theme/colors";
import CrossWithBackground from "../../../../components/molecules/BottomDrawer/assets/crossWithBackground.svg";
import PhoneCall from "../../assets/phone-call.svg";
import Timer from "../../assets/timer.svg";
import InspectionReportImg from "../../assets/InspectionReport.gif";
import { getAppConfig } from "commons/util/appConfigHelper";

const ShowMoreInfoModal = (props) => {
  const sheetRef = useRef();
  const [viewIndex, setViewIndex] = useState(0);
  const [contactNo, setContactNo] = useState("");
  const [timing, setTiming] = useState();

  useEffect(() => {
    const contactDetail = props?.data?.contact?.find(
      (item) => item?.isActive === true && item?.contactNo !== ""
    );
    setContactNo(contactDetail?.contactNo);
    fetchTiming(props?.data?.shopTimings);

    return () => {
      setViewIndex(0);
    };
  }, []);

  const closeModal = () => {
    document.body.style.overflow = "auto";
    setViewIndex(0);
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    try {
      props.setIsDrawerOpen(false);
    } catch (e) {}
  };

  const fetchTiming = (data) => {
    let timingSet = {};
    data.forEach((item) => {
      item?.dayOfWeek?.forEach((day) => {
        timingSet[day] = {
          start: `${item.startHour}:${item.startMin}`,
          end: `${item.endHour}:${item.endMin}`,
        };
      });
    });
    const message = formatTimings(timingSet);
    setTiming(message);
  };

  const formatTimings = (timingSet) => {
    let formatted = [];
    let currentStart = null;
    let currentEnd = null;
    let currentTime = null;

    const daysOfWeek = Object.keys(timingSet);

    daysOfWeek.forEach((day, index) => {
      const timing = timingSet[day];

      if (currentStart === null) {
        currentStart = day;
        currentEnd = day;
        currentTime = timing;
      }

      if (index > 0) {
        const prevTiming = timingSet[daysOfWeek[index - 1]];

        if (
          timing.start === prevTiming.start &&
          timing.end === prevTiming.end
        ) {
          currentEnd = day;
        } else {
          formatted.push({
            range: `${currentStart}${
              currentEnd !== currentStart ? `-${currentEnd}` : ""
            }`,
            time: formatTimeRange(currentTime),
          });

          currentStart = day;
          currentEnd = day;
          currentTime = timing;
        }
      }
      if (index === daysOfWeek.length - 1) {
        formatted.push({
          range: `${currentStart}${
            currentEnd !== currentStart ? `-${currentEnd}` : ""
          }`,
          time: formatTimeRange(timing),
        });
      }
    });

    return formatted.map((range) => {
      return `${range.range} : ${range.time}`;
    });
  };

  const formatTimeRange = (time) => {
    if (time.start === "00:00" && time.end === "23:59") {
      return "Open all day";
    }

    const start12hr = convertTimeFormat(time.start);
    const end12hr = convertTimeFormat(time.end);
    return `${start12hr} -  ${end12hr}`;
  };

  const convertTimeFormat = (time) => {
    const [hour, minute] = time.split(":");
    let hour12 = parseInt(hour, 10);
    const period = hour12 >= 12 ? "pm" : "am";
    if (hour12 > 12) hour12 -= 12;
    if (hour12 === 0) hour12 = 12;
    return `${hour12}:${minute} ${period}`;
  };

  const renderContent = () => {
    return (
      <Wrapper>
        <HeaderText>
          <Text type="bold">{props?.data?.name}</Text>
        </HeaderText>
        <HorzDivider />
        <StoreInfo>
          {props?.data?.description && props?.data?.description !== "" && (
            <StoreDescription>
              <Text>{props?.data?.description}</Text>
            </StoreDescription>
          )}
          {props?.data?.inspectionReportUrl && (
            <InspectionReportWrapper>
              <InspectionReport
                onClick={() =>
                  window.open(
                    props?.data?.inspectionReportUrl,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                src={InspectionReportImg}
                alt="InspectionReport"
              />
            </InspectionReportWrapper>
          )}
          <ContactWrapper>
            <StoreTimeWrapper>
              <StoreTimeTitle>
                <Text>Hours may vary</Text>
              </StoreTimeTitle>
              {timing?.map((item, index) => (
                <StoreTime key={index}>
                  <TimerIcon src={Timer} alt="timer" />
                  <Text>{item}</Text>
                </StoreTime>
              ))}
            </StoreTimeWrapper>
            {getAppConfig("SHOW_INFO_PH_NO") &&
              contactNo &&
              contactNo !== "" && (
                <ContactContainer>
                  <ContactIcon src={PhoneCall} alt="phone-call" />
                  <ContactNumber>
                    <Text>{contactNo}</Text>
                  </ContactNumber>
                </ContactContainer>
              )}
          </ContactWrapper>
        </StoreInfo>
      </Wrapper>
    );
  };

  if (isDesktopDevice()) {
    return (
      <CustomModal
        isOpen={props.isDrawerOpen}
        boxStyle={{ maxWidth: "800px", maxHeight: "600px" }}
        modalStyle={{ zIndex: 999999 }}
      >
        <ModalContainer>
          <ModalCloseIconContainer>
            <CloseIcon
              alt="close"
              src={CrossWithBackground}
              onClick={(e) => closeModal()}
            />
          </ModalCloseIconContainer>
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
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag={true}
        handleClose={closeModal}
        hideCloseIcon={viewIndex === 2}
        closeIcon={CrossWithBackground}
        title={props?.data?.name}
        headerTextStyle={{
          width: "100%",
          color: colors?.text?.black900,
          fontSize: "20px",
          paddingTop: "8px",
        }}
      >
        <DrawerContainer>
          <DrawerContentContainer>{renderContent()}</DrawerContentContainer>
        </DrawerContainer>
      </BottomDrawer>
    );
  }
};

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
const DrawerContentContainer = styled.div`
  width: 100%;
  padding: 0px 24px;
  height: calc(100% - 40px - 53px - 20px);
`;
const ModalCloseIconContainer = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  cursor: pointer;
  z-index: 9;
`;
const CloseIcon = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;
`;
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  @media ${device.laptop} {
    padding: 24px;
  }
`;
const HeaderText = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    font-size: 26px;
    width: 100%;
    color: ${colors?.text?.black900};
    font-size: 21px;
    padding-top: 8px;
  }
`;
const HorzDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 24px 0px;
  background-color: ${colors?.border};
`;
const StoreInfo = styled.div``;
const StoreDescription = styled.div`
  color: ${colors?.text?.black900};
  font-size: 16px;
  height: 100%;
  max-height: 400px;
  overflow: scroll;
  scrollbar-width: none;

  @media ${device.laptop} {
    max-height: 240px;
  }
`;
const StoreTimeWrapper = styled.div``;
const ContactWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
  justify-content: space-between;
  padding: 0px 0px 24px 0px;

  @media ${device.laptop} {
    flex-direction: row;
    padding: 0px;
  }
`;
const ContactContainer = styled.div`
  width: fit-content;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
const ContactIcon = styled.img`
  width: 16px;
  height: 16px;
`;
const ContactNumber = styled.div`
  color: ${colors?.text?.blue500};
`;
const TimerIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 8px;
`;
const StoreTimeTitle = styled.div`
  color: ${colors?.text?.gray800};
  font-size: 14px;
  margin-bottom: 6px;
`;
const StoreTime = styled.div`
  display: flex;
  align-items: center;
`;
const InspectionReportWrapper = styled.div`
  padding: 18px 0px;
  cursor: pointer;
`;
const InspectionReport = styled.img`
  width: -webkit-fill-available;

  @media ${device.laptop}, ${device.tablet} {
    width: 340px;
  }
`;

export default ShowMoreInfoModal;
