import { device } from "commons/util/helperFunctions";
import styled from "styled-components";
import { colors } from "theme/colors";

export const Wrapper = styled.li`
  display: flex;
  flex-direction: column;
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s;
  cursor: pointer;

  @media ${device.laptop} {
    &:hover {
      background-color: ${colors?.primaryHover};
    }
  }
`;

export const HeaderContentIcon = styled.img`
  width: 42px;
  height: 42px;
`;

export const HeaderMenuContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ContentWrapper = styled.ul`
  padding: 0;
  margin: 0;
  margin-top: 16px;
  margin-left: 16px;
`;

export const ImageWrapper = styled.div``;

export const SubMenuWrapper = styled.li`
  margin-bottom: 16px;
  list-style: none;
`;
