import { formatPrice, isMobileDevice } from "commons/util/helperFunctions";
import Text from "components/atoms/Text";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { colors } from "theme/colors";
import { SpacedOutRow } from "theme/globalStyleSheet";
import ChevronDown from "../../../assets/images/arrows/chevron_down.svg";
import InfoIcon from "../../../assets/infoIcon.svg";

function PriceSummary(props) {
  const tooltipRef = useRef(null);
  const [showTaxSummary, setShowTaxSummary] = useState(false);
  const [showOtherChargesSummary, setShowOtherChargesSummary] = useState({});
  const [showTaxBreakup, setShowTaxBreakup] = useState(false);
  const [isShowEWB, setIsShowEWB] = useState(false);

  useEffect(() => {
    initiateOtherChargesSummary();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsShowEWB(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initiateOtherChargesSummary = () => {
    let obj = {};
    if (props?.charges?.length > 0) {
      props?.charges?.forEach((x) => {
        obj[x?.name] = true;
      });
    }
    setShowOtherChargesSummary(obj);
  };

  const handleOtherCharges = (name) => {
    let obj = JSON.parse(JSON.stringify(showOtherChargesSummary));
    if (obj[name] === true) {
      obj[name] = false;
    } else {
      obj[name] = true;
    }
    setShowOtherChargesSummary(obj);
  };

  const desktopHandlers = {
    onMouseEnter: () => setIsShowEWB(true),
    onMouseLeave: () => setIsShowEWB(false),
  };

  return (
    <Wrapper>
      <SectionHeader>
        <HeaderWrapper>
          <Text type="bold">Bill Details</Text>
        </HeaderWrapper>
      </SectionHeader>
      <SectionBody>
        {props?.subtotal > 0 && (
          <SpacedOutRow>
            <Label>
              <Text>Item Total Amount</Text>
            </Label>
            <Value>
              <Text type="bold">{formatPrice(props?.subtotal)}</Text>
            </Value>
          </SpacedOutRow>
        )}
        {props?.discount > 0 && (
          <SpacedOutRow>
            <Label>
              <Text>Discount</Text>
            </Label>
            <Value>
              <Text type="bold" style={{ color: "#71C255" }}>
                {formatPrice(props?.discount)}
              </Text>
            </Value>
          </SpacedOutRow>
        )}
        {props?.delivery > 0 && (
          <SpacedOutRow>
            <Label>
              <Text>Delivery</Text>
            </Label>
            <Value>
              <Text type="bold">{formatPrice(props?.delivery)}</Text>
            </Value>
          </SpacedOutRow>
        )}
        {props?.packagingCharges > 0 && (
          <SpacedOutRow>
            <Label>
              <Text>Packaging Charges</Text>
            </Label>
            <Value>
              <Text type="bold">{formatPrice(props?.packagingCharges)}</Text>
            </Value>
          </SpacedOutRow>
        )}
        {props?.tip > 0 && (
          <SpacedOutRow>
            <Label>
              <Text>Tip</Text>
            </Label>
            <Value>
              <Text type="bold">{formatPrice(props?.tip)}</Text>
            </Value>
          </SpacedOutRow>
        )}
        {props?.charges?.length > 0 &&
          props?.charges?.map(
            (item, index) =>
              (props?.isWaiveOff &&
              item?.summary?.waivedOffTotal !== null &&
              item?.summary?.waivedOffTotal !== undefined
                ? item?.summary?.waivedOffTotal > 0
                : item?.summary?.total > 0) && (
                <>
                  <SpacedOutRow>
                    <LabelWrapper
                      key={index}
                      onClick={() => handleOtherCharges(item?.name)}
                    >
                      <Label>
                        <Text>{item?.name}</Text>
                      </Label>
                      <ArrowIcon
                        src={ChevronDown}
                        expanded={showOtherChargesSummary[item?.name] === true}
                      />
                    </LabelWrapper>
                    <Value>
                      <Text type="bold">
                        {formatPrice(
                          props?.isWaiveOff &&
                            item?.summary?.waivedOffTotal !== null &&
                            item?.summary?.waivedOffTotal !== undefined
                            ? item?.summary?.waivedOffTotal
                            : item?.summary?.total
                        )}
                      </Text>
                    </Value>
                  </SpacedOutRow>
                  {showOtherChargesSummary[item?.name] === true &&
                    item?.breakup?.length > 0 &&
                    item?.breakup?.map((subItem, subIndex) =>
                      (
                        props?.isWaiveOff &&
                        subItem?.waivedOffTotal !== null &&
                        subItem?.waivedOffTotal !== undefined
                          ? subItem?.waivedOffTotal > 0
                          : subItem?.total > 0
                      ) ? (
                        <OtherChargesSubItem key={subIndex}>
                          <ChargeWrapper>
                            <Label>
                              <Text>{subItem?.title}</Text>
                            </Label>
                            {subItem?.code === "EWB" && (
                              <IconWithTooltipWrapper
                                ref={tooltipRef}
                                {...(!isMobileDevice() && desktopHandlers)}
                              >
                                <InfoEmployeeIcon
                                  src={InfoIcon}
                                  onClick={() => setIsShowEWB((prev) => !prev)}
                                />
                                {isShowEWB && (
                                  <TooltipBox>
                                    A 3% Employee Wage and Benefits Fee will be
                                    applied to all guest checks. This surcharge
                                    is not a gratuity payable to employees.
                                  </TooltipBox>
                                )}
                              </IconWithTooltipWrapper>
                            )}
                          </ChargeWrapper>
                          <Value>
                            <Text>
                              {formatPrice(
                                props?.isWaiveOff &&
                                  subItem?.waivedOffTotal !== null &&
                                  subItem?.waivedOffTotal !== undefined
                                  ? subItem?.waivedOffTotal
                                  : subItem?.total
                              )}
                            </Text>
                          </Value>
                        </OtherChargesSubItem>
                      ) : null
                    )}
                </>
              )
          )}
        {(props?.discountedTax !== null && props?.discountedTax !== undefined
          ? props?.discountedTax > 0
          : props?.taxes > 0) && (
          <SpacedOutRow>
            <LabelWrapper
              onClick={() => setShowTaxSummary(!showTaxSummary)}
              style={{ cursor: showTaxBreakup ? "pointer" : "auto" }}
            >
              <Label>
                <Text>Taxes</Text>
              </Label>
              {showTaxBreakup && props?.taxBreakup?.length > 0 && (
                <ArrowIcon src={ChevronDown} expanded={showTaxSummary} />
              )}
            </LabelWrapper>
            <Value>
              <Text type="bold">
                {formatPrice(
                  props?.discountedTax !== null &&
                    props?.discountedTax !== undefined &&
                    props?.discountedTax !== 0
                    ? props?.discountedTax
                    : props?.taxes
                )}
              </Text>
            </Value>
          </SpacedOutRow>
        )}
        {showTaxBreakup &&
          showTaxSummary &&
          props?.taxBreakup?.length > 0 &&
          props?.taxBreakup.map((taxItem, taxIndex) =>
            taxItem.value > 0 ? (
              <SpacedOutRow key={taxIndex}>
                <Label>
                  <Text>{`${taxItem.key} (${taxItem.rate}%)`}</Text>
                </Label>
                <Value>
                  <Text>{formatPrice(taxItem.value)}</Text>
                </Value>
              </SpacedOutRow>
            ) : null
          )}
      </SectionBody>
      <SectionFooter>
        <SpacedOutRow>
          <Label>
            <Text type="bold">Grand Total</Text>
          </Label>
          <Value>
            <Text type="bold">{formatPrice(props?.total)}</Text>
          </Value>
        </SpacedOutRow>
      </SectionFooter>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  height: fit-content;
  border-radius: 12px;
  background-color: ${colors?.pageBackground?.primary};
`;
const SectionHeader = styled.div`
  font-size: 14px;
  color: ${colors?.text?.black200};
  border-radius: 12px 12px 0px 0px;
  background-color: #dcdcdc;
`;
const HeaderWrapper = styled.div`
  padding: 12px 24px;
`;
const SectionBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px 24px;
  gap: 12px 0px;
  border-bottom: 1px dotted #dcdcdc;
`;
const Label = styled.div`
  font-size: 12px;
  color: ${colors?.text?.black200};
`;
const Value = styled.div`
  font-size: 12px;
  color: ${colors?.text?.black200};
`;
const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0px 3px;
  cursor: pointer;
`;
const ArrowIcon = styled.img`
  transform: ${({ expanded }) =>
    !expanded ? "rotate(0deg)" : "rotate(-180deg)"};
`;
const SectionFooter = styled.div`
  margin-top: 12px;
  padding: 0px 24px 16px 24px;
`;
const OtherChargesSubItem = styled(SpacedOutRow)`
  padding-left: 8px;
`;
const ChargeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0px 8px;
`;
const InfoEmployeeIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;
const TooltipBox = styled.div`
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 12px;
  color: #333;
  width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
  border-radius: 4px;
  white-space: normal;
  text-align: left;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #ccc transparent transparent transparent;
  }

  &::before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
  }
`;
const IconWithTooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export default PriceSummary;
