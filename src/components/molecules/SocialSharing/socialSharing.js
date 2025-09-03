import {
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from "react-share";
import {
  ModalContainer,
  ModalTitle,
  ModalHeaderLine,
  ModalCloseButton,
  SocialShareLinks,
  SocialIcon,
  ModalHeader,
  ModalHeaderImage,
  ModalHeaderTitle,
  ModalHeaderSubTitle,
  CustomSlider,
} from "./style";
import Text from "../../atoms/Text";
import CustomModal from "../../../containers/customModal/customModal";
import PushAlert from "../../../components/atoms/pushAlert";
import Util from "../../../commons/util/util";
import closeIcon from "./assets/images/closeIcon.svg";
import copyIcon from "./assets/images/copyIcon.svg";
import whatsappIcon from "./assets/images/whatsappIcon.svg";
import linkedinIcon from "./assets/images/linkedinIcon.svg";
import fbIcon from "./assets/images/fbIcon.svg";
import twitterIcon from "./assets/images/twitterIcon.svg";

function SocialSharing(props) {
  const sliderSettings = {
    dots: false,
    arrows: false,
    autoplay: false,
    speed: 1000,
    slidesToShow: 3.3,
    slidesToScroll: 1,
    infinite: false,
  };
  return (
    <>
      <CustomModal
        isOpen={props.isOpen}
        boxStyle={
          !props.isMobile
            ? {
                overflow: "hidden",
                width: "650px",
                height: "255px",
                background: "#ffffff",
                borderRadius: "20px",
                maxWidth: "unset",
              }
            : {
                position: "fixed",
                width: "unset",
                height: "341px",
                maxWidth: "unset",
                bottom: "0",
                right: "0",
                left: "0",
                top: "unset",
                backgroundColor: "#ffffff",
                zIndex: "1",
                borderRadius: "20px 20px 0px 0px",
                transform: "unset",
                overflow: "hidden",
              }
        }
      >
        <ModalContainer>
          {!props.isMobile ? (
            <ModalTitle>
              <Text type="bold">Share this blog</Text>
            </ModalTitle>
          ) : (
            <ModalHeader>
              <div className="row">
                <div className="col-3">
                  <ModalHeaderImage src={props?.image} />
                </div>
                <div className="col-9">
                  <ModalHeaderTitle>
                    <Text type="bold">
                      {Util.truncatingSentence(props?.description, 25)}
                    </Text>
                  </ModalHeaderTitle>
                  <ModalHeaderSubTitle>
                    <Text>{Util.truncatingSentence(props.pageUrl, 25)}</Text>
                  </ModalHeaderSubTitle>
                </div>
              </div>
            </ModalHeader>
          )}

          <ModalCloseButton
            onClick={() => props.setIsOpen(false)}
            src={closeIcon}
            alt=""
          />
          <ModalHeaderLine />
          <SocialShareLinks>
            {!props.isMobile ? (
              <div className="row">
                <div className="col">
                  <SocialIcon
                    src={copyIcon}
                    onClick={() => {
                      navigator.clipboard.writeText(props.pageUrl);
                      PushAlert.success("Copied to clipboard");
                    }}
                  />
                </div>
                <div className="col">
                  <WhatsappShareButton
                    quote="Show me the Google!"
                    url={props.pageUrl}
                  >
                    <SocialIcon src={whatsappIcon} />
                  </WhatsappShareButton>
                </div>
                <div className="col">
                  <LinkedinShareButton
                    quote="Show me the Google!"
                    url={props.pageUrl}
                  >
                    <SocialIcon src={linkedinIcon} />
                  </LinkedinShareButton>
                </div>
                <div className="col">
                  <FacebookShareButton
                    quote="Show me the Google!"
                    url={props.pageUrl}
                  >
                    <SocialIcon src={fbIcon} />
                  </FacebookShareButton>
                </div>
                <div className="col">
                  <TwitterShareButton
                    quote="Show me the Google!"
                    url={props.pageUrl}
                    style={{ marginRight: "40px" }}
                  >
                    <SocialIcon src={twitterIcon} />
                  </TwitterShareButton>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <CustomSlider {...sliderSettings}>
                    <SocialIcon
                      src={copyIcon}
                      onClick={() => {
                        navigator.clipboard.writeText(props.pageUrl);
                        PushAlert.success("Copied to clipboard");
                      }}
                    />

                    <WhatsappShareButton
                      quote="Show me the Google!"
                      url={props.pageUrl}
                    >
                      <SocialIcon src={whatsappIcon} />
                    </WhatsappShareButton>

                    <LinkedinShareButton
                      quote="Show me the Google!"
                      url={props.pageUrl}
                    >
                      <SocialIcon src={linkedinIcon} />
                    </LinkedinShareButton>

                    <FacebookShareButton
                      quote="Show me the Google!"
                      url={props.pageUrl}
                    >
                      <SocialIcon src={fbIcon} />
                    </FacebookShareButton>

                    <TwitterShareButton
                      quote="Show me the Google!"
                      url={props.pageUrl}
                      style={{ marginRight: "40px" }}
                    >
                      <SocialIcon src={twitterIcon} />
                    </TwitterShareButton>
                  </CustomSlider>
                </div>
              </>
            )}
          </SocialShareLinks>
        </ModalContainer>
      </CustomModal>
    </>
  );
}

export default SocialSharing;
