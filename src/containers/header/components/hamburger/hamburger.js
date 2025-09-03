import { Modal } from "react-bootstrap";
import {
  Body,
  CloseIcon,
  CloseIconContainer,
  HamburgerWrapper,
  HeaderText,
  HeaderWrapper,
  MenuItemsWrapper,
} from "./style";
import Text from "../../../../components/atoms/Text";
import MenuItem from "./components/menuItem/MenuItem";
import "./style.css";
import closeIcon from "../../../../assets/images/header/hamburger/close.svg";

const Hamburger = (props) => {
  return (
    <Modal
      className="hamburger-modal"
      show={props.isOpen}
      onShow={props.onShow}
      onHide={props.onHide}
      onExited={props.onExited}
      onEscapeKeyDown={() => props.setIsOpen(false)}
      fullscreen={true}
    >
      <Modal.Body
        bsPrefix={"header-modal-body"}
        style={{
          backgroundColor: "#EFEFEF",
        }}
      >
        <HamburgerWrapper>
          <Body>
            <HeaderWrapper>
              <HeaderText>
                <Text type="bold" variant="heading">
                  Menu
                </Text>
              </HeaderText>
              <CloseIconContainer onClick={() => props?.setIsOpen(false)}>
                <CloseIcon src={closeIcon} alt="close" />
              </CloseIconContainer>
            </HeaderWrapper>
            <MenuItemsWrapper>
              {props.displayData &&
                props.displayData.menus.map((menuItem) => (
                  <MenuItem
                    {...props}
                    key={menuItem._id}
                    data={menuItem}
                    bgColor={props.displayData?.bgcolor}
                    activeFontColor={props.displayData?.fontActive}
                    inactiveFontColor={props.displayData?.fontInactive}
                  />
                ))}
            </MenuItemsWrapper>
          </Body>
        </HamburgerWrapper>
      </Modal.Body>
    </Modal>
  );
};

export default Hamburger;
