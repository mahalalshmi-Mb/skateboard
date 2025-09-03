import InfoSection from "pages/laxHomepage/components/InfoSection";
import ArticlesList from "../../../laxHomepage/components/ArticlesList";
import BannerSlider from "../../../laxHomepage/components/BannerSlider";
import CategoryCard from "../../../laxHomepage/components/CategoryCard";
import FeaturedRetailers from "../../../laxHomepage/components/FeaturedRetailer";
import Introduction from "../../../laxHomepage/components/Introduction";
import RetailerSection from "../../../laxHomepage/components/RetailerSection";
import MenuItem from "../../components/molecules/MenuItem";
import MustTriesItem from "../../components/molecules/MustTriesItem";
import BrandCard from "../molecules/BrandCard";
import CategoryCardOne from "../molecules/CategoryCardOne";
import CategoryCardThree from "../molecules/CategoryCardThree";
import CategoryCardTwo from "../molecules/CategoryCardTwo";
import InstructionCard from "../molecules/InstructionCard";
import ProductCard from "../molecules/ProductCard";
import ShopCard from "pages/edpFSTR/components/molecules/ShopCard";
import ImageCarousel from "./ImageCarousel";
import ImageHoverOverlay from "pages/laxHomepage/components/ImageHoverOverlay";
import InfoCard from "pages/laxHomepage/components/InfoCard";
import TrendingCard from "pages/laxHomepage/components/TrendingCard";
import OrderSection from "pages/laxHomepage/components/OrderSection";

function CardController(props) {
  const getImage = (imageArr, type) => {
    const image = imageArr?.filter(
      (x) =>
        (x.platform?.toLowerCase() === "web" ||
          x.platform?.toLowerCase() === "marketplace") &&
        x.type === type
    )[0]?.imageUrl;
    return image;
  };
  const getCircularImage = (imageArr) => {
    const image = imageArr?.filter(
      (x) =>
        (x?.platform?.toLowerCase() === "web" ||
          x?.platform?.toLowerCase() === "marketplace") &&
        x?.type?.toLowerCase() === "small" &&
        x?.dimension?.toLowerCase() === "circular"
    );
    if (image) {
      return image[0]?.imageUrl;
    }
  };

  const getRectangularImage = (imageArr) => {
    const image = imageArr?.filter(
      (x) =>
        (x?.platform?.toLowerCase() === "web" ||
          x?.platform?.toLowerCase() === "marketplace") &&
        x?.type?.toLowerCase() === "small" &&
        x?.dimension?.toLowerCase() === "ractangular"
    );
    if (image) {
      return image[0]?.imageUrl;
    }
  };

  const getSmallImage = (imageArr) => {
    const image = imageArr?.filter(
      (x) =>
        (x?.platform?.toLowerCase() === "web" ||
          x?.platform?.toLowerCase() === "marketplace") &&
        x?.type?.toLowerCase() === "small"
    );
    if (image) {
      return image[0]?.imageUrl;
    }
  };

  if (props.cardType === "CircularCard") {
    return (
      <CategoryCardOne
        ageVerificationReq={props.data?.ageVerificationRequired}
        title={props.data?.categoryName}
        image={getCircularImage(props.data?.categoryImage)}
        {...props}
      >
        {props.children}
      </CategoryCardOne>
    );
  } else if (props.cardType === "ProductCardOne") {
    return (
      <ProductCard
        image={getImage(props.data?.productImageUrl, "Small")}
        imageStyle={{
          height: "194px",
          minHeight: "194px",
          borderRadius: "4px",
          objectFit: "contain",
        }}
        imageWrapperStyle={{ height: "fit-content", backgroundColor: "#fff" }}
        item={props.data}
        product={props.data}
        productId={props.data?._id}
        title={props.data?.productName}
        subTitle={props.data?.brand?.brandName || ""}
        price={props.data?.price}
        discountPct={props.data?.discountPct}
        offerPrice={props.data?.offerPrice}
        strikeout={props.data?.strikeout}
        attributeList={props?.data?.attributeList || []}
        showDiscount={true}
        selectedItemId={props.selectedItemId}
        setSelectedItemId={props.setSelectedItemId}
        setShowDetailModal={props.setShowDetailModal}
        setShowCustomisationModal={props.setShowCustomisationModal}
        setShowRepeatSelectionModal={props.setShowRepeatSelectionModal}
        ageVerificationReq={props.data?.ageVerificationRequired}
        setShowMultiStoreCheckModal={props?.setShowMultiStoreCheckModal}
        setMultiStoreData={props?.setMultiStoreData}
        {...props}
      >
        {props.children}
      </ProductCard>
    );
  } else if (props.cardType === "ProductCardTwo") {
    return (
      <MenuItem
        index={props.index}
        product={props.data}
        productId={props.data?._id}
        item={props.data}
        selectedItemId={props.selectedItemId}
        setSelectedItemId={props.setSelectedItemId}
        setShowDetailModal={props.setShowDetailModal}
        setShowCustomisationModal={props.setShowCustomisationModal}
        setShowRepeatSelectionModal={props.setShowRepeatSelectionModal}
        ageVerificationReq={props.data?.ageVerificationRequired}
        setRecommendationModal={props?.setRecommendationModal}
        setRecommendationList={props?.setRecommendationList}
        setShowMultiStoreCheckModal={props?.setShowMultiStoreCheckModal}
        setMultiStoreData={props?.setMultiStoreData}
        {...props}
      >
        {props.children}
      </MenuItem>
    );
  } else if (props.cardType === "CategoryRectangularCard") {
    return (
      <CategoryCardTwo
        image={getRectangularImage(props.data?.categoryImage)}
        imageText={props.data.categoryName}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      >
        {props.children}
      </CategoryCardTwo>
    );
  } else if (props.cardType === "CategoryRectangularCardTwo") {
    return (
      <CategoryCardThree
        image={getRectangularImage(props.data?.categoryImage)}
        title={props.data?.categoryName}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      >
        {props.children}
      </CategoryCardThree>
    );
  } else if (props.cardType === "LandscapeCard") {
    return (
      <InstructionCard
        number={props.data?.attributes?.instructionNumber}
        title={props.data?.attributes?.instructionHeader}
        description={props.data?.attributes?.instructionDescription}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      >
        {props.children}
      </InstructionCard>
    );
  } else if (props.cardType === "BrandCard") {
    return (
      <BrandCard
        index={props.index}
        image={getSmallImage(props.data?.brandImage)}
        imageText={props.data?.categoryName}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      >
        {props.children}
      </BrandCard>
    );
  } else if (props.cardType === "ShopCard") {
    return (
      <MustTriesItem
        store={props.data}
        number={props.index}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      >
        {props.children}
      </MustTriesItem>
    );
  } else if (props.cardType === "ShopCardTwo") {
    return (
      <ShopCard
        data={props.data}
        number={props.index}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      />
    );
  } else if (props.cardType === "BannerCard") {
    return (
      <BannerSlider
        data={props.data}
        number={props.index}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      >
        {props.children}
      </BannerSlider>
    );
  } else if (props.cardType === "InformationalCard") {
    return (
      <Introduction
        data={props.data}
        number={props.index}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      >
        {props.children}
      </Introduction>
    );
  } else if (props.cardType === "DiscoverMoreCard") {
    return (
      <CategoryCard
        data={props.data}
        number={props.index}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      >
        {props.children}
      </CategoryCard>
    );
  } else if (props.cardType === "ShopLogoCard") {
    return (
      <RetailerSection
        store={props?.data?.attributes?.images}
        number={props.index}
        ageVerificationReq={props.data?.ageVerificationRequired}
        settings={props?.settings}
        sectionType={
          props?.sectionData?.sectionComponent?.sectionType ===
            "MedPaddingContainer" || false
        }
        {...props}
      >
        {props.children}
      </RetailerSection>
    );
  } else if (props.cardType === "OrderNowCard") {
    return (
      <FeaturedRetailers
        store={props.data}
        number={props.index}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      >
        {props.children}
      </FeaturedRetailers>
    );
  } else if (props.cardType === "LaxInfoMediaCard") {
    return (
      <ArticlesList
        store={props.data}
        number={props.index}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      >
        {props.children}
      </ArticlesList>
    );
  } else if (props.cardType === "InfoSection") {
    return (
      <InfoSection
        store={props.data}
        number={props.index}
        ageVerificationReq={props.data?.ageVerificationRequired}
        {...props}
      >
        {props.children}
      </InfoSection>
    );
  } else if (props.cardType === "BannerCarouselCard") {
    return (
      <ImageCarousel
        data={props?.data}
        style={{ width: "auto" }}
        isAutoscrollHorizontal={true}
        settings={props?.bannerCarouselSettings}
        {...props}
      >
        {props.children}
      </ImageCarousel>
    );
  } else if (props.cardType === "ExploreCard") {
    return (
      <ImageHoverOverlay data={props?.data} {...props}>
        {props.children}
      </ImageHoverOverlay>
    );
  } else if (props.cardType === "ShoppingCard") {
    return (
      <ArticlesList data={props?.data} {...props}>
        {props.children}
      </ArticlesList>
    );
  } else if (props.cardType === "TrendingCard") {
    return (
      <TrendingCard data={props?.data} {...props}>
        {props.children}
      </TrendingCard>
    );
  } else if (props.cardType === "InfoCard") {
    return (
      <InfoCard data={props?.data} {...props}>
        {props.children}
      </InfoCard>
    );
  } else if (props.cardType === "OrderCard") {
    return (
      <OrderSection data={props?.data} {...props}>
        {props.children}
      </OrderSection>
    );
  } else {
    return <></>;
  }
}

export default CardController;
