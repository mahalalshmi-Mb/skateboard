import React, { Fragment, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import alertCross from "../../assets/images/alertCross.png";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import { setUserPermission } from "../../commons/util/permissionsConfig";
import Util from "../../commons/util/util";
import CustomModal from "../customModal/customModal";
import CustomTextField from "./components/customTextField";
import PrimaryButton from "./components/primaryButton";
import { CartContext } from "../../context/cartContext";
import { FlightContext } from "../../context/FlightsContext";

const CredentialsSignIn = (props) => {
  const ClientCart = useContext(CartContext);
  const ClientFlight = useContext(FlightContext);
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleClose = () => {
    props.setIsOpen(false);
  };
  const handleCredentialSignIn = async () => {
    let source = "regular";
    if (localStorage.getItem("module")) source = localStorage.getItem("module");

    const data = {
      source,
      name: "signin",
    };
    const userAgentData = Util.getUserAgentData(data);

    let apiURL = `${config.api.login.local}${userAgentData}`;
    const userMetadata = Util.getUsermetaData();
    try {
      let apiResponse = await callAPI.patch(
        apiURL,
        {
          username,
          password,
          resource: "paxapp",
        },
        userMetadata
      );
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        await setUserPermission();
        await ClientCart.saveCart(true);
        // await ClientFlight.saveFlight();
        props.setIsOpen(false);
        props.setPrevIsOpen(false);
        history.go(0);
      }
    } catch (err) {
      console.log("error", err.response.status);
    }
  };
  return (
    <Fragment>
      <CustomModal {...props}>
        <div className="manual-signin-content">
          <span className="close-wrapper" onClick={() => handleClose()}>
            <img src={alertCross} alt="" style={{ height: 20, width: 20 }} />
          </span>
          <div className="content">
            <div className="title">Enter Credentials</div>

            <CustomTextField
              label="Enter email"
              fullWidth
              style={{ marginTop: 15 }}
              value={username}
              setValue={setUsername}
            />
            <CustomTextField
              label="Enter password"
              fullWidth
              style={{ marginTop: 15 }}
              value={password}
              setValue={setPassword}
            />
            <PrimaryButton
              style={{ marginTop: 25 }}
              onClick={handleCredentialSignIn}
            >
              Sign In
            </PrimaryButton>
            <div
              className="additional-option"
              style={{ marginTop: 10, marginLeft: 5 }}
              onClick={() => props.setIsOpen(false)}
            >
              or Sign in with number
            </div>
          </div>
        </div>
      </CustomModal>
    </Fragment>
  );
};

export default CredentialsSignIn;
