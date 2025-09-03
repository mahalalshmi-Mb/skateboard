export const getRoute = {
    Hotel: "080-Transit-Hotel",
    Lounge: "lounges",
  };
  
  export const renderImage = (source) => {
    if (source.includes(".")) {
      try {
        return require(`../assets/${source}`);
      } catch (error) {
        return source;
      }
    }
  };
  
  export const getRoomLingo = (pageType) => {
    return pageType === "Hotel" ? "room" : "package";
  };
  