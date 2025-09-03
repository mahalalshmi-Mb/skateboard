import React, { useState } from "react";
import parse from "html-react-parser";

function Template(props) {
  const [columnNumber] = useState(props.data.column);
  const [column1] = useState(props.data.column1 ? props.data.column1 : null);
  const [column2] = useState(props.data.column2 ? props.data.column2 : null);
  const [column3] = useState(props.data.column3 ? props.data.column3 : null);
  const [row] = useState(props.data.row ? props.data.row : null);

  const renderContent = (colNumber) => {
    switch (colNumber) {
      default:
        return (
          <div className="col-lg-12 col-md-12 col-sm-12">
            {column1 !== null ? parse(column1) : null}
          </div>
        );
        break;
      case "2":
        return (
          <>
            <div className="col-lg-6 col-md-6 col-sm-12">
              {column1 !== null ? parse(column1) : null}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              {column2 !== null ? parse(column2) : null}
            </div>
          </>
        );
        break;
      case "3":
        return (
          <>
            <div className="col-lg-4 col-md-4 col-sm-12">
              {column1 !== null ? parse(column1) : null}
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              {column2 !== null ? parse(column2) : null}
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              {column3 !== null ? parse(column3) : null}
            </div>
          </>
        );
    }
  };
  return (
    <>
      {props.data.bannerImage && props.data.bannerImage !== null ? (
        <div className="template-banner-layout">
          {parse(props.data.bannerImage)}
        </div>
      ) : null}

      <div
        className="responsivegrid aem-GridColumn aem-GridColumn--default--12"
        style={{ paddingTop: "20px", minHeight: "300px" }}
      >
        <div className="aem-Grid aem-Grid--12 aem-Grid--default--12">
          <div className="richtext aem-GridColumn aem-GridColumn--default--12">
            <div className="container">
              <div className="row">{renderContent(columnNumber)}</div>
              {row !== null ? <div className="row">{parse(row)}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Template;
