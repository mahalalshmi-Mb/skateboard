import React, { useState, useEffect } from "react";
import CategoryList from "pages/laxHomepage/components/CategoryList";
import styled from "styled-components";
import Text from "components/atoms/Text";
import config, { channel } from "../../../../commons/config";
import callAPI from "../../../../commons/callAPI";
import PushAlert from "../../../../components/atoms/pushAlert";
import { colors } from "theme/colors";

const Experience = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [banner, setBanner] = useState("");
  const [contentList, setContentList] = useState({});

  useEffect(() => {
    getPageLayout();
  }, [window.location.pathname]);

  const getPageLayout = async () => {
    try {
      let apiURL = config.api.products.landingPageConstruct;
      const response = await callAPI.get(apiURL, {
        channel: channel,
        page: "Experience",
      });
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        regResponse?.data?.sections?.forEach((x) =>
          getPageData(
            x.displayCollectionId,
            x.filterComponentId,
            x.sectionComponent.name
          )
        );
      } else {
        PushAlert.error("Page layout not found");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPageData = async (
    displayCollectionId,
    filterComponentId,
    sectionFilterData
  ) => {
    try {
      let apiURL = config.api.products.displayCollection;
      let reqBody = {};
      reqBody = {
        collectionId: displayCollectionId,
        filterComponentId: filterComponentId,
        ...sectionFilterData,
      };
      const response = await callAPI.get(apiURL, reqBody);
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        if (sectionFilterData === "Grid Section") {
          setCategoryList(regResponse?.data?.items?.data);
        } else if (sectionFilterData === "BannerSection") {
          const data =
            regResponse?.data?.items?.data?.attributes?.Images?.data || [];
          const banner = data.map(
            (item) => item?.attributes?.formats?.large?.url
          );
          setBanner(banner);
        } else if (sectionFilterData === "InformationalSection") {
          setContentList(regResponse?.data?.items?.data?.attributes);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Container>
        <Banner src={banner} />
        <Ticket
          src={contentList?.image?.data[0]?.attributes?.formats?.small?.url}
        />
        <Title>{contentList?.name}</Title>
        <Content>
          {contentList?.Body?.split("\n").map((line, index) => (
            <Text key={index} style={{ marginBottom: "20px" }}>
              {line}
            </Text>
          ))}
        </Content>
        <SubTitle>{contentList?.html}</SubTitle>
        <Categorycontainer>
          <CategoryList data={categoryList} isExperience={true} />
        </Categorycontainer>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Banner = styled.img`
  width: 100%;
  height: auto;
  padding: 0px 200px;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    padding: 0px 20px;
  }
`;
const Categorycontainer = styled.div`
  align-items: center;
`;
const Title = styled.div`
  font-size: 3rem;
  color: ${colors?.text?.black200};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    padding: 12px 42px;
    text-align: center;
    line-height: 46px;
  }
`;
const Content = styled.div`
  color: ${colors?.text?.black300};
  font-weight: 400;
  text-align: center;
  font-size: 20px;
  padding: 24px 60px;

  @media (max-width: 768px) {
    padding: 0px 28px;
  }
`;
const SubTitle = styled.div`
  color: ${colors?.text?.black200};
  font-weight: 500;
  font-size: 2rem;
  text-decoration: underline;
`;
const Ticket = styled.img`
  width: 143px;
  height: 154px;
  margin-bottom: 80px;

  @media (max-width: 425px) {
    width: 143px;
    height: 154px;
    margin-bottom: 50px;
  }
`;

export default Experience;
