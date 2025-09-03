import { useState } from "react";
import styled from "styled-components";
import moment from "util/momentWrapper";
import ArrowBlack from "../../../../../assets/images/cart/arrowUpBlack.svg";
import EmailIcon from "../../../../../assets/images/envelope-closed-black.svg";
import PhoneIcon from "../../../../../assets/images/phone-headset-black.svg";
import { getAppConfig } from "../../../../../commons/util/appConfigHelper";
import Text from "../../../../../components/atoms/Text";
import { colors } from "../../../../../theme/colors";
// import ClockIcon from "../../../../estimatedWaitTime/assets/clock.svg";
import VideoIcon from "../assets/videoIcon.png";

function TicketCard(props) {
  const videoExt = [".mov", ".mp4"];
  const [filesOpen, setFilesOpen] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [contactUsOpen, setContactUsOpen] = useState(false);

  return (
    <TicketCardWrapper>
      <TicketHeaderWrapper>
        <TicketNumberWrapper>
          <Row>
            <TicketCardLabel>
              <Text type="semi-bold">TICKET NO:</Text>
            </TicketCardLabel>
            <TicketCardValue>
              <Text type="semi-bold">
                #{props.data?.tid?.slice(-5) || props.data?.ticketId?.slice(-5)}
              </Text>
            </TicketCardValue>
          </Row>
        </TicketNumberWrapper>
        <TicketStatusWrapper>
          <Row>
            <TicketStatus>
              <Text type="semi-bold">
                {props.data?.status || props.data?.isOpen ? "Open" : "Closed"}
              </Text>
            </TicketStatus>
          </Row>
        </TicketStatusWrapper>
      </TicketHeaderWrapper>
      <Row>
        <TicketCardValue>
          <Text type="bold">
            {props.data?.title?.split("|")?.pop()?.trim() || ""}
          </Text>
        </TicketCardValue>
      </Row>
      <TicketDescWrapper>
        <TicketDesc>
          <Text type="semi-bold">{props.data?.description}</Text>
        </TicketDesc>
      </TicketDescWrapper>
      <CreatedAtWrapper>
        {/* <CreatedAtIcon src={ClockIcon} /> */}
        <TicketDesc>
          <Text type="semi-bold">
            {moment(props.data?.recordDate).format("lll")}
          </Text>
        </TicketDesc>
      </CreatedAtWrapper>
      {props?.data?.files?.length > 0 && (
        <>
          <Divider />
          <FilesWrapper>
            <SectionTitleWrapper onClick={() => setFilesOpen(!filesOpen)}>
              <SectionTitle>
                <Text type="bold">Attachments</Text>
              </SectionTitle>
              <ArrowIcon src={ArrowBlack} isOpen={filesOpen} />
            </SectionTitleWrapper>
            {filesOpen && (
              <FilesListWrapper>
                <FilesCardWrapper>
                  {props?.data?.files?.map((file, fIndex) => (
                    <FilesCard
                      src={
                        videoExt?.some((el) => file?.pathABS.includes(el))
                          ? VideoIcon
                          : file?.pathABS
                      }
                      key={fIndex}
                    />
                  ))}
                </FilesCardWrapper>
              </FilesListWrapper>
            )}
          </FilesWrapper>
        </>
      )}
      {props?.data?.updates?.length > 0 && (
        <>
          <Divider />
          <FilesWrapper>
            <SectionTitleWrapper onClick={() => setUpdatesOpen(!updatesOpen)}>
              <SectionTitle>
                <Text type="bold">Updates</Text>
              </SectionTitle>
              <ArrowIcon src={ArrowBlack} isOpen={updatesOpen} />
            </SectionTitleWrapper>
            {updatesOpen && (
              <UpdatesContainer>
                {props?.data?.updates?.map((updates, uIndex) => (
                  <UpdatesWrapper key={uIndex}>
                    <TicketCardLabel>
                      <Text type="bold">
                        {moment(updates?.timestampIST).format("lll")}:{" "}
                      </Text>
                    </TicketCardLabel>
                    <TicketCardValue>
                      <Text>{updates?.title}</Text>
                    </TicketCardValue>
                  </UpdatesWrapper>
                ))}
              </UpdatesContainer>
            )}
          </FilesWrapper>
        </>
      )}
      {(getAppConfig("EDP_SUPPORT_PHONE_NO") ||
        getAppConfig("EDP_SUPPORT_EMAIL")) && (
        <>
          <Divider />
          <FilesWrapper>
            <SectionTitleWrapper
              onClick={() => setContactUsOpen(!contactUsOpen)}
            >
              <SectionTitle>
                <Text type="bold">Contact Us</Text>
              </SectionTitle>
              <ArrowIcon src={ArrowBlack} isOpen={contactUsOpen} />
            </SectionTitleWrapper>
            {contactUsOpen && (
              <ContactUsContainer>
                {getAppConfig("EDP_SUPPORT_PHONE_NO") && (
                  <ContactUsWrapper>
                    <ContactUsIcon src={PhoneIcon} />
                    <ContactUsText
                      href={`tel:${getAppConfig("EDP_SUPPORT_PHONE_NO")}`}
                    >
                      <Text>{getAppConfig("EDP_SUPPORT_PHONE_NO")}</Text>
                    </ContactUsText>
                  </ContactUsWrapper>
                )}
                {getAppConfig("EDP_SUPPORT_EMAIL") && (
                  <ContactUsWrapper>
                    <ContactUsIcon src={EmailIcon} />
                    <ContactUsText
                      href={`mailto:${getAppConfig("EDP_SUPPORT_EMAIL")}`}
                    >
                      <Text>{getAppConfig("EDP_SUPPORT_EMAIL")}</Text>
                    </ContactUsText>
                  </ContactUsWrapper>
                )}
              </ContactUsContainer>
            )}
          </FilesWrapper>
        </>
      )}
    </TicketCardWrapper>
  );
}

const TicketCardWrapper = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  border: ${({ selected }) =>
    selected ? "1px solid #096B71" : "0.5px solid #dedddd"};
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
`;
const TicketHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const TicketNumberWrapper = styled.div``;
const TicketStatusWrapper = styled.div``;
const TicketStatus = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${colors.primary};
`;
const TicketCardLabel = styled.div`
  font-size: 12px;
  line-height: 22px;
  letter-spacing: 0.1em;
  color: #273135;
`;
const TicketCardValue = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: #273135;
`;
const TicketDesc = styled.div`
  font-size: 14px;
  color: #273135;
`;
const TicketDescWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 4px;
`;
const CreatedAtWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-top: 4px;
`;
const CreatedAtIcon = styled.img`
  width: 14px;
`;
const Divider = styled.div`
  width: calc(100% + 32px);
  border: 1px solid #e8e8e8;
  margin-left: -16px;
  margin-top: 12px;
  margin-bottom: 12px;
`;
const FilesWrapper = styled.div`
  width: 100%;
`;
const SectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const ArrowIcon = styled.img`
  transition: all 0.4s ease;
  transform: ${({ isOpen }) => !isOpen && "rotate(-180deg)"};
`;
const SectionTitle = styled.div`
  font-size: 14px;
  color: #273135;
`;
const FilesListWrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: auto;
  margin: 0% 0px 0px 0%;
  justify-content: flex-start;
  padding-top: 8px;
`;
const FilesCardWrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: auto;
  margin: 0% 0px 0px 0%;
  justify-content: flex-start;
  gap: 8px;
`;
const FilesCard = styled.img`
  width: 45px;
  height: 45px;
`;
const UpdatesContainer = styled.div`
  width: 100%;
  margin-top: 12px;
`;
const UpdatesWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ContactUsContainer = styled.div`
  width: 100%;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const ContactUsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const ContactUsIcon = styled.img``;
const ContactUsText = styled.a`
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-all;
  text-decoration: underline !important;
  color: #273135 !important;
`;

export default TicketCard;
