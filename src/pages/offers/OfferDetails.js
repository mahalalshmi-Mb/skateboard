import React, { useEffect } from "react";
import HeroBannerMobile from "../../assets/images/profile/Traveller-Profile-500.jpg";
import HeroBanner_810 from "../../assets/images/profile/Traveller-Profile-Mobile.jpg";
import HeroBanner from "../../components/molecules/heroBanner";
import "./offerDetails.css";
import fImg from "../../assets/images/heroBanner/CovFAQ.png";
import Snap from "./cutome-slider";

const OfferDetails = () => {
  const [heroBannerHeight, setHeroBannerHeight] = React.useState("500px");
  const setBannerHeight = () => {
    if (window.innerWidth <= 992) {
      setHeroBannerHeight("278px");
    } else {
      setHeroBannerHeight("500px");
    }
  };

  useEffect(() => {
    setBannerHeight();
  }, []);

  return (
    <>
      <HeroBanner
        isHomePage={false}
        heroBannerImageMobile={HeroBanner_810}
        heroBannerImage={HeroBannerMobile}
        height={heroBannerHeight}
        pageTitle="Offer Details"
      />

      <div className="responsivegrid aem-GridColumn aem-GridColumn--default--12">
        <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
          <div className="profile aem-GridColumn aem-GridColumn--default--12">
            <div className="component profile_page">
              <div className="outer_div">
                <div className="container_div">
                  <div className="Starbucks-mains">
                    <div className="d-flex Starbucks-main ">
                      <div style={{ width: "35px" }}>
                        <img
                          style={{ width: "100%", height: "auto" }}
                          src={fImg}
                          alt="some img"
                        />
                      </div>
                      <div className="Starbucks">
                        <p className="mb-0">Starbucks</p>
                        <ul
                          className="d-flex pl-0 pb-0 mb-0"
                          style={{ listStyle: "none" }}
                        >
                          <li>
                            <img
                              width={10}
                              height={10}
                              src={fImg}
                              alt="some img"
                            />{" "}
                            QUAD
                          </li>
                          <li>level</li>
                          <li>Near Gate 1</li>
                        </ul>
                      </div>
                      <div>
                        <img width={10} height={10} src={fImg} alt="some img" />
                      </div>
                    </div>
                  </div>

                  <h4 style={{ textAlign: "center" }}>
                    Earn 20 Reward points for every for every 400 spent
                  </h4>
                  <div className="store_outlet_text">
                    <p style={{ textAlign: "center" }}>
                      Offer applicable at this store outlet only
                    </p>
                  </div>
                  <h3 className="gray-text">Deal Summary</h3>
                  <div className="dealsum-content">
                    <ul>
                      <li>dch</li>
                      <li>bchjb</li>
                    </ul>
                  </div>
                  <h3 className="gray-text">How to Redeem</h3>
                  <div className="dealsum-content">
                    <ul>
                      <li>chyjjd</li>
                      <li>chyjjd</li>
                      <li>chyjjd</li>
                      <li>chyjjd</li>
                    </ul>
                  </div>
                  <h3 className="gray-text">Terms and Conditions</h3>
                  <div className="dealsum-content">
                    <ul>
                      <li>chyjjd</li>
                      <li>chyjjd</li>
                      <li>chyjjd</li>
                    </ul>
                  </div>

                  <h3 className="gray-text">
                    Offers at other Starbucks stores
                  </h3>

                  <Snap />

                  <button className="bottom_btn"> Avail Offer</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferDetails;
