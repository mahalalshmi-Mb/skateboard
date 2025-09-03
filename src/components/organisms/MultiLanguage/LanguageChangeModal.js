import { useEffect, useRef, useState } from "react";
import { isDesktop } from "react-device-detect";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import CloseIcon from "../../../assets/images/cart/closeIcon.svg";
import CustomModal from "../../../containers/customModal/customModal";
import { removeLocalStorage, setLocalStorage } from "../../../util/storageUtil";
import Text from "../../atoms/Text";
import BottomDrawer from "../../molecules/BottomDrawer/BottomDrawer";
import RadioButtonWithLabel from "../../molecules/RadioButtonWithLabel";

const english = [{ name: "English", prefix: "/" }];
const languages = [{ name: "Kannada (ಕನ್ನಡ)", prefix: "/kn" }];

export default function LanguageChangeModal({
  showLanguageChangeModal,
  setShowLanguageShowModal,
}) {
  const history = useHistory();
  const pathname = window.location.pathname;
  const sheetRef = useRef();

  const getSelectedLanguage = () => {
    const _selectedLanguage = languages.find((language) => {
      return pathname.startsWith(language.prefix);
    });
    return _selectedLanguage || english[0];
  };

  const [currentLanguage, setCurrentLanguage] = useState(getSelectedLanguage());
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  useEffect(() => {
    setCurrentLanguage(getSelectedLanguage());
  }, [pathname]);

  const closeModal = () => {
    if (isDesktop) {
      setShowLanguageShowModal(false);
      return;
    }
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    try {
      setShowLanguageShowModal(false);
    } catch (e) {}
  };

  const handleSelection = () => {
    let route = pathname.replace(currentLanguage.prefix, "");
    if (route.startsWith("/")) {
      route = route.replace("/", "");
    }
    if (selectedLanguage.prefix.endsWith("/")) {
      route = selectedLanguage.prefix + route;
    } else {
      route = selectedLanguage.prefix + `/${route}`;
    }
    closeModal();
    const languageCode = currentLanguage.prefix.replace("/", "");
    if (languageCode.length > 0) {
      setLocalStorage("langCode", languageCode);
    } else {
      removeLocalStorage("langCode");
    }
    window.location.href = route;
  };

  const getContent = () => {
    return (
      <>
        <ModalHeader>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              type="semi-bold"
              style={{
                fontSize: "24px",
                lineHeight: "32px",
              }}
            >
              Change Translation
            </Text>
            <img
              src={CloseIcon}
              alt="Close"
              style={{
                width: "22px",
                height: "22px",
                cursor: "pointer",
              }}
              onClick={closeModal}
            />
          </div>
          <Text
            style={{
              fontSize: "16px",
              lineHeight: "21px",
            }}
          >
            Choose a language of your preference
          </Text>
        </ModalHeader>
        <ModalContent>
          {[...english, ...languages].map((language, index) => (
            <RadioButtonWithLabel
              key={index}
              label={language.name}
              checked={selectedLanguage.name === language.name}
              onClick={() => setSelectedLanguage(language)}
            />
          ))}
        </ModalContent>
        <ModalFooter>
          <ChangeButton
            isDesktop={isDesktop}
            onClick={() => {
              handleSelection();
            }}
          >
            {isDesktop ? "Change" : "Proceed"}
          </ChangeButton>
        </ModalFooter>
      </>
    );
  };

  if (isDesktop) {
    return (
      <CustomModal
        isOpen={showLanguageChangeModal}
        modalStyle={{ zIndex: 999999 }}
        boxStyle={{
          display: "flex",
          flexDirection: "column",
          padding: "32px",
          gap: "24px",
        }}
      >
        {getContent()}
      </CustomModal>
    );
  } else {
    return (
      <BottomDrawer
        sheetRef={sheetRef}
        isOpen={showLanguageChangeModal}
        setIsOpen={setShowLanguageShowModal}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          gap: "32px",
        }}
        handleClose={closeModal}
        hideHeader={true}
      >
        {getContent()}
      </BottomDrawer>
    );
  }
}

const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChangeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  background-color: #0a6b71;
  cursor: pointer;
  border-radius: 100px;
  min-width: ${(props) => (props.isDesktop ? "208px" : "0")};
  width: ${(props) => (props.isDesktop ? "auto" : "100%")};

  font-family: Manrope;
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
  color: #ffffff;
`;
