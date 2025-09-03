/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import UnknownUserImage from "../../../assets/images/header/Profile-photo.svg";
import "./userInfo.css";
import Text from "../../../components/atoms/Text";
import useCustomNavigation from "../../../hooks/useCustomNavigation";

function UserInfo(props) {
  const rootPath = useRouteMatch();
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  const [image, setImage] = useState({
    preview: props.profileImageUrl,
    raw: "",
  });

  const handleImageChange = async (e) => {
    if (e.target.files.length > 0) {
      props.setRawInputImage(e.target.files[0]);
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  return (
    <div className="user-info-container">
      {props.caller === "personalDetails" && (
        <div
          className="back-to-profile"
          onClick={() => pushHistory(`/travellers/profile`)}
        >
          Back to <strong>My Profile</strong>
        </div>
      )}
      <div
        className={
          props.caller === "personalDetails"
            ? "user-info-wrapper-edit"
            : "user-info-wrapper"
        }
      >
        <div className={props.editMode ? "user-info-edit" : "user-info"}>
          <div className="user-image-container">
            <picture>
              <source
                media="(max-width: 767px)"
                className="user-image"
                srcSet={props.profileImageUrl}
                onError={(e) => {
                  e.target.src = UnknownUserImage;
                }}
              />
              <source
                media="(max-width: 991px)"
                className="user-image"
                srcSet={props.profileImageUrl}
                onError={(e) => {
                  e.target.src = UnknownUserImage;
                }}
              />
              <source
                media="(min-width: 992px)"
                className="user-image"
                srcSet={props.profileImageUrl}
                onError={(e) => {
                  e.target.src = UnknownUserImage;
                }}
              />
              <label>
                <div>
                  <img
                    className="user-image"
                    src={image.preview}
                    alt="My Profile Image"
                    onError={(e) => {
                      e.target.src = UnknownUserImage;
                    }}
                  />
                </div>
                {props.caller === "personalDetails" ? (
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                ) : null}
              </label>
            </picture>
          </div>
          <div
            className={
              props.editMode
                ? "user-data-container hide"
                : "user-data-container"
            }
          >
            <span className="user-name">
              <Text type="bold">{props.userName}</Text>
            </span>
            {props.caller !== "personalDetails" && (
              <span className="user-mobile-email">+{props.userContact}</span>
            )}
            {props.caller === "personalDetails" ? (
              <span
                className="edit-profile-link"
                onClick={() => {
                  props.setEditMode(true);
                  props.callbackOnEdit();
                }}
              >
                <Text type="bold">Edit Profile</Text>
              </span>
            ) : (
              <span
                className="complete-profile-link"
                onClick={() =>
                  pushHistory(`${rootPath.url}/personalDetails`, {
                    showEditMode: true,
                  })
                }
              >
                Complete Profile
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
