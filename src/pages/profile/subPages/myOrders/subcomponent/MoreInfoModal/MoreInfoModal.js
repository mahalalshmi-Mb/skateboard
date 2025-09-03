import React, { useRef } from "react";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
import takeMeThereTextIcon from "../../../../../../assets/images/takemethere.svg";
import Util from "../../../../../../commons/util/util";
import BottomDrawer from "../../../../../../components/molecules/BottomDrawer/BottomDrawer";
import { Image } from "../../../../../../theme/globalStyleSheet";

function MoreInfoModal(props) {
  const sheetRef = useRef();

  const closeModal = (e) => {
    e.stopPropagation();
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
  };

  return (
    <BottomDrawer
      sheetRef={sheetRef}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      style={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "500px",
      }}
      snapPoints={[1, 0]}
      initialSnap={0}
      disableDrag
      hideCloseIcon={false}
      handleClose={closeModal}
      title={props.data.header || ""}
    >
      <ModalWrapper>
        {Util.isWebView() && (
          <TakeMeThere
            src={takeMeThereTextIcon}
            alt={"take-me-there"}
            onClick={(e) => props.handleTakeMeThereClick(e)}
          />
        )}
        <HtmlWrapper>
          {props.data.html && ReactHtmlParser(props.data?.html)}
        </HtmlWrapper>
      </ModalWrapper>
    </BottomDrawer>
  );
}

const ModalWrapper = styled.div`
  width: 100%;
  padding-bottom: 24px;
  margin-top: 20px;
`;

const TakeMeThere = styled(Image)`
  padding: 0px 24px;
`;

const HtmlWrapper = styled.div`
  padding: 0px 24px;
`;

export default MoreInfoModal;
