import React, { Fragment, useState } from "react";
import {
  CCBookButton,
  CCCardsWrapper,
  CCEntryTitle,
  CCImage,
  CreditCardEntrySection,
} from "./style";
import Text from "../../atoms/Text";
import { CreditCardsData } from "./config";
import { getAppConfig } from "../../../commons/util/appConfigHelper";
import { renderImage } from "./hospitalityUtil";
import PushAlert from "../../../components/atoms/pushAlert";
import QuickSignIn from "../../../components/organisms/QuickSignInDrawer/QuickSignIn";
import { checkoutToDreamfolks } from "./checkoutToDreamfolks";
import { useCookies } from "react-cookie";

const DreamfolksCheckout = () => {
  const [cookies] = useCookies(["gwLoginData"]);
  const [isQuickSignInOpen, setIsQuickSignInOpen] = useState(false);

  const checkIfLoggedIn = () => {
    //Login data
    if (!cookies.gwLoginData) {
      PushAlert.info("Please login to continue");
      setIsQuickSignInOpen(true);
      return;
    } else {
      checkoutToDreamfolks();
    }
  };
  return (
    <Fragment>
      <QuickSignIn
        isDrawerOpen={isQuickSignInOpen}
        setIsDrawerOpen={setIsQuickSignInOpen}
        successHandler={checkoutToDreamfolks}
      />

      <CreditCardEntrySection>
        <CCEntryTitle>Have a credit card with Lounge access?</CCEntryTitle>
        <CCCardsWrapper>
          {CreditCardsData.map((cc) => (
            <CCImage src={renderImage(`${cc}.svg`)} alt="cc" />
          ))}
        </CCCardsWrapper>
        <CCBookButton onClick={checkIfLoggedIn}>
          <Text type="extra-bold">Verify & Book</Text>
        </CCBookButton>
      </CreditCardEntrySection>
    </Fragment>
  );
};

export default DreamfolksCheckout;
