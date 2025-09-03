import React from "react";

const PrimaryButton = (props) => {
  return (
    <div
      className={`primary-button ${props.className}`}
      style={{
        ...{
          height: 45,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "170px",
          backgroundColor: "#78b2ab",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "5px",
          cursor: "pointer",
        },
        ...props.style,
      }}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

export default PrimaryButton;
