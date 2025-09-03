import React from "react";
import HeroBannerQuickLinks from "../atoms/heroBannerQuickLinks";
import HeroBannerSearchInput from "../atoms/heroBannerSearchInput";
import HeroBannerTitle from "../atoms/heroBannerTitle";

function HeroBanner(props) {
  return (
    <>
      <div className="herobanner aem-GridColumn aem-GridColumn--default--12">
        <div
          className="component hero__banner"
          style={!props.isHomePage ? { marginTop: "0px" } : {}}
        >
          <picture>
            <source
              media="(max-width: 767px)"
              className="hero__banner__bg"
              srcSet={props.heroBannerImageMobile}
              style={{ height: props.height }}
            />
            <source
              media="(max-width: 991px)"
              className="hero__banner__bg"
              srcSet={props.heroBannerImage}
              style={{ height: props.height }}
            />
            <source
              media="(min-width: 992px)"
              className="hero__banner__bg"
              srcSet={props.heroBannerImage}
              style={{ height: props.height }}
            />
            <img
              src={props.heroBannerImage}
              className="hero__banner__bg"
              alt="BIAL Traveller Page Banner"
              style={{ height: props.height }}
            />
          </picture>
          {props.hideMaskLayer !== true ? (
            <div
              className="hero__mask__layer"
              style={{ height: props.height }}
            ></div>
          ) : null}
          <HeroBannerTitle
            isHomePage={props.isHomePage}
            pageKey={props.pageKey}
            pageTitle={props.pageTitle}
            pageSubTitle={props.pageSubTitle}
            pageExtraInfo={props.pageExtraInfo}
            showDonateNow={props.showDonateNow}
            height={props.height}
            hideSubTitle={props.hideSubTitle}
            pageTitleFontSize={props.pageTitleFontSize}
            pageSubTitleFontSize={props.pageSubTitleFontSize}
            customButton={props.customButton ? props.customButton : null}
            lineHeightSubTitle={props.lineHeightSubTitle}
            isMobile={props.isMobile}
          />
          {props.isHomePage ? (
            <HeroBannerQuickLinks data={props.data.homepage_icons} />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default HeroBanner;
