import React, { useState } from "react";

function TransportStopsCard(props) {
  const [viewStopsModalOpen, setViewStopsModalOpen] = useState(false);
  const [collapseCard, setCollapseCard] = useState(false);

  return (
    <>
      <div
        className={`search__by__stop__results search__by__stop__results_${
          props.index + 1
        }`}
      >
        <div className="row result__header">
          <div className="col-12">
            <a className="search__by__stop__heading search__by__route__heading__opened">
              Route - {props.item.serviceName}
              <span
                className={
                  collapseCard
                    ? "faq__toggle--arrow faq__icons-up"
                    : "faq__toggle--arrow faq__icons-down"
                }
                aria-hidden="true"
                onClick={() => setCollapseCard(!collapseCard)}
              ></span>
            </a>
          </div>
        </div>
        <div
          className="row showhide"
          style={collapseCard ? { display: "none" } : {}}
        >
          <div className="col-12">
            <p className="search__by__stop__originText faq__inner">
              <span className="originTxt__width">Origin</span>
              <span>{props.item.origin}</span>
            </p>
            <p className="search__by__stop__destinationText faq__inner">
              <span>Destination</span>
              <span>{props.item.destination}</span>
            </p>
          </div>
        </div>
        <div
          className="row faq__inner showhide bmtcSection"
          style={collapseCard ? { display: "none" } : {}}
        >
          <div className="col-12 col-md-12 col-lg-6 ">
            <table className="search__by__stop__timetable_1 timetable__styling">
              <thead>
                <tr>
                  <th>Departure</th>
                  <th>Arrival</th>
                </tr>
              </thead>
              <tbody>
                {props.item.departureTime.map((item, index) => (
                  <tr key={index}>
                    <td>{item}</td>
                    <td>{props.item.arrivalTime[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="search__by__stop__numbers mobile__hide">
              <thead>
                <tr>
                  <th>No. Of Stops</th>
                  <th>Journey distance</th>
                  <th>Fare</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="no__of__stops_1">
                    <p>
                      <span>{props.item.viastations.length}</span>
                    </p>
                    <a
                      className="view__stops"
                      onClick={() => setViewStopsModalOpen(true)}
                    >
                      View all stops
                    </a>
                  </td>
                  <td>{props.item.distance} km</td>
                  <td>Rs. {props.item.fare}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-12 search__by__stop__numbers__mobile mobile__show">
            <p>No. Of Stops</p>
            <p className="no__of__stops_1">
              <span>
                <span>{props.item.viastations.length}</span>
              </span>
              <a
                className="view__stops"
                onClick={() => setViewStopsModalOpen(true)}
              >
                View all stops
              </a>
            </p>
            <p>Journey distance</p>
            <p>{props.item.distance} km</p>
            <p>Fare</p>
            <p>Rs. {props.item.fare}</p>
          </div>
          <div className="col-12 col-md-12 col-lg-6 vayu__vajra__contact__details">
            <div className="vayu__vajra__contact__heading">
              <p>BMTC Contact Details</p>
              <div className="vayu__vajra__contact__info contact__info__1">
                <p className="vayu__vajra__contact__text title__text__1">
                  <span>BMTC airport kiosk information</span>
                </p>
                <p className="vayu__vajra__phone__details__1 phone__numbers">
                  <p>+91-7760991269</p>
                  <p>+91-8027607989</p>
                </p>
                <p className="vayu__vajra__contact__email">
                  ctmobmtc@gmail.com
                </p>
              </div>
              <div className="vayu__vajra__contact__info contact__info__2">
                <p className="vayu__vajra__contact__text title__text__2">
                  <span>BMTC, Kempegowda Bus Stand</span>
                </p>
                <p className="vayu__vajra__phone__details__2 phone__numbers">
                  <p>+91-8022952311</p>
                  <p>+91-8022952314</p>
                </p>
              </div>
              <div className="vayu__vajra__contact__info contact__info__3">
                <p className="vayu__vajra__contact__text title__text__3">
                  <span>BMTC, Shivajinagar Bus Stand</span>
                </p>
                <p className="vayu__vajra__phone__details__3 phone__numbers">
                  <p>+91-8022952321</p>
                  <p>+91-8022952324</p>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={viewStopsModalOpen ? "modal modal__show" : "modal"}
        id="vayuVajraSearchByStop"
        style={{ zIndex: "9999" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-body-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={() => setViewStopsModalOpen(false)}
                >
                  ×
                </button>
                <p className="search__by__stop__originText faq__inner">
                  <span className="originTxt__width">Origin</span>
                  <span>{props.item.origin}</span>
                </p>
                <p className="search__by__stop__destinationText faq__inner">
                  <span>Destination</span> <span>{props.item.destination}</span>
                </p>
                <p className="modelNoOfStops_1">
                  <span className="stopTxt__width">No. Of Stops</span>
                  <span>{props.item.viastations.length}</span>
                </p>
              </div>
              <p className="modal-body-bus-stops">Bus Stops</p>
              <div className="all__bus__stops all__bus__stops__1">
                {props.item.origin === props.item.viastations[0].stopName
                  ? props.item.viastations.map((stopItem, stopIndex) => (
                      <p
                        key={stopIndex}
                        className={
                          props.origin === stopItem.stopId ||
                          props.destination === stopItem.stopId
                            ? "blue__dot"
                            : ""
                        }
                      >
                        <span>{stopItem.stopName}</span>
                      </p>
                    ))
                  : props.item.viastations
                      .slice(0)
                      .reverse()
                      .map((stopItem, stopIndex) => (
                        <p
                          key={stopIndex}
                          className={
                            props.origin === stopItem.stopId ||
                            props.destination === stopItem.stopId
                              ? "blue__dot"
                              : ""
                          }
                        >
                          <span>{stopItem.stopName}</span>
                        </p>
                      ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransportStopsCard;
