import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import {
  device,
  isMobileDevice,
} from "../../../../commons/util/helperFunctions";
import FilterCardTwo from "./FilterCardTwo";
import Forward from "../../assets/Forward.svg";
import { setSessionStorage } from "util/storageUtil";
import { colors } from "theme/colors";
import CarouselLeft from "../../assets/CarouselLeft.svg";
import CarouselRight from "../../assets/CarouselRight.svg";
import Text from "components/atoms/Text";
import HorizontalLoader from "components/atoms/horizontalLoader";
import MenuIconHover from "../../assets/MenuIconHover.svg";
import Loader from "../../../../components/atoms/loader";
import { useConfig } from "context/configContext";

const FilterCarousel = ({ component: Component, ...props }) => {
  const navRef = useRef();
  const { appConfig } = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [filterCarouselData, setFilterCarouselData] = useState([]);

  useEffect(() => {
    const container = navRef.current;
    if (!container) return;

    const onScroll = () => {
      checkScrollArrows();
    };

    checkScrollArrows();

    container.addEventListener("scroll", onScroll);
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        checkScrollArrows();
      }, 100);
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [props?.item, filterCarouselData]);

  useEffect(() => {
    setIsLoading(props?.isCardRef);
  }, [props?.isCardRef]);

  useEffect(() => {
    const rawFound = Array.isArray(props?.data)
      ? props.data.find((x) => x?.facetLayout === "filterList")
      : undefined;
    if (!rawFound) {
      setFilterCarouselData([]);
      if (props?.layout === "FilterCarousel") {
        props?.setGlobalFilterLoader?.(false);
      }
      return;
    }
    const found = {
      ...rawFound,
      facetDetails: {
        ...rawFound.facetDetails,
        facetOptionValues: [
          ...(rawFound?.facetDetails?.facetOptionValues || []),
        ],
      },
    };

    const showAllFilter = {
      displayLabel: "Show All",
      image: require(`../../../../assets/images/locationImg/${appConfig.locationId}/MenuIconPrimary.svg`),
      sequenceOrder: "",
      value: "Show All",
      isShowAll: true,
      imageHover: MenuIconHover,
    };
    if (found?.facetDetails?.facetOptionValues) {
      const alreadyExists = found.facetDetails.facetOptionValues.some(
        (item) => item?.isShowAll
      );
      if (
        !alreadyExists &&
        found?.facetDetails?.facetOptionValues?.length > 0
      ) {
        found.facetDetails.facetOptionValues.unshift(showAllFilter);
      }
    }
    if (props?.layout === "FilterCarousel" && found) {
      props?.setGlobalFilterLoader?.(false);
    }
    setFilterCarouselData([found]);
  }, [props?.data]);

  const checkScrollArrows = () => {
    const container = navRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const handleNav = (direction) => {
    if (direction === "left") {
      if (navRef) navRef.current.scrollLeft -= 200;
    } else {
      if (navRef) navRef.current.scrollLeft += 200;
    }
  };

  const createFilterParams = (
    filterParam,
    filterValue,
    isMultiSelect,
    isShowAll
  ) => {
    if (isShowAll) {
      let filterParamObj = {};

      let event_name = "moengage_filter_applied";
      const event_data = {
        filterValue: filterValue,
        domain: props?.domain,
      };
      if (
        props?.globalFilterParams?.["shopCategory.values.name"] &&
        props.globalFilterParams?.["shopCategory.values.name"]?.length > 0
      ) {
        props.setGlobalFilterParams(filterParamObj);
        if (props?.domain) {
          let obj = {};
          obj[props?.domain] = filterParamObj;
          setSessionStorage("productFilters", obj);
        }

        return { event_name, event_data };
      }
    } else {
      let filterParamObj = JSON.parse(JSON.stringify(props.globalFilterParams));
      let valueArray = [];
      let key = filterParam;

      let event_name = "moengage_filter_applied";
      const event_data = {
        filterValue: filterValue,
        domain: props?.domain,
      };

      if (filterParamObj.hasOwnProperty(key)) {
        let value = filterParamObj[key];
        if (value.includes(filterValue)) {
          event_name = "moengage_filter_removed";
          value.splice(value.indexOf(filterValue), 1);
        } else {
          if (!isMultiSelect) {
            value.splice(0, value.length);
            value.push(filterValue);
          } else {
            value.push(filterValue);
          }
        }
      } else {
        valueArray.push(filterValue);
        filterParamObj[key] = valueArray;
      }
      props.setGlobalFilterParams(filterParamObj);
      if (props?.domain) {
        let obj = {};
        obj[props?.domain] = filterParamObj;
        setSessionStorage("productFilters", obj);
      }

      return { event_name, event_data };
    }
  };

  const renderNoResultFound = () => {
    return (
      <NoResultFoundContainer>
        <NoResultImageContainer
          src={require(`../../../../assets/images/locationImg/${appConfig.locationId}/NoResultFound.svg`)}
          alt="No Results"
        />
        <NoResultTitle>
          <Text type="semi-bold">No Results Found</Text>
        </NoResultTitle>
        <NoResultContent>
          <Text type="medium">We couldn’t find any restaurants</Text>
        </NoResultContent>
      </NoResultFoundContainer>
    );
  };

  return (
    <Wrapper>
      {props?.type === "ProductCardTwo" ? (
        <ScrollRow>
          <ArrowWrapper
            onClick={() => handleNav("left")}
            isOverflowItems={props?.isOverflowItems || showLeftArrow || false}
            direction="left"
          >
            <ArrowLeft src={CarouselLeft} />
          </ArrowWrapper>
          <FilterLoader isLoading={isLoading}>
            <HorizontalLoader height={isMobileDevice() ? "300px" : "350px"} />
          </FilterLoader>
          <ScrollWrapper ref={navRef} horizontalLoader={isLoading}>
            {Component && typeof Component === "function" ? (
              <Component item={props?.item} navRef={props?.navRef} />
            ) : null}
          </ScrollWrapper>
          <ArrowWrapper
            onClick={() => handleNav("right")}
            isOverflowItems={props?.isOverflowItems || showRightArrow || false}
            direction="right"
          >
            <ArrowRight src={CarouselRight} />
          </ArrowWrapper>
        </ScrollRow>
      ) : props?.type === "ShopCardTwo" ? (
        <ShopContainerWrapper showContainer={!props?.globalFilterLoader}>
          <FilterLoader isLoading={props?.isStoreLoading || false}>
            <HorizontalLoader height="250px" />
          </FilterLoader>
          <ShopContainer horizontalLoader={props?.isStoreLoading || false}>
            {Component && typeof Component === "function" ? (
              <Component item={props?.item} cardRef={props?.ref} />
            ) : null}
          </ShopContainer>
        </ShopContainerWrapper>
      ) : (
        <>
          {props?.layout === "FilterCarousel" &&
            !props?.globalFilterLoader && 
            filterCarouselData &&
            filterCarouselData?.length > 0 &&
            filterCarouselData?.[0]?.facetDetails?.facetOptionValues?.length >
              0 && (
              <TextWrapper>
                <Text type="bold" variant="heading">
                  {filterCarouselData?.[0]?.facetDetails?.facetLabel || ""}
                </Text>
              </TextWrapper>
            )}
          {props?.globalFilterLoader ? (
            <Loader isLoading={props?.globalFilterLoader} />
          ) : filterCarouselData?.[0]?.facetDetails?.facetOptionValues?.length >
              0 || props?.isOrderCard ? (
            <ScrollRow>
              <ArrowWrapper
                onClick={() => handleNav("left")}
                isOverflowItems={
                  props?.isOverflowItems || showLeftArrow || false
                }
                direction="left"
              >
                <ArrowLeft src={CarouselLeft} />
              </ArrowWrapper>
              <ScrollWrapper ref={navRef} imageStyles={props?.imageStyles}>
                {props?.isOrderCard
                  ? filterCarouselData?.map((item, index) =>
                      props?.getItemImage(item.itemImageUrl) !== "" ? (
                        <FilterCardTwo
                          key={index}
                          showIcon={true}
                          tagIcon={props?.getItemImage(item?.itemImageUrl)}
                          imageStyles={props?.imageStyles}
                        />
                      ) : null
                    )
                  : filterCarouselData?.map((facets) =>
                      facets?.facetDetails?.facetOptionValues?.map(
                        (filItem, filIndex) => (
                          <FilterCardTwo
                            key={filIndex}
                            text={filItem?.displayLabel}
                            count={filItem?.count}
                            showIcon={true}
                            tagIcon={filItem?.image}
                            onClick={() =>
                              createFilterParams(
                                facets?.filterParam,
                                filItem?.value,
                                facets.isMultiSelect,
                                filItem?.isShowAll || false
                              )
                            }
                            clearFilter={() =>
                              createFilterParams(
                                facets?.filterParam,
                                filItem?.value,
                                facets.isMultiSelect,
                                filItem?.isShowAll || false
                              )
                            }
                            selected={props?.globalFilterParams[
                              facets?.filterParam
                            ]?.includes(filItem?.value)}
                            imageStyles={props?.imageStyles}
                            isShowAll={filItem?.isShowAll || false}
                            imageHover={filItem?.imageHover || ""}
                          />
                        )
                      )
                    )}
              </ScrollWrapper>
              <ArrowWrapper
                onClick={() => handleNav("right")}
                isOverflowItems={
                  props?.isOverflowItems || showRightArrow || false
                }
                direction="right"
              >
                <ArrowRight src={CarouselRight} />
              </ArrowWrapper>
            </ScrollRow>
          ) : (
            renderNoResultFound()
          )}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: visible;
`;

const TextWrapper = styled.div`
  color: ${colors?.text?.actionTextColor};
  font-size: 20px;
  padding: 24px 0px 8px 0px;

  @media ${device.laptop} {
    font-size: 32px;
    padding: 32px 0px 16px 0px;
  }
`;

const ScrollRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  overflow-y: visible;
`;
const FilterLoader = styled.div`
  display: ${({ isLoading }) => (isLoading ? "flex" : "none")};
  width: 100%;
  justify-content: center;
`;
const ScrollWrapper = styled.div`
  display: ${({ horizontalLoader }) => (horizontalLoader ? "none" : "flex")};
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  gap: 24px;
  width: 100%;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ArrowWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-100%)
    translateX(${({ direction }) => (direction === "left" ? "-60%" : "60%")});
  ${({ direction }) => (direction === "left" ? "left: 0;" : "right: 0;")}

  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  display: ${({ isOverflowItems }) => (isOverflowItems ? "flex" : "none")};

  @media ${device.laptop} {
    transform: translateY(-100%)
      translateX(${({ direction }) => (direction === "left" ? "-75%" : "75%")});
  }
`;

const ArrowLeft = styled.img``;
const ArrowRight = styled.img``;

const ShopContainer = styled.div`
  display: ${({ horizontalLoader }) => (horizontalLoader ? "none" : "flex")};
`;

const NoResultFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  gap: 8px;
`;

const NoResultImageContainer = styled.img`
  width: 200px;
  height: auto;
  margin: 0 auto;

  @media ${device.laptop} {
    width: 300px;
    height: auto;
  }
`;

const NoResultContent = styled.div`
  color: ${colors?.text?.actionTextColor};
  font-size: 14px;

  @media ${device.laptop} {
    font-size: 18px;
  }
`;

const NoResultTitle = styled.div`
  color: ${colors?.text?.actionTextColor};
  font-size: 18px;

  @media ${device.laptop} {
    font-size: 24px;
  }
`;

const ShopContainerWrapper = styled.div`
  display: ${({ showContainer }) => (showContainer ? "flex" : "none")};
`;

export default FilterCarousel;
