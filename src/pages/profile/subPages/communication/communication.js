import React, { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import Loader from "../../../../components/atoms/loader";
import Text from "../../../../components/atoms/Text";
import { NavContext } from "../../../../context/navContext";
import ChannelWrapper from "./components/ChannelWrapper";
import { ContentContainer, PageTitle, PageWrapper } from "./style";
import PushAlert from "../../../../components/atoms/pushAlert";

const Communication = () => {
  const useNav = useContext(NavContext);
  const [isLoading, setIsLoading] = useState(true);
  const [channelInterface, setChannelInterface] = useState();
  const [channelsData, setChannelsData] = useState();

  useEffect(() => {
    if (isMobile) {
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
      useNav.showHeaderGoBack();
    } else {
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
      useNav.hideHeaderGoBack();
    }

    getCommunicationChannels();

    return () => {
      useNav.showFooterNavs();
      useNav.showBottomNavs();
      useNav.hideHeaderGoBack();
    };
  }, []);

  const getCommunicationChannels = async () => {
    try {
      let apiURL = config.api.user.communication.channels;
      let apiResponse = await callAPI.get(apiURL);

      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        setChannelInterface(regResponse.metadata.interface);
        setChannelsData(regResponse.data);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const sendPreferenceMessage = async (channel, segment, flag) => {
    try {
      let apiURL = config.api.user.communication.preferences;
      let apiData = channelInterface;
      apiData[channel][segment] = flag;
      let apiResponse = await callAPI.put(apiURL, apiData);
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        PushAlert.success("Successfully updated!");
        getCommunicationChannels();
      } else {
        PushAlert.success("Something went wrong!");
      }
    } catch (e) {
      console.log(e);
      PushAlert.success("Something went wrong!");
    }
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageWrapper>
        <ContentContainer>
          <PageTitle>
            <Text type="bold">Communication</Text>
          </PageTitle>
          {channelsData.map((item) =>
            channelInterface[item.channel] ? (
              <ChannelWrapper
                key={item.channel}
                data={item}
                channelInterface={channelInterface}
                handleChange={sendPreferenceMessage}
              />
            ) : null
          )}
        </ContentContainer>
      </PageWrapper>
    );
  }
};

export default Communication;
