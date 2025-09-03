import { useRef } from "react";
import styled from "styled-components";
import moment from "util/momentWrapper";
import {
  device,
  isDesktopDevice,
} from "../../../../../commons/util/helperFunctions";
import Text from "../../../../../components/atoms/Text";
import useCustomNavigation from "../../../../../hooks/useCustomNavigation";
import { colors } from "theme/colors";
import FilterCarousel from "pages/edpFSTR/components/molecules/FilterCarousel";

function OrderCard(props) {
  const { pushHistory } = useCustomNavigation();
  const itemListingRef = useRef();

  const handleViewOrder = () => {
    pushHistory(
      `/travellers/profile/myBookings/${props?.item?._id}/${props.orderType}`
    );
  };

  const getAllItems = () => {
    let allItems = [];
    props?.item?.shipping?.forEach((x) => {
      allItems = allItems.concat(x.items);
    });
    return allItems;
  };

  const getItemImage = (arr) => {
    const found = arr?.find(
      (x) =>
        (x?.platform?.toLowerCase() === "web" ||
          x?.platform?.toLowerCase() === "marketplace") &&
        (x.type?.toLowerCase() || x.imageType?.toLowerCase()) === "small" &&
        x?.isActive?.toLowerCase() === "y"
    );
    if (found) {
      return found.imageUrl || found.imageURL || "";
    } else {
      return "";
    }
  };

  const getItemDomain = () => {
    let allDomain = [];
    props?.item?.shipping?.forEach((x) => {
      if (x.partnerInfo?.domain || x.partnerInfo?.partnerName) {
        allDomain.push(x.partnerInfo?.domain || x.partnerInfo?.partnerName);
      }
    });
    let uniq = [...new Set(allDomain)];
    return uniq;
  };

  const getOrderStatusBgColor = (status) => {
    let color = "#DAFFE2";
    switch (status.toLowerCase()) {
      case "collected":
        color = "#DAFFE2";
        break;
      case "accepted":
        color = "#D4EDFE";
        break;
      case "delivered":
        color = "#DAFFE2";
        break;
      case "aborted":
        color = "#FFC3C3";
        break;
      case "cancelled":
        color = "#FFC3C3";
        break;
      default:
        return "#DAFFE2";
    }
    return color;
  };

  const imageStyles = {
    width: isDesktopDevice() ? "80px" : "50px",
    height: isDesktopDevice() ? "100px" : "63px",
    borderRadius: "8px",
    objectFit: "cover",
    gap: "8px",
  };

  return (
    <Wrapper>
      <CardHeaderWrapper>
        <OrderNumberContainer>
          <OrderNumberLabel>
            <Text type="semi-bold">ORDER NO:</Text>
          </OrderNumberLabel>
          <OrderNumberValue>
            <Text type="semi-bold">#{props?.item?._id?.slice(-5)}</Text>
          </OrderNumberValue>
        </OrderNumberContainer>
        <ItemStatusWrapper
          style={{
            backgroundColor: getOrderStatusBgColor(props?.item?.orderStatus),
          }}
        >
          <Text type="bold">{props?.item?.orderStatus}</Text>
        </ItemStatusWrapper>
      </CardHeaderWrapper>
      <CardBodyWrapper>
        <OrderDateWrapper>
          <Text>
            Order placed on :{" "}
            <BoldText>{moment(props?.item?.createdAt).format("ll")}</BoldText>
          </Text>
        </OrderDateWrapper>
        <ItemListingWrapper>
          <ItemListingContainer ref={itemListingRef} className="item-listing">
            <FilterCarousel
              data={getAllItems()}
              isOrderCard={true}
              getItemImage={getItemImage}
              isOverflowItems={
                isDesktopDevice() && getAllItems().length > 10 ? true : false
              }
              imageStyles={imageStyles}
            />
          </ItemListingContainer>
        </ItemListingWrapper>
        <ItemDomainWrapper>
          <Text>
            {getItemDomain()?.map((domainItem, domainIndex) => {
              return `${domainItem}${
                domainIndex !== getItemDomain()?.length - 1 ? ", " : ""
              }`;
            })}
          </Text>
        </ItemDomainWrapper>
      </CardBodyWrapper>
      <CardFooterWrapper onClick={() => handleViewOrder()}>
        <Text type="bold" style={{ cursor: "pointer" }}>
          View Order
        </Text>
      </CardFooterWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  border: 0.5px solid #dedddd;
  border-radius: 8px;
`;
const CardHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 0.5px solid #dedddd;
  border-radius: 8px;

  @media ${device.laptop} {
    padding: 16px 32px;
  }
`;
const OrderNumberContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media ${device.laptop} {
    flex-direction: row;
  }
`;
const OrderNumberLabel = styled.div`
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1em;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const OrderNumberValue = styled.div`
  font-size: 18px;
  line-height: 22px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 20px;
  }
`;
const ItemStatusWrapper = styled.div`
  padding: 5px 10px;
  border-radius: 2px;
  background-color: #caecd6;

  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.1em;
  color: ${colors?.text?.black200};
  text-transform: uppercase;
`;
const CardBodyWrapper = styled.div`
  width: 100%;
  padding: 12px 16px;
  border-bottom: 0.5px solid #dedddd;

  @media ${device.laptop} {
    padding: 16px 32px 0px 32px;
    border-bottom: none;
  }
`;
const OrderDateWrapper = styled.div`
  font-size: 16px;
  line-height: 19px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 18px;
  }
`;
const BoldText = styled.span`
  font-family: "ManropeBold";
`;
const ItemListingContainer = styled.div`
  width: calc(100% - 58px);
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
`;
const ItemListingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 16px;
  gap: 8px;
`;
const ItemImage = styled.img`
  width: 50px;
  height: 63px;
  border-radius: 8px;
  object-fit: cover;

  @media ${device.laptop} {
    width: 80px;
    height: 100px;
  }
`;
const MoreItemImage = styled.div`
  width: 50px;
  min-width: 50px;
  height: 63px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eaeaea;
  border-radius: 8px;
  padding: 0px 4px;

  @media ${device.laptop} {
    width: 80px;
    height: 100px;
  }
`;
const MoreItemText = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: ${colors?.text?.black200};
  text-align: center;

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const ItemDomainWrapper = styled.div`
  font-size: 16px;
  line-height: 19px;
  color: ${colors?.text?.black200};
  padding-top: 16px;

  @media ${device.laptop} {
    font-size: 18px;
  }
`;
const CardFooterWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0px;

  font-size: 18px;
  line-height: 22px;
  color: ${colors?.text?.actionTextColor};

  &:hover {
    text-decoration: underline;
  }

  @media ${device.laptop} {
    justify-content: flex-end;
    padding: 0px 32px 32px 0px;
  }
`;

export default OrderCard;
