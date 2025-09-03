import React, { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import upload from "../../../../../assets/images/upload.png";

export default function FileInput(props) {
  const [fileName, setFileName] = useState(props.filename);
  const [fileNames, setFileNames] = useState([]);
  let fileInput = useRef();

  const fileChangeEvent = async (e) => {
    const files = e.target.files;
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    if (props.multiple) {
      files.length &&
        setFileNames((arr) => {
          for (const file of files) {
            arr.push(file.name);
          }
          return arr;
        });
      //   let compressedFileArray = [];
      //   for (const file of files) {
      //     const compressedFile = await imageCompression(file, options);
      //     compressedFileArray.push(compressedFile);
      //   }
      files.length && props.setFile && props.setFile(files);
    } else {
      files.length && setFileName(files[0].name);
      //   const compressedFile = await imageCompression(files[0], options);
      files.length && props.setFile && props.setFile(files[0]);
    }
    e.preventDefault();
    props.handleFeaturethumbnail(e);
    e.target.value = "";
  };

  useEffect(() => {}, [fileName, fileNames]);

  return (
    <div style={fiStyle.fiContainer} className={props.className}>
      <div style={fiStyle.displayText}>
        <div style={fiStyle.bannerPlaceholder}>Choose An Image</div>
        {props.isMultiselect ? (
          fileNames.forEach((name) => {
            name ? (
              <div style={fiStyle.fileToUpload}>{name}</div>
            ) : (
              <div style={fiStyle.fileToUpload}>{name}</div>
            );
          })
        ) : fileName ? (
          <div style={fiStyle.fileToUpload}></div>
        ) : (
          <div style={fiStyle.fileToUpload}></div>
        )}
        <div style={fiStyle.uploadIcon}>
          <img src={upload} alt="upload-icon" style={fiStyle.uploadIcon} />
        </div>
      </div>
      <input
        type="file"
        name="file"
        ref={(fi) => (fileInput = fi)}
        style={fiStyle.input}
        onChange={fileChangeEvent}
        accept={props.allowedExt ? props.allowedExt.join(",") : "*.*"}
        multiple={props.multiple}
      />
    </div>
  );
}

const fiStyle = {
  fiContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    border: "1px solid #e9e9e9",
    borderRadius: "3pt",
    backgroundColor: "#fff",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  displayText: {
    position: "absolute",
    color: "#828282",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
    padding: "0px 16px",
  },
  uploadIcon: {
    width: "24px",
    height: "24px",
  },
  input: {
    position: "absolute",
    marginTop: "-2rem",
    marginLeft: "10px",
    width: "calc(20rem - 20px)",
    height: "10rem",
    display: "block",
    cursor: "pointer",
    outline: "none",
  },
  fileToUpload: {
    fontWeight: "bold",
    color: "#000",
  },
  bannerPlaceholder: {},
};
