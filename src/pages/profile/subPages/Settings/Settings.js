import React, { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { NavContext } from "../../../../context/navContext";
import { getUserInfo } from "../../../../commons/util/helperFunctions";
import Loader from "../../../../components/atoms/loader";
import {
  ContentContainer,
  OptionData,
  OptionSubTitle,
  OptionTitle,
  OptionsContainer,
  OptionsWrapper,
  PageTitle,
  PageWrapper,
  RightArrow,
} from "./style";
import Text from "../../../../components/atoms/Text";
import ArrowRight from "../../../../assets/images/profile/ArrowRightBlack.svg";
import DeleteAccountModal from "./components/DeleteAccountModal";
import { useHistory } from "react-router-dom";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";

function Settings(props) {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();
  const useNav = useContext(NavContext);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [showDeletionModal, setShowDeletionModal] = useState(false);

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

    getProfileInfo();

    return () => {
      useNav.showFooterNavs();
      useNav.showBottomNavs();
      useNav.hideHeaderGoBack();
    };
  }, []);

  const getProfileInfo = async () => {
    try {
      let apiData = await getUserInfo("both");
      let data = apiData.data;
      if (data) {
        setProfileData(data);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageWrapper>
        <ContentContainer>
          <PageTitle>
            <Text type="bold">Settings</Text>
          </PageTitle>
          <OptionsContainer>
            <OptionsWrapper
              onClick={() =>
                pushHistory("/travellers/profile/settings/communication")
              }
            >
              <OptionData>
                <OptionTitle>
                  <Text type="semi-bold">Communication Preferences</Text>
                </OptionTitle>
                <OptionSubTitle>
                  <Text>Enable/Disable forms of communication</Text>
                </OptionSubTitle>
              </OptionData>
              <RightArrow src={ArrowRight} />
            </OptionsWrapper>
          </OptionsContainer>
          <OptionsContainer>
            <OptionsWrapper onClick={() => setShowDeletionModal(true)}>
              <OptionData>
                <OptionTitle>
                  <Text type="semi-bold">Delete my Account</Text>
                </OptionTitle>
                <OptionSubTitle>
                  <Text>Permanently delete my account</Text>
                </OptionSubTitle>
              </OptionData>
              <RightArrow src={ArrowRight} />
            </OptionsWrapper>
          </OptionsContainer>
        </ContentContainer>
        {showDeletionModal && (
          <DeleteAccountModal
            isDrawerOpen={showDeletionModal}
            setIsDrawerOpen={setShowDeletionModal}
          />
        )}
      </PageWrapper>
    );
  }
}

export default Settings;
