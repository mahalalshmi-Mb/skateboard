import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Text from "../../atoms/Text";
import "bootstrap/dist/css/bootstrap.min.css";
import "./removeFlightConfirmation.css";

function RemoveFlightConfirmation(props) {
  const [showRemoveFlightModal, setShowRemoveFlightModal] = useState(true);

  const handleModalClose = () => {
    props.onClose();
    setShowRemoveFlightModal(false);
  };

  return (
    <Modal
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        height: "260px",
        background: "none",
      }}
      show={showRemoveFlightModal}
      onHide={() => setShowRemoveFlightModal(false)}
      className="remove-flight-modal"
    >
      <div className="remove-flights">
        <div className="modal-content-container">
          <div className="remove-flights-modal-header">
            <Text type="bold">Remove Flight</Text>
          </div>
          <div className="remove-flights-modal-content">
            <Text type="regular">
              {props.modalText ||
                `You have some items in your cart that are mapped to this flight.
              Removing this flight will remove those items from your cart. Do
              you wish to continue?`}
            </Text>
          </div>
          <div
            className="action-buttons-container"
            style={{ width: "100%", marginTop: "1rem" }}
          >
            <div className="transit-submit-button-container">
              <button
                className="transit-submit-button"
                onClick={() => props.handleRemoveFlight()}
              >
                <Text type="bold">Yes</Text>
              </button>
            </div>
            <div className="transit-submit-button-container">
              <button
                className="remove-flight-cancel-button"
                onClick={() => handleModalClose()}
              >
                <Text type="bold">No</Text>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default RemoveFlightConfirmation;
