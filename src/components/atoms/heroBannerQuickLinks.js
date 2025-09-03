import React, { useState, useEffect } from "react";
import config from "../../commons/config";
import { Link } from "react-router-dom";
import ReactToolTip from "react-tooltip";
import useCustomNavigation from "../../hooks/useCustomNavigation";

function HeroBannerQuickLinks(props) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setBannerHeight();
  }, []);

  const setBannerHeight = () => {
    if (window.innerWidth <= 767) {
      setIsDesktop(false);
    } else if (window.innerWidth >= 767 && window.innerWidth <= 992) {
      setIsDesktop(false);
    } else {
      setIsDesktop(true);
    }
  };

  window.addEventListener("resize", setBannerHeight);

  return (
    <>
      <div>
        <div className="component quick__links">
          <div className="container">
            <div className="row quick__links__shortcut__menu">
              {props.data &&
                props.data.map((item, index) => (
                  <QuickLinks
                    index={index}
                    data={item}
                    isDesktop={isDesktop}
                    key={index}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function QuickLinks(props) {
  const { returnRedirectUrl } = useCustomNavigation();
  return (
    <div
      className="col-3 col-md-2 offset-md-2 image_1"
      key={props.index}
      data-tip={props.data.hoverText}
    >
      {props.data.external ? (
        <a href={props.data.navigationLink} target="_blank" rel="noopener">
          <img
            title={props.data.name}
            src={config.imageUrlDomain.imageURL + props.data.logo[0].url}
            alt="QuickLinks"
            className="shortcut__menus"
          />
        </a>
      ) : (
        <Link to={returnRedirectUrl(props.data.navigationLink)} target="_self">
          <img
            title={props.data.name}
            src={config.imageUrlDomain.imageURL + props.data.logo[0].url}
            alt="QuickLinks"
            className="shortcut__menus"
          />
        </Link>
      )}
      {props.data.name && props.data.name !== "" ? (
        <p>{props.data.name}</p>
      ) : null}
      {props.isDesktop ? <ReactToolTip /> : null}
    </div>
  );
}

export default HeroBannerQuickLinks;
