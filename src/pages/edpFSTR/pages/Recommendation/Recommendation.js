import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import CustomModal from "../../../../containers/customModal/customModal";
import MenuItem from "../../components/molecules/MenuItem";
import Cross from "../../../../components/molecules/BottomDrawer/assets/cross.svg";
import BottomDrawer from "components/molecules/BottomDrawer/BottomDrawer";
import { isDesktopDevice, device } from "commons/util/helperFunctions";

function RecommendationModal({
  recommendationModal,
  setRecommendationModal,
  recommendationList,
  selectedRecommendationItemId,
  setSelectedRecommendationItemId,
  setShowDetailModal,
  setShowCustomisationModal,
  showRepeatSelectionModal,
  setSelectedItemId,
  setShowRepeatSelectionModal,
  setChangeRepeatSelectionItem,
}) {
  const sheetRef = useRef();
  const [viewIndex, setViewIndex] = useState(0);

  useEffect(() => {
    return () => {
      setViewIndex(0);
    };
  }, []);

  const closeModal = () => {
    document.body.style.overflow = "auto";
    setViewIndex(0);
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    try {
      setRecommendationModal(false);
    } catch (e) {}
  };

  const renderContent = () => {
    return (
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{"Recommendations"}</ModalTitle>
          <ModalCloseIconContainer>
            <CloseIcon alt="close" src={Cross} onClick={() => closeModal()} />
          </ModalCloseIconContainer>
        </ModalHeader>
        <ModalContentContainer>
          {recommendationList?.map((item, index) => (
            <MenuItem
              key={item?.pDetails?._id || index}
              index={index}
              item={item?.pDetails}
              product={item?.pDetails}
              recommendationModal={recommendationModal}
              setRecommendationModal={setRecommendationModal}
              productId={item?.pDetails?._id}
              selectedItemId={selectedRecommendationItemId}
              setSelectedItemId={setSelectedItemId}
              ageVerificationReq={item?.pDetails?.ageVerificationRequired}
              setShowDetailModal={setShowDetailModal}
              setShowCustomisationModal={setShowCustomisationModal}
              showRepeatSelectionModal={showRepeatSelectionModal}
              setShowRepeatSelectionModal={setShowRepeatSelectionModal}
              setChangeRepeatSelectionItem={setChangeRepeatSelectionItem}
            />
          ))}
        </ModalContentContainer>
      </ModalContainer>
    );
  };

  if (isDesktopDevice()) {
    return (
      <CustomModal
        isOpen={recommendationModal}
        boxStyle={{
          maxWidth: recommendationList?.length <= 1 ? "fit-content" : "700px",
          maxHeight: "600px",
          overflow: "visible",
        }}
        modalStyle={{ zIndex: 999999 }}
      >
        <CustomModalContainer>
          <CustomModalCloseIconContainer>
            <CloseIcon alt="close" src={Cross} onClick={(e) => closeModal()} />
          </CustomModalCloseIconContainer>
          <CustomModalContentContainer>
            {renderContent()}
          </CustomModalContentContainer>
        </CustomModalContainer>
      </CustomModal>
    );
  } else {
    return (
      <BottomDrawer
        isOpen={recommendationModal}
        setIsOpen={setRecommendationModal}
        sheetRef={sheetRef}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag={true}
        handleClose={closeModal}
        hideCloseIcon={viewIndex === 2}
        title="Recommendations"
      >
        <DrawerContainer>
          <DrawerContentContainer>{renderContent()}</DrawerContentContainer>
        </DrawerContainer>
      </BottomDrawer>
    );
  }
}

const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ModalHeader = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
`;

const ModalTitle = styled.div`
  font-size: 26px;
  font-weight: 600;
  line-height: 32.78px;
  text-align: left;
`;

const ModalContentContainer = styled.div`
  margin: 24px 0px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  justify-content: flex-start;
  scrollbar-width: none;
  padding-left: 24px;

  @media ${device.tablet} {
    justify-content: space-evenly;
    padding-left: 0px;
  }
`;

const ModalCloseIconContainer = styled.div`
  z-index: 9999;
`;

const CloseIcon = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const DrawerContentContainer = styled.div`
  width: 100%;
  height: calc(100% - 40px - 53px - 20px);
`;
const CustomModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const CustomModalContentContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px;
`;
const CustomModalCloseIconContainer = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
`;

export default RecommendationModal;
