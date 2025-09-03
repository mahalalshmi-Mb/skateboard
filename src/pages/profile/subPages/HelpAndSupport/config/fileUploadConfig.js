const fileUploadConfig = {
  image: [".jpg", ".jpeg", ".png", ".svg", ".mov", ".mp4"],
  excel: [".xls", ".xlsx"],
  maxImageSize: 25, //in MB
  maxImageDimensions: {
    //Width and height are in px, allowed variation is in percentage
    image: {
      limit: 6,
    },
  },
};

export default fileUploadConfig;
