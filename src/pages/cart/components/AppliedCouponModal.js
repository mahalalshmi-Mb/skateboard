import { useConfig } from "context/configContext";
import { useRef } from "react";
import styled from "styled-components";
import Text from "../../../components/atoms/Text";
import useOutsideClick from "../../../components/atoms/useOutsideClick";
import Cross from "../../../components/molecules/BottomDrawer/assets/cross.svg";
import CustomModal from "../../../containers/customModal/customModal";
import {
  getSessionStorage,
  removeSessionStorage,
  setSessionStorage,
} from "../../../util/storageUtil";
import { formatPrice, removeAppliedCoupon } from "commons/util/helperFunctions";
import { colors } from "theme/colors";

function AppliedCouponModal(props) {
  const modalRef = useRef();

  useOutsideClick(modalRef, () => {
    handleClose();
  });

  const handleClose = () => {
    if (props?.couponApplied) {
      let obj = getSessionStorage("appliedCoupon");
      if (obj.showAppliedCouponModal) {
        obj.showAppliedCouponModal = false;
      }
      setSessionStorage("appliedCoupon", obj);
    } else {
      props?.setAppliedCouponObj({});
      props?.setCouponCode("");
      removeSessionStorage("appliedCoupon");
      removeAppliedCoupon();
    }
    document.body.style.overflow = "auto";
    props.setIsModalOpen(false);
  };

  return (
    <CustomModal
      ref={modalRef}
      isOpen={props.isModalOpen}
      boxStyle={{ borderRadius: "8px" }}
    >
      <Wrapper>
        <CloseIconContainer>
          <CloseIcon src={Cross} onClick={() => handleClose()} />
        </CloseIconContainer>
        {props?.couponApplied && (
          <TitleContainer>
            <Text type="bold">Coupon Applied</Text>
          </TitleContainer>
        )}
        <CouponPrice>
          {props.couponSavings ? (
            <Text type="bold">{formatPrice(props.couponSavings)}</Text>
          ) : (
            <Text type="bold">{props.couponName}</Text>
          )}
        </CouponPrice>
        {!props?.couponApplied && (
          <CouponSubTitle>
            <Text type="semi-bold">{props?.couponMessage || ""}</Text>
          </CouponSubTitle>
        )}
      </Wrapper>
    </CustomModal>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
  position: relative;
  background-color: #fff;
`;
const CloseIconContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
`;
const CloseIcon = styled.img``;
const TitleContainer = styled.div`
  color: #273135;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
`;
const CouponPrice = styled.div`
  color: ${colors?.text?.actionTextColor};
  text-align: center;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 5px;
`;
const CouponSubTitle = styled.div`
  color: ${colors?.text?.black200};
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  opacity: 0.5;
`;

export default AppliedCouponModal;
