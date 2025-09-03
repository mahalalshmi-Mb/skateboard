import React from "react";
import ReactPlayer from "react-player";
import "./VideoPlayer.css";

function VideoPlayer(props) {
  return (
    <>
      <div className="react-video-player-container">
        <ReactPlayer
          url={props.url}
          controls={props.controls}
          playsinline={props.playsinline}
          {...props}
        />
      </div>
    </>
  );
}

export default VideoPlayer;
