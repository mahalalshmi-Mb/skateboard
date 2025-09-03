import React from "react";
import styled from "styled-components";
import HorzScrollContainer from "./HorzScrollContainer";
import TagButton from "../../components/molecules/TagButton";
import { setSessionStorage } from "../../../../util/storageUtil";
import CDPButton from "../../../../components/atoms/CDPButton";
import {
  device,
  isDesktopDevice,
} from "../../../../commons/util/helperFunctions";

function EmbeddedFilters(props) {
  const createFilterParams = (filterParam, filterValue, isMultiSelect) => {
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
  };

  return (
    <Wrapper
      style={{
        display: props.layout !== "MultilineEmbedded" ? "flex" : "block",
        width: "fit-content",
        minWidth: "fit-content",
        gap: props.layout !== "MultilineEmbedded" ? "12px" : "0px",
      }}
    >
      {props?.data?.map((facets, index) => (
        <>
          <HorzScrollContainer
            key={index}
            style={{
              paddingLeft:
                index === 0
                  ? isDesktopDevice()
                    ? "136px"
                    : "12px"
                  : props.layout !== "MultilineEmbedded"
                  ? "0px"
                  : isDesktopDevice()
                  ? "148px"
                  : "24px",
              width: "fit-content",
              minWidth: "fit-content",
            }}
          >
            {facets?.facetDetails?.facetOptionValues?.map(
              (filItem, filIndex) => (
                <CDPButton
                  onClick={() => {
                    return createFilterParams(
                      facets?.filterParam,
                      filItem?.value,
                      facets.isMultiSelect
                    );
                  }}
                >
                  <TagButton
                    key={filIndex}
                    text={filItem?.displayLabel}
                    showIcon={filItem?.image && filItem?.image !== ""}
                    tagIcon={filItem?.image}
                    // onClick={() =>
                    //   createFilterParams(facets?.filterParam, filItem?.value, facets.isMultiSelect)
                    // }
                    clearFilter={() =>
                      createFilterParams(
                        facets?.filterParam,
                        filItem?.value,
                        facets.isMultiSelect
                      )
                    }
                    selected={props?.globalFilterParams[
                      facets?.filterParam
                    ]?.includes(filItem?.value)}
                  />
                </CDPButton>
              )
            )}
          </HorzScrollContainer>
          {index !== props?.data?.length - 1 &&
            facets?.facetDetails?.facetOptionValues?.length > 1 &&
            props.layout === "MultilineEmbedded" && <Divider />}
        </>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;
const Divider = styled.div`
  margin: 16px 24px 24px 24px;
  opacity: 0.1;
  border: 1px solid #000000;

  @media ${device.laptop} {
    margin: 16px 136px 24px 136px;
  }
`;
export default EmbeddedFilters;
