import React from "react";
import DonateNow from "../../assets/images/csr/donateNow.jpg";
import Util from "../../commons/util/util";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import useCustomNavigation from "../../hooks/useCustomNavigation";

function HeroBannerTitle(props) {
  const { returnRedirectUrl } = useCustomNavigation();
  return (
    <>
      <div
        className="container hero__banner__title__block"
        style={props.showDonateNow ? { height: props.height } : {}}
      >
        <div className="row">
          {props.isHomePage && props.pageKey == "homepage" ? (
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 hero__banner__title homepage__title">
              <div>
                <p>
                  <span className="bannerHomeHeading">EXPLORE</span>
                </p>
                <p>
                  <span
                    className="bannerHomeHeading"
                    style={{ marginLeft: "2.3rem" }}
                  >
                    ENGAGE
                  </span>
                </p>
                <p>
                  <span
                    className="bannerHomeHeading"
                    style={{ marginLeft: "4.8rem" }}
                  >
                    EXPERIENCE
                  </span>
                </p>
              </div>
            </div>
          ) : props.pageKey == "corporateHomePage" ? (
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 hero__banner__title homepage__title">
              <div>
                <p>
                  <span className="bannerHomeHeading">BANGALORE</span>
                </p>
                <p>
                  <span
                    className="bannerHomeHeading"
                    style={{ marginLeft: "3.5rem" }}
                  >
                    INTERNATIONAL
                  </span>
                </p>
                <p>
                  <span
                    className="bannerHomeHeading"
                    style={{ marginLeft: "6.8rem" }}
                  >
                    AIRPORT
                  </span>
                </p>
                <p>
                  <span
                    className="bannerHomeHeading"
                    style={{ marginLeft: "10.5rem" }}
                  >
                    LIMITED
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 hero__banner__title page__title">
              <div>
                <p>
                  <h1
                    className="bannerPageHeading"
                    style={
                      props.pageTitleFontSize && props.isMobile
                        ? { fontSize: props.pageTitleFontSize }
                        : {}
                    }
                  >
                    {props.pageTitle !== undefined || props.pageTitle !== null
                      ? props.pageTitle
                      : ""}
                  </h1>
                </p>
                <h4
                  style={
                    props.isMobile
                      ? { lineHeight: props.lineHeightSubTitle }
                      : {}
                  }
                >
                  <span
                    className="rte__body-text bannerPageSubHeading"
                    style={
                      props.hideSubTitle
                        ? { visibility: "hidden" }
                        : { visibility: "visible" } ||
                          props.pageSubTitleFontSize
                        ? { fontSize: props.pageSubTitleFontSize }
                        : {}
                    }
                  >
                    {props.pageSubTitle !== undefined ||
                    props.pageSubTitle !== null
                      ? props.pageSubTitle
                      : ""}
                  </span>
                </h4>
                <h4>
                  <span className="rte__body-text">
                    {props.pageExtraInfo !== undefined ||
                    props.pageExtraInfo !== null
                      ? props.pageExtraInfo
                      : ""}
                  </span>
                </h4>
                {props.showDonateNow ? (
                  <>
                    <br />
                    <br />
                    {isMobile && <br />}
                    <h4>
                      <a
                        href="https://formbuilder.ccavenue.com/live/icici-bank/kempegowda-international-airport-foundation/donation-form-4"
                        target="_blank"
                        className="donateNow"
                      >
                        <img
                          src={DonateNow}
                          alt=""
                          onClick={() => {
                            Util.gtag_report_conversion();
                            Util.twitterConversionPixel();
                          }}
                        />{" "}
                      </a>
                    </h4>
                    <p> </p>
                  </>
                ) : null}

                {props.customButton ? (
                  <>
                    <br />
                    <br />
                    <br />
                    <br />
                    <h4>
                      {props.customButton.isExternal ? (
                        <a
                          className="redirect-link-button"
                          href={props.customButton.redirectLink}
                          target="_blank"
                        >
                          {props.customButton.name
                            ? props.customButton.name
                            : null}
                        </a>
                      ) : (
                        <Link
                          className="redirect-link-button"
                          to={returnRedirectUrl(
                            props.customButton.redirectLink
                          )}
                          target="_blank"
                        >
                          {props.customButton.name
                            ? props.customButton.name
                            : null}
                        </Link>
                      )}
                    </h4>
                    <p> </p>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HeroBannerTitle;
