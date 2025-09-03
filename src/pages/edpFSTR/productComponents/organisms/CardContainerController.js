import React from "react";
import HorzScrollContainer from "./HorzScrollContainer";
import ImageCarousel from "./ImageCarousel";
import GridContainer from "./GridContainer";
import AllBrands from "../molecules/AllBrands";
import SearchInput from "../../components/molecules/SearchInput";
import SearchIcon from "../../../../assets/images/header/search.png";
import NoPaddingContainer from "./NoPaddingContainer";
import MedPaddingContainer from "./MedPaddingContainer";
import HighPaddingContainer from "./HighPaddingContainer";

function CardContainerController(props) {
  if (props.sectionType === "HorizontalScroller") {
    return (
      <HorzScrollContainer style={props.horzScrollStyles} {...props}>
        {props.children}
      </HorzScrollContainer>
    );
  } else if (props.sectionType === "ImageCarousel") {
    return (
      <ImageCarousel {...props} imageStyle={{ objectFit: "cover" }}>
        {props.children}
      </ImageCarousel>
    );
  } else if (props.sectionType === "GridContainer") {
    return (
      <GridContainer style={props.gridStyles} {...props}>
        {props.children}
      </GridContainer>
    );
  } else if (props.sectionType === "AllBrandsBox") {
    return <AllBrands {...props}>{props.children}</AllBrands>;
  } else if (props.sectionType === "NoPaddingContainer") {
    return (
      <NoPaddingContainer style={props.gridStyles} {...props}>
        {props.children}
      </NoPaddingContainer>
    );
  } else if (props.sectionType === "MedPaddingContainer") {
    return (
      <MedPaddingContainer style={props.gridStyles} {...props}>
        {props.children}
      </MedPaddingContainer>
    );
  } else if (props.sectionType === "HighPaddingContainer") {
    return (
      <HighPaddingContainer style={props.gridStyles} {...props}>
        {props.children}
      </HighPaddingContainer>
    );
  } else if (props.sectionType === "BannerCarousel") {
    return (
     <ImageCarousel {...props}>
        {props.children}
     </ImageCarousel>
    );
  } else if (props.sectionType === "ExploreContainer" || props.sectionType === "ShoppingContainer" || props.sectionType === "TrendingContainer" || props.sectionType === "InfoContainer" || props.sectionType === "OrderContainer") {
    return (
     <NoPaddingContainer {...props}>
        {props.children}
     </NoPaddingContainer>
    );
  } else {
    return <></>;
  }
}

export default CardContainerController;
