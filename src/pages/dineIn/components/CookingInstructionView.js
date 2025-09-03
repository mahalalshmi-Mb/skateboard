import React from "react";
import styled from "styled-components";
import CloseIcon from "../../../assets/images/close-icon.svg";
import Text from "../../../components/atoms/Text";
import { Form } from "react-bootstrap";
import { colors } from "theme/colors";

const CookingInstructionView = ({
  cookingInstruction = "",
  setCookingInstruction,
  setCookingInstructionModalOpen,
}) => {
  const handleChange = (inputValue) => {
    if (cookingInstruction.length <= 100) {
      if (inputValue.length <= 100) {
        setCookingInstruction(inputValue);
      } else {
        setCookingInstruction(inputValue.substring(0, 100));
      }
    }
  };

  return (
    <Wrapper>
      <HeaderWrapper>
        <HeaderTextWrapper>
          <Text type="bold">Cooking Instructions</Text>
        </HeaderTextWrapper>
        <HeaderCloseImage
          src={CloseIcon}
          onClick={() => {
            setCookingInstructionModalOpen(false);
          }}
        />
      </HeaderWrapper>
      <DescriptionTextWrapper>
        <Text type="semi-bold">
          Add your cooking instructions for the restaurants.
        </Text>
      </DescriptionTextWrapper>
      <Form.Control
        as="textarea"
        placeholder="Add your instructions"
        rows={3}
        value={cookingInstruction}
        onChange={({ currentTarget }) => {
          handleChange(currentTarget.value);
        }}
        style={{
          marginTop: "24px",
          height: "186px",
          color: colors?.text?.black200,
          fontFamily: colors?.font?.primary,
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: "130%",
          letterSpacing: "0.16px",
        }}
      />
      <InputCharacterLeftTextWrapper>
        <Text>{100 - cookingInstruction?.length}</Text>
      </InputCharacterLeftTextWrapper>
      <NoteWrapper>
        <Text type="bold">
          <span style={{ color: "#E97208" }}>Note: </span>
          <span>Your instructions will be taken care by the restaurants</span>
        </Text>
      </NoteWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 24px;
  background-color: #f4f4f5;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTextWrapper = styled.div`
  color: #273135;
  font-size: 21px;
  font-weight: 800;
  line-height: normal;
`;

const HeaderCloseImage = styled.img`
  width: 20px;
  height: 20px;
`;

const DescriptionTextWrapper = styled.div`
  color: #273135;
  font-size: 18px;
  font-weight: 600;
  line-height: 130%;
  letter-spacing: 0.18px;
  margin-top: 12px;
`;

const InputCharacterLeftTextWrapper = styled.div`
  color: #273135;
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  letter-spacing: 0.16px;
  margin-top: 6px;
  text-align: end;
`;

const NoteWrapper = styled.div`
  border-radius: 8px;
  background: rgba(255, 242, 202, 0.5);
  margin-top: 20px;

  color: #273135;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;

  padding: 12px;
`;

export default CookingInstructionView;
