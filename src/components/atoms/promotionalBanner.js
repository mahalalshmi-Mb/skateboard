import React from "react";
import config from "../../commons/config";

function PromotionalBanner(props) {
  return (
    <>
      {props.isHomePage && props.data.length > 0
        ? props.data.map((item, index) => (
            <div
              className="containercomponent aem-GridColumn aem-GridColumn--default--12"
              key={index}
            >
              <div className="component container__component ">
                <div className="container__content  ">
                  <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                    <div className="containercomponent aem-GridColumn aem-GridColumn--default--12">
                      <div className="component container__component ">
                        <div className="container__content  ">
                          <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                            <div className="image aem-GridColumn aem-GridColumn--default--12">
                              <div className="cmp-image" itemScope="">
                                <a
                                  className="cmp-image__link"
                                  href="https://www.worldairportsurvey.com/Surveys/Airport/best_airport.html"
                                  data-cmp-hook-image="link"
                                  target="_blank"
                                >
                                  <img
                                    src={
                                      config.imageUrlDomain.imageURL + item.url
                                    }
                                    className="cmp-image__image"
                                    itemProp="contentUrl"
                                    data-cmp-hook-image="image"
                                    alt=""
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        : props.pageKey == "corporateHomePage"
        ? props.data.map((item, index) => (
            <div
              key={index}
              className="containercomponent aem-GridColumn aem-GridColumn--default--12"
              // style={{ marginTop: "50px" }}
            >
              <div className="component container__component ">
                <div className="container__content  ">
                  <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                    <div className="containercomponent aem-GridColumn aem-GridColumn--default--12">
                      <div className="component container__component ">
                        <div className="container__content  ">
                          <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                            <div className="image aem-GridColumn aem-GridColumn--default--12">
                              <div className="cmp-image">
                                <a
                                  className="cmp-image__link"
                                  href="https://www.worldairportsurvey.com/Surveys/Airport/best_airport.html"
                                  data-cmp-hook-image="link"
                                  target="_blank"
                                >
                                  <img
                                    src={
                                      config.imageUrlDomain.imageURL + item.url
                                    }
                                    className="cmp-image__image"
                                    itemProp="contentUrl"
                                    data-cmp-hook-image="image"
                                    alt=""
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        : null}
    </>
  );
}

export default PromotionalBanner;
