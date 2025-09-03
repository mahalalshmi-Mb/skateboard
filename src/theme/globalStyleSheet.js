import styled, { createGlobalStyle } from "styled-components";
import { device } from "../commons/util/helperFunctions";
import { colors } from "./colors";

export const GlobalStyles = createGlobalStyle`
  :root {
    --body-primary: ${colors.primary};
    --body-primary-foreground: ${colors.primaryForeground};
    --body-primary-hover: ${colors.primaryHover};

    --body-secondary: ${colors.secondary};
    --body-secondary-foreground: ${colors.secondaryForeground};
    --body-secondary-hover: ${colors.secondaryHover};

    --body-tertiary: ${colors.tertiary};
    --body-tertiary-foreground: ${colors.tertiaryForeground};
    --body-tertiary-hover: ${colors.tertiaryHover};

    --background: ${colors.background};
    --foreground: ${colors.foreground};

    --input-primary: ${colors.input};
    --border-primary: ${colors.border};

    --text-action: ${colors.text.actionTextColor};

    --text-black200: ${colors.text.black200};
    --text-black300: ${colors.text.black300};
    --text-black800: ${colors.text.black800};
    --text-black900: ${colors.text.black900};

    --text-gray200: ${colors.text.gray200};
    --text-gray300: ${colors.text.gray300};
    --text-gray400: ${colors.text.gray400};
    --text-gray900: ${colors.text.gray900};

    --text-white900: ${colors.text.white900};

    --button-primarybackground: ${colors.button.primaryBackground};
    --button-primarytext: ${colors.button.primaryText};

    --page-background-primary: ${colors.pageBackground.primary};
    --page-background-secondary: ${colors.pageBackground.secondary};

    --primary-font: ${colors.font.primary};
    --font-secondary: ${colors.font.secondary};
    --font-fallback: ${colors.font.fallback};
  }

  p {
    margin:0;
    padding:0;
  }
`;

export const Button = styled.button`
  border: none;
  margin: 0;
  padding: 0;
  background-color: transparent;
`;

export const StyledButton = styled.button`
  border: none;
  background-color: transparent;
`;
export const UnorderedList = styled.ul`
  border: none;
  margin: 0;
  padding: 0;
`;

export const PrimaryButton = styled(StyledButton)`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${colors?.button?.primaryBackground};
  color: ${colors?.button?.primaryText};
  font-weight: bold;
  border-radius: 100px;
  cursor: pointer;
  font-weight: 800;
  font-size: 16px;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "")};

  @media ${device.laptop} {
    &:hover {
      opacity: 0.7;
    }
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background-color: ${colors.background};
  color: ${colors.primary};
  border: 1.7px solid ${colors.primary};
`;

export const TertiaryButton = styled(PrimaryButton)`
  background-color: ${colors.background};
  color: ${colors.primary};
`;

export const H1 = styled.h1`
  margin: 0;
  font-size: 36px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.secondary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 63px;
  }
`;

export const H2 = styled.h2`
  margin: 0;
  font-size: 28px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.secondary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 56px;
  }
`;

export const H3 = styled.h3`
  margin: 0;
  font-size: 24px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.secondary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 48px;
  }
`;

export const H4 = styled.h4`
  margin: 0;
  font-size: 22px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.secondary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 40px;
  }
`;

export const H5 = styled.h5`
  margin: 0;
  font-size: 20px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.secondary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 32px;
  }
`;

export const H6 = styled.h6`
  margin: 0;
  font-size: 18px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.secondary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 26px;
  }
`;

export const T1 = styled.p`
  margin: 0;
  font-size: 20px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.primary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 24px;
  }
`;

export const T2 = styled.p`
  margin: 0;
  font-size: 18px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.primary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 22px;
  }
`;

export const T3 = styled.p`
  margin: 0;
  font-size: 16px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.primary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 20px;
  }
`;

export const T4 = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.primary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 18px;
  }
`;

export const T5 = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.primary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;

export const B1 = styled.p`
  margin: 0;
  font-size: 10px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.primary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 14px;
  }
`;

export const B2 = styled.p`
  margin: 0;
  font-size: 8px;
  color: ${colors?.text?.black200};
  font-family: ${colors?.font?.primary}, ${colors?.font?.fallback};

  @media ${device.laptop} {
    font-size: 12px;
  }
`;

export const P = styled.p`
  margin: 0;
  font-family: ${colors?.font?.primary}, ${colors?.font?.fallback};
`;

export const GeneralPageWrapper = styled.section`
  background-color: #ffffff;
  padding: 0px 24px;

  @media ${device.tablet} {
    padding: 0px 48px;
  }

  @media ${device.laptop} {
    padding: 0px 72px;
  }

  @media ${device.laptopL} {
    padding: 0px 136px;
  }
  @media ${device.desktop} {
    padding: 0px 272px;
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  gap: ${({ isAdded }) => (isAdded ? "0px 16px" : "0px")};
  background-color: ${colors?.button?.primaryBackground};
  border: 2px solid ${colors?.primary};
  border-radius: 100px;
  cursor: pointer;
  font-size: 14px;
  color: ${colors?.button?.primaryText};
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  letter-spacing: 1px;

  @media ${device.laptop} {
    &:hover {
      background-color: ${colors?.button?.primaryBackground};
      opacity: 0.7;
    }
  }

  @media ${device.laptop} {
    font-size: 14px;
    text-transform: uppercase;
  }
`;

export const Image = styled.img`
  alt: ${(props) => props.alt || "default"};
`;

export const Bold = styled.b`
  font-family: ManropeBold;
`;

export const ExtraBold = styled.b`
  font-family: ManropeExtraBold;
`;

export const HorizontalDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #d9d9d9;
`;

export const Link = styled.a`
  &:link {
    color: ${({ color }) => color || "#273135"};
  }

  &:visited {
    color: ${({ color }) => color || "#273135"};
  }

  &:hover {
    color: ${({ color }) => color || "#273135"};
  }

  &:active {
    color: ${({ color }) => color || "#273135"};
  }
`;

export const SpacedOutRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const SVG = styled.svg``;
