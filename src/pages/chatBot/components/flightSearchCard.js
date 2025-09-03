import React, {useEffect, useState} from  "react";
import Select from "react-select";
import { getAirportData } from "components/molecules/airlineService/airlineService";
import arrowsRefactored from "../assets/arrows-refactored.png"


export const FlightSearchCard =({searchByOriginDestination}) => {

    const [arrivalPlace, setArrivalPlace] = useState();
    const [airportData, setAirportData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [disableSearch, setDisableSearch] = useState(true);
    const [isReversed, setIsReversed] = useState(false);

    const fetchAirportData = async () => {
        try {
          const response = await getAirportData();
          // Check if the response is an array and has data
          if (Array.isArray(response) && response.length > 0) {
            setAirportData(response); // Set the data if it's a non-empty array
          }
        } catch (error) {
          console.error("Failed to fetch airport data:", error);
        } finally {
          setIsLoading(false);
        }
      };
    
    useEffect(() => {
        fetchAirportData();
    },[])

    const onSelectArrival = (val) => {
        if (val === null) {
          setArrivalPlace(null);
          setDisableSearch(true)
        } else {
          setDisableSearch(false)
          setArrivalPlace(val);
        }
    }

    const searchFlights = () => {
      searchByOriginDestination(arrivalPlace, isReversed)
    }

    const toggleSourceAndDestination = () => {
      setIsReversed(!isReversed); // Toggle the positions
    };

    const renderSourceBox = () => {
      return(
        <div className="city"> Bengaluru (BLR) </div>        
      )
    }

    const renderDestinationBox = () => {
      return(        
        <div className="destination-select">
          <Select
            readOnly
            name="arrivalcity"
            menuPlacement="top" 
            className="basic-single"
            classNamePrefix="select"
            value={arrivalPlace}                        
            onChange={onSelectArrival}
            isClearable={true}
            placeholder="Arrival City"
            options={airportData}
            getOptionValue={(option) => `${option.code}`}
            getOptionLabel={(option) =>
              `${option.city} (${option.code}) `
            }
            isOptionDisabled={(option) =>
              option.code === arrivalPlace?.code
            }
            styles={{
              menu: (base, state) => ({
                ...base,
                width: "350px",
              }),
            }}
          />
        </div>
      )
    }

    return(         
        <div className="flight-search-container">
            <div className="source-box">
              <span className="label">Source</span>
              {isReversed ? renderDestinationBox() : renderSourceBox()}
            </div>            
            <div onClick={toggleSourceAndDestination} className="arrows-icon-box">
                <img src={arrowsRefactored} alt="arrows" width="20px" />            
            </div>    
            {isLoading ? "" : <div className="destination-box">
              <span className="label">Destination</span>
                {isReversed ? renderSourceBox() :renderDestinationBox()}
            </div> }                   
            <button disabled={disableSearch} onClick={searchFlights} className={`checkFlight disabled-${disableSearch}`}> Check Flights </button>
        </div>
    )
}
