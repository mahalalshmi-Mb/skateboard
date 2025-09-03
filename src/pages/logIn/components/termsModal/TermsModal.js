import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import CustomModal from "../../../../components/atoms/Modal";
import Text from "../../../../components/atoms/Text";
import { NavContext } from "../../../../context/navContext";
import { Content, Title, Wrapper } from "./style";

export default function TermsModal(props) {
  const useNav = useContext(NavContext);

  const handleOnHide = () => {
    props.setIsOpen(false);
  };
  return (
    <CustomModal
      {...props}
      fullscreen
      onShow={useNav.hideAllNavs}
      onHide={handleOnHide}
      onExited={useNav.showAllNavs}
      className="rewards-terms-modal"
    >
      <Modal.Header
        style={{
          fontStyle: "normal",
          fontSize: "21px",
          color: "#273135",
        }}
        closeButton
      ></Modal.Header>
      <Wrapper>
        <Title>
          <Text type="bold">Terms and conditions</Text>
        </Title>
        <Content>
          <Text>
            <Text>
              Please read the below terms and conditions of participation in
              Reward Program. By participating in this Program, you agree to
              bound by the terms herein and all terms incorporated by reference.
            </Text>
            <Text>
              <br />
            </Text>
            <Text type="bold">Earning Reward points:</Text>
            <Text>
              <br />
            </Text>
            <Text>
              Program rewards and thanks loyal customers for purchasing products
              and/or being a part of Program related activities. Members will be
              able to earn points while transacting at select merchants at
              Bangalore airport
            </Text>
            <Text>
              <br />
            </Text>
            <Text>
              Free members in reward Program are entitled to receive 2 points
              for every 100 INR spent on the transactions at select merchants at
              the airport. The value of 1 point will be equal to 1 INR.
              Additionally, points may be issued from time to time based on
              promotional activities run by the merchants.
            </Text>
            <Text>
              <br />
            </Text>
            <Text type="bold">Redeeming Reward points:</Text>
            <Text>
              <br />
            </Text>
            <Text>
              Free members will able to redeem only up to 50% of the transaction
              value for each transaction. Example: Customer has 1000 points in
              wallet balance and making a purchase of 1500 rupees. Customer can
              only redeem for 750 (50% of Transaction value).
            </Text>
            <Text>
              <br />
            </Text>
            <Text>
              Points cannot be exchanged for cash or credit. Points cannot be
              used against payment for any charges incurred in the Reward
              Program
            </Text>
            <Text>
              <br />
            </Text>
            <Text>
              Points earned through the Program have no cash value & are
              non-transferable. Points credited to the member’s account will be
              decreased if the credited points are obtained through fraudulent
              or other activity violating the terms. Rewards Program will not be
              responsible for points lost or redeemed due to fraudulent
              activity.
            </Text>
            <Text>
              <br />
            </Text>
            <Text type="bold">Refunds & Returns:</Text>
            <Text>
              <br />
            </Text>
            <Text>
              Points earned will be rescinded in the event of a purchase being
              returned for a refund. Any items received as a result of points
              redemption may only be exchanged for a refund of the applicable
              Points redeemed for such item (not cash or credit).
            </Text>
            <Text>
              <br />
            </Text>
            <Text type="bold">Points Expiry:</Text>
            <Text>
              <br />
            </Text>
            <Text>
              Points will expire within 24 months from the date they were first
              earned. If member does not redeem points within this time frame,
              member forfeits all such points.
            </Text>
            <Text>
              <br />
            </Text>
            <Text type="bold">Termination: </Text>
            <Text>
              <br />
            </Text>
            <Text>
              Program may, in its sole and absolute discretion, cancel, change,
              suspend, or modify any aspect of the Program and/or any Reward at
              any time, including the availability of any Reward.
            </Text>
            <Text>
              <br />
            </Text>
            <Text>
              Program may in its sole and absolute discretion shall suspend
              issuance/ redemption of points for a member due to any of the
              following (a) acting in violation of the Reward Program terms and
              conditions (b) fraudulent / potentially fraudulent/ unusual
              behaviour or activity.
            </Text>
            <Text>
              <br />
            </Text>
            <Text type="bold">Indemnification:</Text>
            <Text>
              <br />
            </Text>
            <Text>
              Member agrees to indemnify, defend and hold Program and its
              representatives harmless from and against any and all third-party
              claims, demands, liabilities, costs or expenses including
              attorney’s fees and cost arising from, or related to any breach by
              member of any of these loyalty Program terms and conditions or any
              violation by member of applicable law.
            </Text>
            <Text>
              <br />
            </Text>
            <Text type="bold">Program communication:</Text>
            <Text>
              <br />
            </Text>
            <Text>
              By enrolling in the Program, member has consent to receiving
              Reward Program marketing and Program related emails/SMS. Member
              may opt-out of receiving Reward Program marketing emails/SMS at
              any time by following the instructions provided in the BIAL
              application. But, Program related emails/SMS will still be sent as
              they relate to membership in the Program. 
            </Text>

            <Text>
              <br />
            </Text>
            <Text type="bold">Privacy:</Text>
            <Text>
              <br />
            </Text>
            <Text>
              The personal information collected from members in connection with
              the reward Program, including but not limited to purchases made in
              connection with Program membership, will be used and disclosed by
              Program in accordance with the Privacy Policy.
            </Text>
          </Text>
        </Content>
      </Wrapper>
    </CustomModal>
  );
}
