import React, { useEffect, useState } from "react";

import htmlParse from "html-react-parser";
import { HashLink } from "react-router-hash-link";
import styled from "styled-components";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import { device } from "../../commons/util/helperFunctions";
import Text from "../../components/atoms/Text";
import Loader from "../../components/atoms/loader";
import MetaTags from "../../components/atoms/metaTags";
import { UnorderedList } from "../../theme/globalStyleSheet";
import "./styles.css";
import Util from "../../commons/util/util";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { PaddingWrapper } from "./style";

const Sitemaps = (props) => {
  const { returnRedirectUrl } = useCustomNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("");
  const [data, setData] = useState([]);
  const [tabData, setTabData] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      let apiURL = config.api.pages.replace("{{pageId}}", "sitemaps");
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (apiResponse.status === 200) {
        setData(regResponse);
        if (Util.getSlug(props.location.pathname) === "sitemaps") {
          setSelectedTab(regResponse.page_sub_menus[0].name);
        } else {
          setSelectedTab(Util.getSlug(props.location.pathname));
        }
        setSelectedTab(regResponse.page_sub_menus[0].name);
        setTabData(regResponse.page_sub_menus[0].html);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {!isLoading ? (
        <>
          <MetaTags data={data} />

          <PageWrapper className="sitemaps">
            <TabsWrapper>
              <Tabs>
                {data.page_sub_menus.map((item, index) => (
                  <Tab
                    key={index}
                    onClick={() => {
                      setSelectedTab(item.name);
                      setTabData(item.html);
                    }}
                    isSelected={selectedTab === item.name}
                    style={{ cursor: "pointer" }}
                  >
                    <HashLink
                      to={returnRedirectUrl(
                        `/sitemaps/${item.name.replace(" ", "-").toLowerCase()}`
                      )}
                      style={{ color: "#273135" }}
                    >
                      <Text
                        type={selectedTab === item.name ? "bold" : "medium"}
                      >
                        {item.name}
                      </Text>
                    </HashLink>
                  </Tab>
                ))}
              </Tabs>
            </TabsWrapper>

            <TabContent>
              <ListContainer>{htmlParse(tabData)}</ListContainer>
            </TabContent>
          </PageWrapper>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

const PageWrapper = styled.div``;

const ListContainer = styled(UnorderedList)`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 16px;

  @media ${device.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${device.laptopL} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TabsWrapper = styled(PaddingWrapper)`
  box-shadow: 0 8px 6px -6px #0000001a;
  height: 50px;
  padding-right: 0px;
`;

const Tabs = styled(UnorderedList)`
  overflow-x: auto;
  overflow: -moz-scrollbars-none;
  white-space: nowrap;
  width: 100%;
  background: #fff;
  display: flex;
  height: 100%;
  list-style-type: none;
  max-width: 1140px;
  padding: 0;
  table-layout: fixed;
`;
const Tab = styled.li`
  border-bottom: ${({ isSelected }) => (isSelected ? "3px solid #006160" : "")};
  width: auto;
  align-items: center;
  color: #2c2c2c;
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 0 24px;
`;

const TabContent = styled(PaddingWrapper)`
  margin-top: 48px;
`;

export default Sitemaps;
