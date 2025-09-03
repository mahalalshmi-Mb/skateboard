import React from "react";
import Lottie from "react-lottie";
import { isMobile } from "react-device-detect";

function LottiePlayer(props) {
  return (
    <Lottie
      options={{
        loop: props.loop ? props.loop : true,
        autoplay: props.autoplay ? props.autoplay : true,
        animationData: isMobile ? props.mobileFile : props.desktopFile,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      }}
      height={props.height ? props.height : "100%"}
      width={props.width ? props.width : "100%"}
      style={props.styles}
    />
  );
}

export default LottiePlayer;
