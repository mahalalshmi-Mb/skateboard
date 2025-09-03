import parse from "html-react-parser";
import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import CustomModal from "components/atoms/Modal";
import Text from "components/atoms/Text";
import { NavContext } from "context/navContext";
import { Content, Title, Wrapper } from "./style";

export default function TermsModal(props) {
  const useNav = useContext(NavContext);

  const handleOnHide = () => {
    props.setIsOpen(false);
    if (props?.footerOnly) {
      useNav.showAllNavs();
      useNav.hideFooterNavs();
    }
  };

  const doingNothing = () => {
    console.log();
  };
  return (
    <CustomModal
      {...props}
      fullscreen
      onShow={useNav.hideAllNavs}
      onHide={handleOnHide}
      onExited={props?.footerOnly ? doingNothing : useNav.showAllNavs}
      className="rewards-terms-modal"
    >
      <Modal.Header
        style={{
          fontStyle: "normal",
          fontSize: "21px",
          color: "#273135",
        }}
        closeButton
      ></Modal.Header>
      <Wrapper>
        <Title>
          <Text type="bold">
            <u>Terms & Conditions</u>
          </Text>
        </Title>
        <div style={{ fontSize: "18px" }}></div>
        <Content>
          <Text>{props.html && parse(props.html)}</Text>
        </Content>
      </Wrapper>
    </CustomModal>
  );
}
