import React, { useEffect } from "react";
import HeroBannerMobile from "../../assets/images/profile/Traveller-Profile-500.jpg";
import HeroBanner_810 from "../../assets/images/profile/Traveller-Profile-Mobile.jpg";
import HeroBanner from "../../components/molecules/heroBanner";
import "./offers.css";

const Offers = () => {
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
        pageTitle="Offers"
      />
      <div className="responsivegrid aem-GridColumn aem-GridColumn--default--12">
        <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
          <div className="profile aem-GridColumn aem-GridColumn--default--12">
            <div className="component profile_page">
              <div className=""></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Offers;
