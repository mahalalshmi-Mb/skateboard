import React from "react";
import styled from "styled-components";
import Text from "../../../components/atoms/Text";

const DineInHeader = ({ tableNumber, shopBrandImageUrl, storeName }) => {
  return (
    <DineInMainHeaderWrapper>
      <StoreDetailWrapper>
        <StoreImage src={shopBrandImageUrl} />
        <StoreNameAndTableWrapper>
          <StoreNameWrapper>
            <Text type="bold">{storeName}</Text>
          </StoreNameWrapper>
          <TableNumberWrapper>
            <Text type="bold">Table No. {tableNumber}</Text>
          </TableNumberWrapper>
        </StoreNameAndTableWrapper>
      </StoreDetailWrapper>
      <UserDetailWrapper>
        <HostTextWrapper>
          <Text type="semi-bold">Host</Text>
        </HostTextWrapper>
        <UserNameWrapper>
          <Text type="semi-bold">
            {JSON.parse(localStorage.getItem("userData"))?.data?.fullName}
          </Text>
        </UserNameWrapper>
      </UserDetailWrapper>
    </DineInMainHeaderWrapper>
  );
};

const DineInMainHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px 8px 24px;
  background: #fff;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 9999;
  box-shadow: -4px -1px 27px 0px rgba(0, 0, 0, 0.1);
`;

const StoreDetailWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const StoreImage = styled.img`
  width: 40px;
  height: 40px;
`;

const StoreNameAndTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StoreNameWrapper = styled.div`
  color: #273135;
  font-size: 10px;
  line-height: normal;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.5;
`;

const TableNumberWrapper = styled.div`
  color: #273135;
  font-size: 16px;
  line-height: normal;
`;

const UserDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
`;

const HostTextWrapper = styled.div`
  color: #273135;
  text-align: right;
  font-size: 12px;
  line-height: normal;
  opacity: 0.4;
`;

const UserNameWrapper = styled.div`
  color: #273135;
  text-align: right;
  font-size: 14px;
  line-height: normal;
`;

export default DineInHeader;
