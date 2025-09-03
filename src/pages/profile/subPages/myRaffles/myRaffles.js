import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import { NavContext } from "../../../../context/navContext";
import raffleImage from "./assets/images/raffle.svg";
import {
  BumperImage,
  BumperInfo,
  BumperLayout,
  BumperTitle,
  DailyImage,
  DailyInfo,
  DailyLayout,
  Header,
  InfoLayout,
  InfoText,
  RaffleCount,
  RaffleImage,
  RaffleText,
  RaffleTextWrapper,
  RafflesWrapper,
  UserInfoLabel,
  UserInfoLayout,
  UserName,
  Wrapper,
} from "./style";
import "./style.css";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";

function MyRaffles(props) {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();
  const useNav = useContext(NavContext);
  const [cookies] = useCookies(["gwLoginData"]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [rafflesData, setRafflesData] = useState([]);

  useEffect(() => {
    useNav.hideFooterNavs();
    useNav.showHeaderGoBack();
    return () => {
      useNav.showFooterNavs();
      useNav.hideHeaderGoBack();
    };
  }, []);

  useEffect(() => {
    if (getAppConfig("RAFFLE_PROFILE_PAGE_ENABLED") && isMobile) {
      getPageData();
    } else {
      pushHistory("/travellers/profile");
    }
  }, []);

  const getRafflesData = async (user_id) => {
    try {
      let apiURL = config.api.getRaffles.replace("{{user_id}}", user_id);
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (apiResponse.status === 200) {
        setIsLoading(false);
        setRafflesData(regResponse);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPageData = async () => {
    try {
      let apiURL = config.api.pages.replace(
        "{{pageId}}",
        "raffle-profile-page"
      );
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (apiResponse.status === 200) {
        setData(regResponse);
        if (cookies?.gwLoginData?.userId)
          getRafflesData(window.atob(cookies?.gwLoginData?.userId));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const redirectAction = (link) => {
    window.open(link, "_blank");
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <Wrapper>
        {rafflesData && rafflesData?.length > 0 ? (
          <>
            <Header>
              <Text>{data?.description}</Text>
            </Header>
            {rafflesData &&
              rafflesData?.length > 0 &&
              rafflesData?.map((item) => (
                <RafflesWrapper index={item?.regId}>
                  <RaffleImage
                    bkImage={raffleImage}
                    onClick={(e) => {
                      redirectAction(item?.raffleUrl);
                    }}
                  >
                    <RaffleTextWrapper>
                      <RaffleText>
                        <Text type="bold">Raffles</Text>
                      </RaffleText>
                      <RaffleCount>
                        <Text type="bold">{item?.raffleCount}</Text>
                      </RaffleCount>
                      <RaffleText>
                        <Text type="bold">Raffles</Text>
                      </RaffleText>
                    </RaffleTextWrapper>
                    <UserInfoLayout>
                      <UserInfoLabel>
                        <Text>{data?.name}</Text>
                      </UserInfoLabel>
                      <UserName>
                        <Text type="bold">{item?.userName}</Text>
                      </UserName>
                    </UserInfoLayout>
                  </RaffleImage>
                  <InfoLayout>
                    <InfoText>
                      <Text>
                        {data?.sub_menus?.[0]?.group}
                        {item?.regAmount}
                      </Text>
                    </InfoText>
                    <InfoText>
                      <Text>{data?.sub_menus?.[0]?.description}</Text>
                    </InfoText>
                  </InfoLayout>
                </RafflesWrapper>
              ))}

            <BumperLayout>
              <BumperTitle>
                <Text type="extra-bold">{data?.content_blocks?.[0]?.link}</Text>
              </BumperTitle>
              <BumperImage src={data?.content_blocks?.[0]?.images?.[0]?.url} />
              <BumperInfo>
                <Text>{data?.content_blocks?.[0]?.redirectLink}</Text>
              </BumperInfo>
            </BumperLayout>
            <div className="daily-prize-layout">
              <DailyLayout>
                {data?.content_blocks?.[1]?.images &&
                  data?.content_blocks?.[1]?.images?.length > 0 &&
                  data?.content_blocks?.[1]?.images?.map((item) => (
                    <DailyImage src={item?.url} />
                  ))}
              </DailyLayout>
            </div>

            <DailyInfo>
              <Text>{data?.content_blocks?.[1]?.link}</Text>
            </DailyInfo>
          </>
        ) : (
          <>
            <div
              className="no__results"
              style={{
                display: "block",
                padding: "20px",
                margin: "20px 30px 0 0",
              }}
            >
              <div className="error__heading">
                <div className="error__image"></div>
                <p className="error__title">
                  Unfortunately, we do not have any raffles at this time for you{" "}
                </p>
              </div>
              <div className="error__body">
                <p className="error__subtitle"></p>
                <p className="error__description"></p>
              </div>
            </div>
          </>
        )}
      </Wrapper>
    );
  }
}

export default MyRaffles;
