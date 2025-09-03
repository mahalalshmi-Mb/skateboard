import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import config from "../../commons/config";
import Loader from "../atoms/loader";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function ItemWithLightBox(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [openGallerySingleImage, setOpenGallerySingleImage] = useState(false);
  const [triggerReRender, setTriggerReRender] = useState(false);
  const [dataLimit, setDataLimit] = useState(9);
  const [pageLimit, setPageLimit] = useState(9);

  const dataRestriction = () => {
    if (!props.isDesktop <= 767) {
      setDataLimit(3);
      setPageLimit(3);
    }
  };

  useEffect(() => {
    dataRestriction();
    getGalleryInfo();
  }, []);

  useEffect(() => {}, [triggerReRender]);

  const getGalleryInfo = () => {
    props.items.forEach((x) => {
      x.selected = false;
    });
    setData(props.items);
    setIsLoading(false);
  };

  function GalleryImages(props) {
    const handleSelection = (id) => {
      let subData = data;
      for (let x of subData) {
        if (x._id === id) {
          x.selected = x.selected == null ? true : !x.selected;
        } else {
          x.selected = false;
        }
      }
      setData(subData);
      setOpenGallerySingleImage(true);
    };
    return (
      <img
        src={config.imageUrlDomain.imageURL + props.data.url}
        className="gallery__image"
        alt="gallery image"
        key={props.data._id}
        onClick={() => handleSelection(props.data._id)}
      />
    );
  }

  const handleGalleryPreviousImage = () => {
    let subData = data;
    for (var i = 0; i < subData.length; i++) {
      if (subData[i].selected) {
        if (i !== 0) {
          subData[i].selected = false;
          subData[i - 1].selected = true;
        }
        break;
      }
    }

    setTriggerReRender(!triggerReRender);
    setData(subData);
  };

  const handleGalleryNextImage = () => {
    let subData = data;
    for (var i = 0; i < subData.length; i++) {
      if (subData[i].selected) {
        if (subData.length - 1 !== i) {
          subData[i].selected = false;
          subData[i + 1].selected = true;
        }
        break;
      }
    }

    setTriggerReRender(!triggerReRender);
    setData(subData);
  };

  const resetItems = () => {
    let subData = data;
    for (let x of subData) {
      x.selected = false;
    }
    setData(subData);
  };

  return (
    <>
      {!isLoading ? (
        <div
          className={`responsivegrid aem-GridColumn aem-GridColumn--default--12 ${props.className}`}
          style={props.style}
        >
          <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
            <div className="tabs aem-GridColumn aem-GridColumn--default--12">
              <div>
                <div className="component tabs__component">
                  <div className="container-fluid tabs__component--fullWidth">
                    <div className="row">
                      <div className="col-12">
                        <div>
                          <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
                            <div className="imagegallery aem-GridColumn aem-GridColumn--default--12">
                              <div className="component gallery item-lightbox">
                                <div className="container">
                                  <div className="row">
                                    <div
                                      className="gallery__images-wrapper"
                                      style={{ padding: "0px" }}
                                    >
                                      {
                                        <Pagination
                                          data={data}
                                          RenderComponent={GalleryImages}
                                          pageLimit={pageLimit}
                                          dataLimit={dataLimit}
                                          setDataLimit={setDataLimit}
                                        />
                                      }
                                      <div style={{ display: "none" }}>
                                        <div className="no__results">
                                          <div className="error__heading">
                                            <div className="error__image"></div>
                                            <p className="error__title">
                                              Clear Skies Here!
                                            </p>
                                          </div>
                                          <div className="error__body">
                                            <p className="error__subtitle"></p>
                                            <p className="error__description"></p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="pagination_wrapper">
                                      <div>
                                        <div className="pagination--links desktop-only"></div>
                                        <div className="mobile--only load-more">
                                          <p>Load More</p>
                                          <span className="loadmoreless_chevron down_arrow"></span>
                                        </div>
                                        <div className="mobile--only load-less">
                                          <p>Load Less</p>
                                          <span className="loadmoreless_chevron up_arrow"></span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="gallery__corousel-wrapper"
                                    style={
                                      openGallerySingleImage
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    <button
                                      className="gallery__corousel-close"
                                      onClick={() => {
                                        setOpenGallerySingleImage(false);
                                        resetItems();
                                      }}
                                    ></button>
                                    <div className="gallery__corousel-images-button-wrapper">
                                      <button
                                        className="gallery__corousel-previous-button"
                                        onClick={() =>
                                          handleGalleryPreviousImage()
                                        }
                                      ></button>
                                      <div className="gallery__corousel-images">
                                        {data.map((item, index) => (
                                          <TransformWrapper key={index}>
                                            <TransformComponent>
                                              <img
                                                src={
                                                  config.imageUrlDomain
                                                    .imageURL + item.url
                                                }
                                                alt="gallery"
                                                className={
                                                  item.selected
                                                    ? "gallery__image_large show"
                                                    : "gallery__image_large"
                                                }
                                              />
                                            </TransformComponent>
                                          </TransformWrapper>
                                        ))}
                                      </div>
                                      <button
                                        className="gallery__corousel-next-button"
                                        onClick={() => handleGalleryNextImage()}
                                      ></button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default ItemWithLightBox;
