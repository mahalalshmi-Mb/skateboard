import styled from "styled-components";
import { device } from "../../commons/util/helperFunctions";
import { colors } from "theme/colors";

export const PageWrapper = styled.section`
  width: 100%;
  padding-bottom: 24px;
`;
export const BannerWrapper = styled.div`
  width: 100%;
  height: 225px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  position: relative;
  background-color: ${colors?.text?.black200};
  display: flex;
`;
export const UserDetailsBox = styled.div`
  width: fit-content;
  height: fit-content;
  min-width: 212px;
  max-width: 342px;
  padding: 14px 34px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0px 10px 30px 0px rgba(31, 31, 31, 0.08);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 100px auto;

  @media ${device.laptop} {
    left: 40%;
  }
`;
export const UserProfileImageContainer = styled.div`
  width: 69px;
  height: 69px;
  border-radius: 35px;
`;
export const UserProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 35px;
`;
export const UserDetailsContainer = styled.div`
  width: 100%;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const UserName = styled.div`
  font-size: 26px;
  line-height: 32px;
  color: ${colors?.text?.black200};
`;
export const UserPhNo = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${colors?.text?.black200};
  margin-top: 4px;
`;
export const UserEditWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 12px;
  cursor: pointer;
`;
export const EditIcon = styled.img`
  width: 12px;
  height: 12px;
`;
export const UserEdit = styled.div`
  font-size: 18px;
  line-height: 22px;
  color: ${colors?.text?.actionTextColor};
`;
export const ContentContainer = styled.div`
  width: 100%;
  padding: ${({ editProfileHidden }) =>
    editProfileHidden ? "12px 24px 24px 24px" : "100px 24px 24px 24px"};

  @media ${device.laptop} {
    padding: ${({ editProfileHidden }) =>
      editProfileHidden ? "12px 136px 24px 136px" : "100px 136px 24px 136px"};
  }
`;
export const MenuContainer = styled.div`
  width: 100%;
  margin-top: 24px;
`;
export const MenuTitle = styled.div`
  font-size: 18px;
  line-height: 22px;
  color: ${colors?.text?.black200};
`;
export const MenuItemsContainer = styled.div`
  width: 100%;
  margin-top: 12px;
`;
export const MenuItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0px;
  cursor: ${({ isShowEnrollEmployee }) =>
    isShowEnrollEmployee ? "auto" : "pointer"};
  gap: ${({ isShowEnrollEmployee }) =>
    isShowEnrollEmployee ? "12px" : "auto"};
`;
export const MenuItemDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors?.text?.black200};
  opacity: 0.1;
`;
export const MenuNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
export const MenuIcon = styled.img`
  width: 24px;
  height: 24px;
`;
export const MenuName = styled.div`
  font-size: 18px;
  line-height: 20px;
  color: ${({ isShowEnrollEmployee }) =>
    isShowEnrollEmployee
      ? `${colors?.text?.gray200}`
      : `${colors?.text?.black200}`};
  opacity: ${({ isShowEnrollEmployee }) => (isShowEnrollEmployee ? 0.8 : 1)};
`;
export const MenuLinkAwayIcon = styled.img`
  width: 20px;
  height: 20px;
`;
export const EmployeeLoginSuccessIcon = styled.img`
  width: 14px;
  height: 14px;
  margin-left: 8px;
`;
export const PulseLogoContainer = styled.div`
  width: 100%;
  margin-top: 48px;
`;
export const PulseLogo = styled.img``;
export const EmployeeUnRegister = styled.div`
  font-size: 14px;
  color: ${colors?.state?.error};
  cursor: pointer;

  @media ${device.laptop} {
  &:hover {
    text-decoration: underline;
}}
`;
