import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Text from "components/atoms/Text";
import { colors } from "theme/colors";
import Input from "components/organisms/QuickSignInDrawer/SubComponents/CustomInput";
import { device, isDesktopDevice } from "commons/util/helperFunctions";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Util from "commons/util/util";
import ButtonWithLoading from "components/molecules/ButtonWithLoading";

const HelpDeskForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    if (email) {
      setIsValidEmail(Util.isEmailValid(email));
    }
  }, [email]);

  const submitHandler = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setIsValidEmail(false);
    setOrderNo("");
    setDetail("");
  };

  return (
    <Wrapper>
      <HeaderSection>
        <Title>
          <Text type="semi-bold">Guest Help Form</Text>
        </Title>
        <SubTitle style={{ marginTop: "18px" }}>
          <Text type="medium">Guest Contact Information</Text>
        </SubTitle>
        <HorzDivider />
      </HeaderSection>
      <GuestContactWrapper>
        <RowContainer>
          <ColumnContainer>
            <Label>
              <Text>First Name*</Text>
            </Label>
            <Input
              style={{
                height: "54px",
                borderRadius: "8px",
                paddingLeft: "16px",
                fontSize: "14px",
                fontWeight: "300",
                fontFamily: colors?.font?.primary,
                backgroundColor: colors?.text?.gray600,
                border: `1px solid ${colors?.text?.gray600}`,
              }}
              placeholder="First Name"
              autoComplete="on"
              value={firstName}
              onChange={(e) => setFirstName(e?.target?.value)}
            />
          </ColumnContainer>
          <ColumnContainer>
            <Label>
              <Text>Last Name</Text>
            </Label>
            <Input
              style={{
                height: "54px",
                borderRadius: "8px",
                paddingLeft: "16px",
                fontSize: "14px",
                fontWeight: "300",
                fontFamily: colors?.font?.primary,
                backgroundColor: colors?.text?.gray600,
                border: `1px solid ${colors?.text?.gray600}`,
              }}
              placeholder="Last Name"
              autoComplete="on"
              value={lastName}
              onChange={(e) => setLastName(e?.target?.value)}
            />
          </ColumnContainer>
        </RowContainer>
        <RowContainer>
          <ColumnContainer>
            <EmailContainer
              style={{ width: isDesktopDevice() ? "50%" : "100%" }}
            >
              <Label>
                <Text>Email*</Text>
              </Label>
              <Input
                style={{
                  height: "54px",
                  borderRadius: "8px",
                  paddingLeft: "16px",
                  fontSize: "14px",
                  fontWeight: "300",
                  fontFamily: colors?.font?.primary,
                  backgroundColor: colors?.text?.gray600,
                  border: `1px solid ${colors?.text?.gray600}`,
                }}
                placeholder="Email"
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
              />
            </EmailContainer>
          </ColumnContainer>
        </RowContainer>
      </GuestContactWrapper>
      <OrderDetailHeader>
        <SubTitle>
          <Text type="medium">Order Details</Text>
        </SubTitle>
        <HorzDivider />
      </OrderDetailHeader>
      <OrderDetailWrapper>
        <RowContainer>
          <ColumnContainer>
            <Label>
              <Text>Order No *</Text>
            </Label>
            <Input
              style={{
                height: "54px",
                borderRadius: "8px",
                paddingLeft: "16px",
                fontSize: "14px",
                fontWeight: "300",
                fontFamily: colors?.font?.primary,
                backgroundColor: colors?.text?.gray600,
                border: `1px solid ${colors?.text?.gray600}`,
              }}
              placeholder="Order No"
              autoComplete="on"
              value={orderNo}
              onChange={(e) => setOrderNo(e?.target?.value)}
            />
          </ColumnContainer>
        </RowContainer>
        <RowContainer>
          <ColumnContainer>
            <Label>
              <Text>Additional Details*</Text>
            </Label>
            <TextareaAutosize
              placeholder="Additional Details"
              minRows={6}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 300,
                fontFamily: colors?.font?.primary,
                backgroundColor: colors?.text?.gray600,
                padding: "16px",
                boxSizing: "border-box",
              }}
            />
          </ColumnContainer>
        </RowContainer>
      </OrderDetailWrapper>
      <Text>
        Please add further details on your experience so our team can make it
        right.
      </Text>
      <ButtonWithLoading
        disabled={
          firstName === "" ||
          email === "" ||
          !isValidEmail ||
          orderNo === "" ||
          detail === ""
        }
        style={{
          width: isDesktopDevice() ? "100px" : "100%",
          marginTop: "24px",
        }}
        onClick={() => submitHandler()}
      >
        <ButtonLabel>
          <Text type="bold">Submit</Text>
        </ButtonLabel>
      </ButtonWithLoading>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 24px;

  @media ${device.laptop} {
    padding: 24px 180px;
  }
`;
const HeaderSection = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;

  @media ${device.laptop} {
    gap: 18px;
  }
`;
const Title = styled.div`
  color: ${colors?.text?.black800};
  font-size: 24px;
  line-height: 1.3;

  @media ${device.laptop} {
    font-size: 32px;
  }
`;

const SubTitle = styled.div`
  color: ${colors?.text?.black800};
  font-size: 18px;
  line-height: 1.3;

  @media ${device.laptop} {
    font-size: 28px;
  }
`;

const HorzDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors?.border};
`;

const Label = styled.div`
  font-size: 14px;
  color: ${colors?.text?.black800};
  padding-bottom: 12px;
`;

const GuestContactWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  scrollbar-width: none;
  padding-top: 24px;
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;

  @media ${device.laptop} {
    flex-wrap: wrap;
    flex-direction: row;
  }
`;
const ColumnContainer = styled.div`
  flex: 1;
  min-width: fit-content;

  @media ${device.tablet} {
    min-width: 100%;
  }

  @media ${device.laptop} {
    min-width: fit-content;
  }
`;
const EmailContainer = styled.div`
  display: inherit;
`;

const OrderDetailHeader = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;

  @media ${device.laptop} {
    gap: 18px;
  }
`;
const OrderDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  scrollbar-width: none;
  padding-top: 24px;
`;
const ButtonLabel = styled.div`
  font-size: 14px;
  color: ${colors?.button?.primaryText};
  text-transform: uppercase;
`;
export default HelpDeskForm;
