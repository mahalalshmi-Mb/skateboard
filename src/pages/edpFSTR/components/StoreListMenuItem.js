import React from "react";
import Text from "../../../components/atoms/Text";
import styled from "styled-components";
import StoreListMenuFoodItem from "./molecules/StoreListMenuFoodItem";
import { device } from "../../../commons/util/helperFunctions";

const StoreListMenuItem = (props) => {
  return (
    <>
    {props?.number> 0 && (
      <HeaderWrapper number={props.number}>
        <Text type="bold">
          {props.categoryName} ({props.count})
        </Text>
      </HeaderWrapper>
    )}
      <StoreListMenuFoodItemWrapper>
        {props.items?.length > 0 &&
          props?.items?.map((item, index) => {
            return (
              <StoreListMenuFoodItem
                key={index}
                item={item}
                storeDetails={props.storeDetails}
                index={index}
                setSelectedItem={() => props.setSelectedItem(item._id, item)}
                setSelectedItemId={props.setSelectedItemId}
                setShowDetailModal={props.setShowDetailModal}
                setShowCustomisationModal={props.setShowCustomisationModal}
                setShowRepeatSelectionModal={props.setShowRepeatSelectionModal}
                setRecommendationModal={props.setRecommendationModal}
                setRecommendationList={props.setRecommendationList}
                setShowMultiStoreCheckModal={props?.setShowMultiStoreCheckModal}
                setMultiStoreData={props?.setMultiStoreData}
                lastItem={index === props?.items?.length - 1}
                ageVerificationReq={item?.ageVerificationRequired}
                setChangeRepeatSelectionItem={props?.setChangeRepeatSelectionItem}
              ></StoreListMenuFoodItem>
            );
          })}
      </StoreListMenuFoodItemWrapper>
    </>
  );
};

const StoreListMenuFoodItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 32px;
`;
const HeaderWrapper = styled.div`
  display: flex;
  padding: 8px 24px;
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  color: #273135;
  width: calc(100% + 48px);
  background-color: #e4e4e4;
  margin-left: -24px;

  @media ${device.laptop} {
    font-size: 20px;
    display: none;
  }
`;

export default StoreListMenuItem;
