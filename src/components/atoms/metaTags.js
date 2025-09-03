import React from "react";
import { Helmet } from "react-helmet";

const extractHeadTags = (htmlString) => {
  const container = document.createElement("div");
  container.innerHTML = htmlString;

  const headElements = [...container.querySelectorAll("title, meta, link")];

  return headElements.map((el, index) => {
    const props = {};
    for (let attr of el.attributes) {
      props[attr.name] = attr.value;
    }

    const tag = el.tagName.toLowerCase();
    if (tag === "title") {
      return <title key={index}>{el.textContent}</title>;
    }
    return React.createElement(tag, { ...props, key: index });
  });
};

const MetaTags = (props) => {
  const headTags =
    typeof window !== "undefined" ? extractHeadTags(props?.data) : [];

  return <Helmet>{headTags}</Helmet>;
};

export default MetaTags;
