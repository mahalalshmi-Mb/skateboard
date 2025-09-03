import React, { useState } from "react";

function TransportCard(props) {
  const [viewStopsModalOpen, setViewStopsModalOpen] = useState(false);
  return (
    <>
      <div
        className={`search__by__route__results search__by__route__results_${
          props.index + 1
        }`}
      >
        <div className="row showhide">
          <div className="col-12">
            <p className="search__by__route__originText">
              <span className="originTxt__width">Origin</span>
              <span>{props.item.origin}</span>
            </p>
            <p className="search__by__route__destinationText">
              <span>Destination</span>
              <span>{props.item.destination}</span>
            </p>
            <p className="search__by__route__timeGap">
              {`Next bus from origin in ${
                Math.floor(props.item.closestTime[0] / 60) > 0
                  ? `${Math.floor(props.item.closestTime[0] / 60)} hour(s)`
                  : ``
              } ${Math.floor(props.item.closestTime[0] % 60)} min(s)`}
            </p>
          </div>
        </div>
        <div className="row showhide bmtcSection">
          <div className="col-12 col-md-12 col-lg-6">
            <table className="search__by__route__timetable_1 timetable__styling">
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
            <table className="search__by__route__numbers mobile__hide">
              <thead>
                <tr>
                  <th>No. Of Stops</th>
                  <th>Journey distance</th>
                  <th>Fare</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="no__of__routes_1">
                    <p>
                      <span>{props.item.viastations.length}</span>
                    </p>
                    <a
                      className="view__routes"
                      onClick={() => setViewStopsModalOpen(true)}
                    >
                      View all stops
                    </a>
                  </td>
                  <td>{props.item.distance}km</td>
                  <td>Rs. {props.item.fare}</td>
                </tr>
              </tbody>
            </table>
            <div className="col-12 search__by__route__numbers__mobile mobile__show">
              <p>No. Of Stops</p>
              <p className="no__of__routes_1">
                <span>
                  <span>{props.item.viastations.length}</span>
                </span>
                <a
                  onClick={() => setViewStopsModalOpen(true)}
                  className="view__routes"
                >
                  View all stops
                </a>
              </p>
              <p>Journey distance</p>
              <p>{props.item.distance} km</p>
              <p>Fare</p>
              <p>Rs. {props.item.fare}</p>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-6 vayu__vajra__contact__details">
            <div className="vayu__vajra__contact__heading">
              <p> BMTC Contact Details</p>
              <div className="vayu__vajra__contact__info  contact__info__1">
                <p className="vayu__vajra__contact__text title__text__1">
                  <span>BMTC airport kiosk information</span>
                </p>
                <p className="vayu__vajra__phone__details__1 phone__numbers">
                  <p>+91-8027607989</p>
                  <p>+91-7760991269</p>
                </p>
                <p className="vayu__vajra__contact__email">
                  ctmobmtc@gmail.com
                </p>
              </div>
              <div className="vayu__vajra__contact__info  contact__info__2">
                <p className="vayu__vajra__contact__text title__text__2">
                  <span>BMTC, Kempegowda Bus Stand</span>
                </p>
                <p className="vayu__vajra__phone__details__2 phone__numbers">
                  <p>+91-8022952311</p>
                  <p>+91-8022952314</p>
                </p>
              </div>
              <div className="vayu__vajra__contact__info  contact__info__3">
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
        style={{ zIndex: "9999" }}
        id="vayuVajraSearchByRoute"
        tabindex="-1"
        role="dialog"
        aria-labelledby="mySmallModalLabel"
        aria-hidden="true"
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
                <p className="search__by__route__originText">
                  <span className="originTxt__width">Origin</span>{" "}
                  <span>{props.item.origin}</span>
                </p>
                <p className="search__by__route__destinationText">
                  <span>Destination</span> <span>{props.item.destination}</span>
                </p>
              </div>
              <p className="modal-body-bus-routes">Bus Stops</p>
              <div className="all__bus__routes all__bus__routes__1">
                {props.item.origin === props.item.viastations[0].stopName
                  ? props.item.viastations.map((stopItem, stopIndex) => (
                      <p
                        key={stopIndex}
                        className={
                          stopIndex === 0 ||
                          stopIndex === props.item.viastations.length - 1
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
                            stopIndex === 0 ||
                            stopIndex === props.item.viastations.length - 1
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

export default TransportCard;
