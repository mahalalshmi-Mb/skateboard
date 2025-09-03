import styled from "styled-components";
import moment from "util/momentWrapper";
import config from "../../../../commons/config";
import Text from "../../../../components/atoms/Text";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import { useConfig } from "context/configContext";

function OptForTakeaway() {
  const { timezone } = useConfig();
  const { pushHistory } = useCustomNavigation();

  const handleTakeAwayClick = () => {
    let existingData = getSessionStorage("productsData");
    if (
      existingData?.deliveryOptions?.deliveryOption ===
        config?.deliveryOptions?.takeaway &&
      existingData?.deliveryOptions?.isScheduled === true
    ) {
      pushHistory("/takeaway-selection?domain=Food and Beverages");
    } else {
      let productsData = {
        deliveryOptions: {
          deliveryOption: config.deliveryOptions.takeaway,
          deliveryTime: moment(new Date(), "UTC", "UTC").format(),
          isPackagingRequested: true,
          timezone: timezone,
        },
      };
      setSessionStorage("productsData", productsData);
      pushHistory("/takeaway-selection?domain=Food and Beverages");
    }
  };
  return (
    <Wrapper>
      <Title>
        <Text type="semi-bold">Don't have a departing flight? 🛩</Text>
      </Title>
      <SubTitle>
        <Text>
          Without your flight details we cannot deliver to your gate, but you
          can pick up your order!
        </Text>
      </SubTitle>
      <ActionText onClick={() => handleTakeAwayClick()}>
        <Text type="extra-bold">Opt For Takeaway</Text>
      </ActionText>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  padding: 24px;
  border-radius: 4px;
  background: #f2f2f2;
`;
const Title = styled.div`
  color: #273135;
  font-size: 18px;
  line-height: 23px;
`;
const SubTitle = styled.div`
  color: #273135;
  font-size: 14px;
  margin-top: 8px;
`;
const ActionText = styled.div`
  color: #037b79;
  font-size: 16px;
  line-height: 24px;
  margin-top: 12px;
`;

export default OptForTakeaway;
