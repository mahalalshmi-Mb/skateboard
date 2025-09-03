import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import AirplaneIcon from "../../assets/images/airplaneIcon.svg";
import Text from "../atoms/Text";
import { device } from "../../commons/util/helperFunctions";
import { colors } from "theme/colors";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Function to handle scroll event
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 300) {
      // Adjust this value as needed
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Add scroll event listener when component mounts
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Fragment>
      {isVisible && (
        <Wrapper onClick={() => scrollToTop()}>
          <Icon src={AirplaneIcon} alt="back-to-top-icon" />
          <TextWrapper>
            <Text type="semi-bold">Back to top</Text>
          </TextWrapper>
        </Wrapper>
      )}
    </Fragment>
  );
}

const Wrapper = styled.div`
  display: inline-flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 8px;

  border-radius: 60px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);

  cursor: pointer;
`;

const Icon = styled.img`
  width: 20px;
  height: 17px;
`;
const TextWrapper = styled.div`
  color: ${colors?.text?.black200};
  font-size: 14px;
  font-style: normal;
  line-height: normal;

  @media ${device.laptopL} {
    font-size: 16px;
  }
`;

export default ScrollToTopButton;
