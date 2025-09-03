import styled from "styled-components";
import Text from "./Text";

export const ButtonWithImage = ({
  image,
  text,
  textStyle,
  imageStyle,
  type,
  onClick,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        zIndex: 999,
      }}
      onClick={onClick}
    >
      <Image
        src={image}
        style={{
          ...imageStyle,
        }}
      />
      <Text
        type={type}
        style={{
          ...textStyle,
        }}
      >
        {text}
      </Text>
    </div>
  );
};

const Image = styled.img``;
