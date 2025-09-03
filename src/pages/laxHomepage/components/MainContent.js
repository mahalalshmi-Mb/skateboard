import React from "react";
import BannerSlider from "./BannerSlider";
import Introduction from "./Introduction";
import RetailerSection from "./RetailerSection";
import ArticlesList from "./ArticlesList";
import CategoryList from "./CategoryList";
import FeaturedRetailers from "./FeaturedRetailer";

const MainContent = ({ data }) => {
  const {
    bannerData,
    introduction,
    categoryList,
    articleData,
    retailersList,
    featuredRetailer,
    categoryTitle,
  } = data;

  return (
    <React.Fragment>
      <BannerSlider bannerData={bannerData[0]} />
      <Introduction data={introduction} />
      <CategoryList list={categoryList} categoryTitle={categoryTitle} />
      <RetailerSection
        retailersList={retailersList}
        featuredRetailer={featuredRetailer}
      />
      <FeaturedRetailers data={featuredRetailer} />
      <ArticlesList data={articleData} />
    </React.Fragment>
  );
};

export default MainContent;
