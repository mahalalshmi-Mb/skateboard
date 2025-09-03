import React from "react";
import Skeleton from "@mui/material/Skeleton";

function LoadingSkeleton(props) {
  return (
    <Skeleton
      variant={props.variant}
      width={props.width || "100%"}
      height={props.height || "100%"}
      sx={props.fontSize}
    />
  );
}

export default LoadingSkeleton;
