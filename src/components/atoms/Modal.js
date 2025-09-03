import React from "react";
import { Modal } from "react-bootstrap";

export default function CustomModal(props) {
  React.useEffect(() => {
    window.onpopstate = (e) => {
      props.onExited();
    };
  });

  return (
    <Modal
      show={props.isOpen}
      onShow={props.onShow}
      onHide={props.onHide}
      onExited={props.onExited}
      fullscreen={props.fullscreen}
      className={props.className}
    >
      {props.children}
    </Modal>
  );
}
