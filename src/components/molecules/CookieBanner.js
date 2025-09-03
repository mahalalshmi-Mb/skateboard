import { convertSpelling } from "commons/util/spellingHelper";
import React from "react";
import CookieConsent from "react-cookie-consent";
import { colors } from "theme/colors";

function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All Cookies"
      declineButtonText="Reject All"
      cookieName="myAwesomeCookieName2"
      enableDeclineButton={true}
      flipButtons={true}
      buttonWrapperClasses="global-cookie-button-wrapper"
      style={{
        background: "#fff",
        maxWidth: "350px",
        borderRadius: "5px",
        padding: "0px 10px 0px 0px",
        alignItems: "center",
        width: "95%",
        marginLeft: "1rem",
        marginBottom: "1rem",
        zIndex: "99999",
        color: colors?.text.gray300,
        boxShadow: "0 0 18px rgba(0,0,0,.2)",
      }}
      buttonStyle={{
        background: colors?.text.gray300,
        color: colors?.text.white900,
        fontSize: "13px",
      }}
      declineButtonStyle={{
        background: colors?.text.gray300,
        color: colors?.text.white900,
        fontSize: "13px",
      }}
      expires={30}
    >
      <p style={{ fontSize: "12px", margin: "0px", padding: "0px" }}>
        {convertSpelling(
          "By clicking “Accept All Cookies”, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts"
        )}{" "}
        <a
          exact
          target="_blank"
          href={"https://servy.us/cookie-policy"}
          rel="noopener noreferrer"
          style={{ color: "#679436" }}
        >
          Cookie Policy
        </a>
      </p>
    </CookieConsent>
  );
}

export default CookieBanner;
