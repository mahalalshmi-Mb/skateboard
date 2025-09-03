import React, { useEffect, useState } from "react";
import config from "commons/config";
import Util from "commons/util/util";
import callAPI from "commons/callAPI";
import ReactHtmlParser from "react-html-parser";
import Loader from "components/atoms/loader";
import "./style.css";

const AboutServy = (props) => {
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    try {
      let apiURL = config.api.pages.replace(
        "{{pageId}}",
        Util.getSlug(props?.location?.pathname)
      );

      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();

      if (apiResponse.status === 200) {
        setPageData(regResponse);
      } else {
        setPageData({});
      }
    } catch (e) {
      setPageData({});
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    pageData?.html && (
      <div className="footer-links">{ReactHtmlParser(pageData.html)}</div>
    )
  );
};

export default AboutServy;
