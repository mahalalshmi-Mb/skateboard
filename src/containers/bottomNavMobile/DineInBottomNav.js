import React, { Fragment, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import Util from "../../commons/util/util";
import Text from "../../components/atoms/Text";
import styled from "styled-components";
import { device } from "../../commons/util/helperFunctions";
import { getSessionStorage } from "../../util/storageUtil";
import menuOutlined from "../../assets/images/bottomNav/menu-outlined.svg";
import menuFilled from "../../assets/images/bottomNav/menu-filled.svg";
import orderOutlined from "../../assets/images/bottomNav/order-outlined.svg";
import orderFilled from "../../assets/images/bottomNav/order-filled.svg";
import payBillOutlined from "../../assets/images/bottomNav/payBill-outlined.svg";
import payBillFilled from "../../assets/images/bottomNav/payBill-filled.svg";
import useCustomNavigation from "../../hooks/useCustomNavigation";

function DineInBottomNav() {
  const { pathname } = useLocation();
  const history = useHistory();
  const { url } = useRouteMatch();
  const { pushHistory } = useCustomNavigation();

  const sessionData = getSessionStorage("dine-in");

  const [tabs] = useState([
    {
      id: "TAB01",
      tabName: "Menu",
      tabImage: menuOutlined,
      tabImageSelected: menuFilled,
      alt: "Menu",
      linkTo: `storefront/${sessionData?.storeId}`,
    },
    {
      id: "TAB02",
      tabName: "Orders",
      tabImage: orderOutlined,
      tabImageSelected: orderFilled,
      alt: "Orders",
      linkTo: "cart",
    },
    {
      id: "TAB03",
      tabName: "Pay Bill",
      tabImage: payBillOutlined,
      tabImageSelected: payBillFilled,
      alt: "Pay Bill",
      linkTo: "dine-in/payBill",
    },
  ]);

  const tabClick = (linkTo) => {
    let letsLinkTo = linkTo;

    pushHistory(`${url}${letsLinkTo}`);
  };

  const isItemSelected = (pathname, linkTo) => {
    return Util.getSlug(pathname) === Util.getSlug(linkTo);
  };

  return (
    <Wrapper>
      {tabs.map((tabItem, index) => (
        <Fragment key={index}>
          {!tabItem.hide && (
            <TabButton
              onClick={() => tabClick(tabItem.linkTo)}
              key={index}
              selected={isItemSelected(pathname, tabItem.linkTo)}
              numberOfTabs={tabs.length}
            >
              <TabImage>
                <img
                  src={
                    isItemSelected(pathname, tabItem.linkTo)
                      ? tabItem.tabImageSelected
                      : tabItem.tabImage
                  }
                  alt={tabItem.alt}
                  style={
                    tabItem.imageStyle ?? { height: "20px", width: "20px" }
                  }
                />
              </TabImage>
              <TabText selected={isItemSelected(pathname, tabItem.linkTo)}>
                <Text type="extra-bold">{tabItem.tabName}</Text>
              </TabText>
            </TabButton>
          )}
        </Fragment>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  padding-bottom: 0px;
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
  box-shadow: -4px -1px 27px 0px rgba(0, 0, 0, 0.1);
  height: 60px;
  display: flex;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 9999;

  @media ${device.laptop} {
    display: none;
  }
  @media screen (orientation: landscape) {
    display: flex;
  }
`;

const TabButton = styled.div`
  height: 100%;
  width: ${(props) => `calc(100% / ${props.numberOfTabs})`};

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex: 1 0 0;
  background: #fff;
`;
const TabImage = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: flex-end;
  justify-content: center;
`;
const TabText = styled.div`
  color: ${(props) => (props.selected ? "#04ADAA" : "#273135")};

  display: flex;
  align-items: flex-start;
  justify-content: center;

  font-size: 16px;
  font-weight: ${(props) => (props.selected ? 800 : 600)};
  line-height: normal;
`;

export default DineInBottomNav;
