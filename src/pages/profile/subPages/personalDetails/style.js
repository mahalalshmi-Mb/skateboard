import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";
import { colors } from "theme/colors";

export const PageWrapper = styled.section`
  width: 100%;
  background-color: #fff7ef;
  position: relative;
`;
export const BannerContainer = styled.div`
  width: 100%;
  height: 279px;
  padding: 24px 24px 0px 24px;
  position: relative;
  background-color: ${colors?.text?.black200};

  @media ${device.laptop} {
    padding: 24px 136px 0px 136px;
  }
`;
export const BannerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
export const GoBackContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  z-index: 9999;
  cursor: pointer;
`;
export const GoBackIcon = styled.img``;
export const GoBackText = styled.div`
  font-size: 12px;
  color: ${colors?.text?.white100};

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
export const UserDetailsContainer = styled.div`
  padding-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const UserProfileImageContainer = styled.div`
  width: 113px;
  height: 113px;
  border-radius: 56px;
`;
export const UserProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 56px;
  border: 0.85px solid #fff;
`;
export const UserDetailsWrapper = styled.div`
  width: 100%;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const UserNameContainer = styled.div`
  font-size: 24px;
  line-height: 32px;
  color: ${colors?.text?.white900};
`;
export const UserPhNoContainer = styled.div`
  padding-top: 4px;
  font-size: 14px;
  line-height: 19px;
  color: ${colors?.text?.white900};
  opacity: 0.8;
`;
export const FormContainer = styled.div`
  width: 100%;
  padding: 0px 24px;
  display: flex;
  align-items: center;
  margin-top: -20px;
  z-index: 1;
  position: relative;
  padding-bottom: 24px;

  @media ${device.laptop} {
    padding: 0px 136px 48px 136px;
  }
`;
export const FormWrapper = styled.div`
  width: 100%;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: #fff;
  padding: 24px 15px;
`;
export const FormTitle = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: ${colors?.text?.black200};
`;
export const FormUserInputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  gap: 24px 0px;
`;
export const FormRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media ${device.laptop} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;
export const TextField = styled.input`
  width: 100%;
  height: 54px;
  padding: 0px 16px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  font-size: 16px;
  font-family: ${colors?.font?.primary};

  @media ${device.laptop} {
    width: 100%;
  }
`;
export const DatePickerContainer = styled.div`
  width: 100%;

  @media ${device.laptop} {
    width: calc(100% - 12px);
  }
`;
export const InputWrapper = styled.div`
  width: 100%;

  @media ${device.laptop} {
    width: 50%;
  }
`;
export const ErrorText = styled.div`
  font-size: 14px;
  line-height: 19px;
  padding-top: 4px;
  color: ${colors?.state?.error};
`;
export const FooterContainer = styled.div`
  width: 100%;
  height: 68px;
  padding: 0px 75px;
  background-color: #fff;
  box-shadow: 0px 1px 12px 0px rgba(5, 32, 61, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
`;
