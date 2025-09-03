import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React from "react";
import "./customModalStyle.css";

const CustomModal = (props) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 750,
    maxWidth: "90%",
    overflow: "auto",
    backgroundColor: "#fff",
    borderRadius: 5,
    maxHeight: 600,
    ...props.boxStyle,
  };

  return (
    <Modal
      open={props.isOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={props.modalStyle || {}}
    >
      <Box sx={style}>{props.children}</Box>
    </Modal>
  );
};

export default CustomModal;
