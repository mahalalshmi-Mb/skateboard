import React from "react";
import { Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import config from "../../commons/config";
import useFileDownloader from "../atoms/useFileDownloader";
import Util from "../../commons/util/util";
import useCustomNavigation from "../../hooks/useCustomNavigation";

function Accordian(props) {
  const { returnRedirectUrl } = useCustomNavigation();
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
    <div className="accordion--list">
      <a
        className={
          props.accordionId === props.open
            ? "toggle accordion__expand"
            : "toggle defaultOpen"
        }
        onClick={() => props.handleClick(props.index)}
      >
        {props.item.header}
        <span
          className={
            props.accordionId === props.open
              ? "arrow accordion__minus accordion__down"
              : "arrow accordion__plus accordion__up"
          }
          aria-hidden="true"
        ></span>
      </a>
      <div
        className={props.accordionId === props.open ? "inner show" : "inner"}
        style={
          props.accordionId === props.open
            ? { display: "block" }
            : { display: "none" }
        }
      >
        {props.item.isNested === false ? (
          <div>
            {ReactHtmlParser(props.item.html)}

            {props.item.redirectLink ? (
              <Link
                to={returnRedirectUrl(props.item.redirectLink)}
                className="internal-page-link"
              >
                <span className="internal-page-link-label">
                  {props.item.redirectLinkLabel
                    ? props.item.redirectLinkLabel
                    : "Read More"}
                </span>
              </Link>
            ) : null}

            {props.item.header === "Hand Baggage Restrictions" ? (
              <p className="container">
                {Util.isWebView() ? (
                  props.item.downloadableFiles &&
                  props.item.downloadableFiles.length > 0 ? (
                    <a
                      href={
                        config.imageUrlDomain.imageURL +
                        props.item.downloadableFiles[0].url
                      }
                      download={true}
                      style={{
                        color: "#006160",
                        fonFamily: "ManropeRegular",
                        fontSize: "18px",
                        fontWeight: "500",
                      }}
                    >
                      {props.item.redirectLinkLabel}
                    </a>
                  ) : null
                ) : (
                  <a
                    style={{
                      color: "#006160",
                      fonFamily: "ManropeRegular",
                      fontSize: "18px",
                      fontWeight: "500",
                    }}
                    onClick={() => {
                      if (
                        props.item.downloadableFiles &&
                        props.item.downloadableFiles.length > 0
                      ) {
                        startDownload(
                          config.imageUrlDomain.imageURL +
                            props.item.downloadableFiles[0].url,
                          props.item.downloadableFiles[0].name
                        );
                      }
                    }}
                  >
                    {props.item.redirectLinkLabel}
                  </a>
                )}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      {downloaderComponentUI}
    </div>
  );
}

export default Accordian;
