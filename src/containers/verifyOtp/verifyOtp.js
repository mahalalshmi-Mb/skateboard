import React from "react";
import ButtonLoader from "../../components/atoms/buttonLoader";
import Text from "../../components/atoms/Text";
import { colors } from "../../theme/colors";
import { PrimaryButton, TertiaryButton } from "../../theme/globalStyleSheet";
import CustomOtpInput from "./components/CustomOtpInput/CustomOtpInput";
import { Footer, OtpWrapper, Section, Subtitle, Title, Wrapper } from "./style";

const VerifyOtp = (props) => {
  return (
    <Wrapper>
      <Title>
        <Text>Verify OTP</Text>
      </Title>
      {props.verifyEmail && (
        <Section>
          <Subtitle>
            <Text style={{ color: colors.text.secondaryText }}>
              Enter the 4 digit code send to
            </Text>
            <Text style={{ fontWeight: 800 }}>{props.email}</Text>
          </Subtitle>
          <OtpWrapper>
            <CustomOtpInput
              value={props.emailOtp}
              setValue={props.setEmailOtp}
              placeholder="0000"
            />
          </OtpWrapper>
        </Section>
      )}
      {props.verifyMobile && (
        <Section>
          <Subtitle>
            <Text style={{ color: colors.text.secondaryText }}>
              Enter the 4 digit code send to
            </Text>
            <Text style={{ fontWeight: 800 }}>{props.mobile}</Text>
          </Subtitle>
          <OtpWrapper>
            <CustomOtpInput
              value={props.mobileOtp}
              setValue={props.setMobileOtp}
              placeholder="0000"
            />
          </OtpWrapper>
        </Section>
      )}
      <Footer>
        <Text
          style={{
            color: colors.text.secondaryText,
            fontSize: "16px",
            lineHeight: "22px",
          }}
        >{`Time remaining ${props.timeRemaining} secs`}</Text>
        <PrimaryButton
          style={{
            marginTop: "30px",
            pointerEvents: props?.isClickDisabled ? "none" : "",
          }}
          disabled={props.isVerifyDisabled}
          onClick={() => props.onVerify(props.isVerifyDisabled)}
        >
          {props.verifyIsLoading ? <ButtonLoader /> : "Verify"}
        </PrimaryButton>
        <TertiaryButton
          style={{
            marginTop: "15px",
            pointerEvents: props?.isClickDisabled ? "none" : "",
          }}
          disabled={props.timeRemaining > 0 ? true : false}
          onClick={() => props.onResend(props.timeRemaining > 0)}
        >
          {props.resendIsLoading ? (
            <ButtonLoader color={colors.primary} />
          ) : (
            "Resend OTP"
          )}
        </TertiaryButton>
      </Footer>
    </Wrapper>
  );
};

export default VerifyOtp;
