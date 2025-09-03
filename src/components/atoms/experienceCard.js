import React from "react";
import { Link } from "react-router-dom";
import config from "../../commons/config";
import Util from "../../commons/util/util";
import useFileDownloader from "./useFileDownloader";
import parse from "html-react-parser";
import { useHistory } from "react-router-dom";
import useCustomNavigation from "../../hooks/useCustomNavigation";

function ExperienceCard(props) {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();
  const [downloadFile, downloaderComponentUI] = useFileDownloader();
  const startDownload = (url, fileName) => {
    if (document.getElementsByClassName("downloader").length > 0) {
      return false;
    }
    let extension = url.split(".").pop();
    let downloadObj = {};
    downloadObj.name = fileName + "." + extension;
    downloadObj.file = url;
    downloadObj.filename = fileName + "." + extension;
    downloadFile(downloadObj);
  };
  return (
    <>
      <div
        className="col-12 col-md-12 col-lg-6 card"
        style={
          props.isDesktop
            ? props.index % 2 === 0
              ? {
                  marginRight: "10px",
                  float: "left",
                  marginBottom: "2rem",
                  width: "calc(50% - 5px)",
                  padding: "0px",
                  height: "275px",
                }
              : {
                  marginRight: "0px",
                  float: "left",
                  marginBottom: "2rem",
                  width: "calc(50% - 5px)",
                  padding: "0px",
                  height: "275px",
                }
            : {}
        }
      >
        <div className="row discover__south--row" style={{ height: "100%" }}>
          <div
            className="col-12 col-md-4 col-lg-6 discover__south--row_image"
            style={{ height: "100%" }}
          >
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet={config.imageUrlDomain.imageURL + props.image}
              />
              <source
                media="(max-width: 991px)"
                srcSet={config.imageUrlDomain.imageURL + props.image}
              />
              <source
                media="(min-width: 992px)"
                srcSet={config.imageUrlDomain.imageURL + props.image}
              />
              <img
                src={config.imageUrlDomain.imageURL + props.image}
                className="card-img discover__south--images"
                alt="Culinary Experience image"
                style={{ height: "100%" }}
              />
            </picture>
          </div>
          <div className="col-12 col-md-8 col-lg-6 discover__south--details">
            <div className="card-body">
              <h5>{props.header}</h5>
              <div className="discover__south--details-description">
                <p>
                  <span
                    className="rte__body-text"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: "6",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {parse(props.body)}
                  </span>
                </p>
              </div>
              {props?.header?.toLowerCase() === "fstr" &&
              props.isDesktop ? null : (
                <p
                  className={
                    props.alignReadBottom
                      ? "discover__south--details-link_readBottom"
                      : "discover__south--details-link"
                  }
                >
                  {props.isExternal ? (
                    <a
                      href={props.redirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#006160",
                        fontFamily: "ManropeBold",
                        fontSize: "14px",
                        letterSpacing: ".6px",
                        paddingTop: "20px",
                        paddingBottom: "1.4%",
                        overflow: "inherit",
                      }}
                    >
                      {props.linkLabel
                        ? props.linkLabel
                        : "Click here to explore"}
                    </a>
                  ) : props.isPdf ? (
                    Util.isWebView() ? (
                      <a href={config.imageUrlDomain.imageURL + props.pdfLink}>
                        {props.linkLabel
                          ? props.linkLabel
                          : "Click here to view"}
                      </a>
                    ) : (
                      <a
                        onClick={() =>
                          startDownload(
                            config.imageUrlDomain.imageURL + props.pdfLink,
                            props.header
                          )
                        }
                      >
                        {props.linkLabel
                          ? props.linkLabel
                          : "Click here to view"}
                      </a>
                    )
                  ) : (
                    <span
                      onClick={() => pushHistory(props.redirectLink)}
                      style={{
                        color: "#006160",
                        fontFamily: "ManropeBold",
                        fontSize: "14px",
                        letterSpacing: ".6px",
                        paddingTop: "20px",
                        paddingBottom: "1.4%",
                        overflow: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      {props.linkLabel ? props.linkLabel : "READ MORE"}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        {downloaderComponentUI}
      </div>
    </>
  );
}

export default ExperienceCard;
