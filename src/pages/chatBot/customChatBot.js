import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import moment from "util/momentWrapper";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import LottiePlayer from "../../components/atoms/lottiePlayer";
import arrowRight from "./assets/arrorRight.png";
import bnglreAirport from "./assets/BnglrAirport.jpg";
import closeBtn from "./assets/closebtn.svg";
import loaderAnimate from "./assets/loaderAnimate.json";
import ribbonData from "./assets/ribbonData.json";
import robotAnimate from "./assets/robotAnimate.json";
import robotIcon from "./assets/robotIcon.png";
import sendIcon from "./assets/sendIcon.png";
import { FlightInformationCard } from "./components/FlightInformationCard";
import { FlightSearchCard } from "./components/flightSearchCard";
import "./customChatBot.css";

export default function CustomChatBot() {
  const [chatBotViewType, setChatBotViewType] = useState("animatedBot");
  const [isStarted, setIsStarted] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [chatData, setChatData] = useState([]);
  const [loadingChatMsg, setLoadingChatMsg] = useState(true);
  const [selectedRibbonData, setSelectedRibbonData] = useState([]);
  const [isFlightSearchCard, setIsFlightSearchCard] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const chatWrapRef = useRef(null);
  const inputRef = useRef(null);
  const trendingWrapRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const widget = document.getElementById("corover-cb-widget");
      if (widget) {
        widget.classList.add("coroverAvtr");

        setTimeout(() => {
          widget.classList.remove("coroverAvtr");
        }, 1000); // Remove the class after 1 second
      }
    }, 6000); // Repeat every 6 seconds
    setSelectedRibbonData(ribbonData.options);
    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Scroll to the left whenever ribbonData changes
    handleScroll("start");
  }, [navigationHistory]);

  useEffect(() => {
    // Scroll to the bottom whenever chatData changes
    scrollChatScreen("bottom");
  }, [chatData]);

  const onChatIconClick = () => {
    setChatBotViewType("botMsgView");
  };

  const scrollChatScreen = (scrollTo) => {
    if (chatWrapRef.current) {
      chatWrapRef.current.scrollTo({
        top: scrollTo === "bottom" ? chatWrapRef.current.scrollHeight : 0,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = (direction) => {
    if (trendingWrapRef.current) {
      const trendingWrap = trendingWrapRef.current;
      const scrollDistance = trendingWrap.offsetWidth;

      if (direction === "right") {
        trendingWrap.scrollBy({
          left: scrollDistance,
          behavior: "smooth",
        });
      } else if (direction === "left") {
        trendingWrap.scrollBy({
          left: -scrollDistance,
          behavior: "smooth",
        });
      } else if (direction === "start") {
        trendingWrap.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }
    }
  };

  const addDataToChatHistory = async (data) => {
    const timestamp = new Date().toISOString();
    setChatData((val) => [...val, { ...data, timestamp }]);
    if (loadingChatMsg) {
      setLoadingChatMsg(false);
    }
  };

  const userSearchByTxt = async () => {
    let chatNewRes = [];
    try {
      const apiURL = config.api.chatBotSearch;
      let apiResponse = await callAPI.get(apiURL, { search: searchVal });
      let regResponse = await apiResponse.json();
      if (regResponse && regResponse.answer) {
        chatNewRes = regResponse.answer.includes("\n")
          ? regResponse.answer.split("\n")
          : [regResponse.answer];
        chatNewRes = chatNewRes.filter((val) => val !== "");
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingChatMsg(false);
    addDataToChatHistory({
      dataType: "bot",
      value: chatNewRes,
      msgRenderType: chatNewRes.length > 0 ? "txt" : "error",
    });
  };

  const searchByFlightNumber = async (searchVal) => {
    let chatNewRes = [];
    setSelectedRibbonData(ribbonData.options);
    let msgRenderType = "flightInfo";

    try {
      const todayData = moment().format("L");
      let todayDate = moment(todayData, "UTC", "UTC").format();

      // Calculate tomorrow's date
      const tomorrowData = moment().add(1, "days").format("L");
      let tomorrowDate = moment(tomorrowData, "UTC", "UTC").format();

      // Today's API URL
      let todayApiURL = config.api.flightSearch
        .replace("{{date}}", todayDate)
        .replace("{{movementType}}", "Departure")
        .replace("{{flightNo}}", searchVal);

      // Tomorrow's API URL
      let tomorrowApiURL = config.api.flightSearch
        .replace("{{date}}", tomorrowDate)
        .replace("{{movementType}}", "Departure")
        .replace("{{flightNo}}", searchVal);

      // Use Promise.all for parallel API calls
      const [todayApiResponse, tomorrowApiResponse] = await Promise.all([
        callAPI.get(todayApiURL),
        callAPI.get(tomorrowApiURL),
      ]);

      // Parse JSON responses
      const [todayRegResponse, tomorrowRegResponse] = await Promise.all([
        todayApiResponse.json(),
        tomorrowApiResponse.json(),
      ]);

      // Construct response object if both API calls are successful
      if (
        todayApiResponse.status === 200 &&
        tomorrowApiResponse.status === 200
      ) {
        chatNewRes = {
          Today: todayRegResponse.data || [],
          Tomorrow: tomorrowRegResponse.data || [],
        };
      }

      if (chatNewRes.Today.length === 0 && chatNewRes.Tomorrow.length === 0) {
        msgRenderType = "txt";
        chatNewRes = [
          "No flights found.",
          "Please refine your search and try again.",
        ];
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingChatMsg(false);
    addDataToChatHistory({
      dataType: "bot",
      value: chatNewRes,
      msgRenderType: msgRenderType,
    });
    setSelectedRibbonData(ribbonData.options);
  };

  const searchByOriginDestination = async (searchVal, isReversed) => {
    if (loadingChatMsg) return;
    const originCode = isReversed ? searchVal.code : "BLR";
    const destinationCode = isReversed ? "BLR" : searchVal.code;
    const boundId = isReversed ? "arr" : "dep";
    addDataToChatHistory({
      dataType: "user",
      value: `From: ${originCode} To: ${destinationCode}`,
    });
    setLoadingChatMsg(true);

    let chatNewRes = [];
    let msgRenderType = "flightInfo";
    const todayData = moment().format("L");
    let todayDate = moment(todayData, "UTC", "UTC").format();

    // Calculate tomorrow's date
    const tomorrowData = moment().add(1, "days").format("L");
    let tomorrowDate = moment(tomorrowData, "UTC", "UTC").format();

    try {
      const apiURL = config.api.addNewFlights.flightListing;

      let todayApiResponse = await callAPI.get(apiURL, {
        orgAirport: originCode,
        destAirport: destinationCode,
        boundId: boundId,
        flDate: todayDate,
      });
      let todayRegResponse = await todayApiResponse.json();

      let tomorrowApiResponse = await callAPI.get(apiURL, {
        orgAirport: originCode,
        destAirport: destinationCode,
        boundId: boundId,
        flDate: tomorrowDate,
      });
      let tomorrowRegResponse = await tomorrowApiResponse.json();

      if (
        todayRegResponse.data &&
        (todayRegResponse.data[boundId].length > 0 ||
          tomorrowRegResponse.data[boundId].length > 0)
      ) {
        chatNewRes = {
          Today: todayRegResponse.data[boundId],
          Tomorrow: tomorrowRegResponse.data[boundId],
        };
      } else {
        chatNewRes = [
          "No flights found.",
          "Please refine your search and try again.",
        ];
        msgRenderType = "txt";
      }
    } catch (err) {
      console.error(err);
    }

    setLoadingChatMsg(false);
    addDataToChatHistory({
      dataType: "bot",
      value: chatNewRes,
      msgRenderType: msgRenderType,
    });
    setIsFlightSearchCard(false);
    setSelectedRibbonData(ribbonData.options);
  };

  const onSubmitSearch = async () => {
    if (!searchVal.trim()) return;
    addDataToChatHistory({ dataType: "user", value: searchVal });
    setLoadingChatMsg(true);
    setSearchVal("");

    if (inputRef.current) {
      const inputType = inputRef.current.dataset.type; // Get the type from data-type attribute

      switch (inputType) {
        case "searchByFlightNumber":
          // Logic for search by flight number
          await searchByFlightNumber(searchVal);
          break;

        case "searchByFlightName":
          // Logic for search by airline name
          await searchByFlightNumber(searchVal);
          break;

        case "originType":
          // Logic for search by origin/destination
          await searchByOriginDestination(searchVal);
          break;

        default:
          // Default behavior if no type is specified
          userSearchByTxt();
          break;
      }
    } else {
      // Fallback if inputRef.current is undefined
      userSearchByTxt();
    }

    inputRef.current.placeholder = "Start a conversation";
    inputRef.current.dataset.type = "default";
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission (if applicable)
      onSubmitSearch();
    }
  };

  const onSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchVal(value);
  };

  const onRibbonClick = (data) => {
    let botResponse = ["Please select one of the options below"];
    let options = data.options ? data.options : ribbonData.options;
    let msgRenderType = "txt";

    setNavigationHistory((prevHistory) => [...prevHistory, selectedRibbonData]);

    addDataToChatHistory({ dataType: "user", value: data.category });
    setLoadingChatMsg(true);
    setSelectedRibbonData([]);
    if (data.prompt) {
      botResponse = data.prompt.includes("\n")
        ? data.prompt.split("\n")
        : [data.prompt];
      if (data.prompt === "noData") {
        msgRenderType = "error";
      }
    }

    const dataType = data.type || "default";
    if (
      dataType === "searchByFlightNumber" ||
      dataType === "searchByFlightName"
    ) {
      inputRef.current.placeholder = data.placeHolderTxt;
      inputRef.current.dataset.type = dataType;
    }

    if (dataType === "originType") {
      setIsFlightSearchCard(true);
    }

    setTimeout(() => {
      setLoadingChatMsg(false);
      addDataToChatHistory({
        dataType: "bot",
        value: botResponse,
        msgRenderType: msgRenderType,
      });
      setSelectedRibbonData(options);
    }, 1000);
  };

  const onStartedClick = () => {
    setIsStarted(true);
    addDataToChatHistory({ dataType: "user", value: "Get Started" });
    setTimeout(
      () =>
        addDataToChatHistory({
          dataType: "bot",
          value: [
            "Hi, I'm Eko, Your Virtual Assistant at Bengaluru Airport. Pleased to be serving you today.",
            "Please click a button below, or enter your question and I will do my best to help you.",
          ],
          msgRenderType: "txt",
        }),
      700
    );
  };

  const onPrevMenuClick = () => {
    setNavigationHistory((prevHistory) => {
      const updatedHistory = [...prevHistory];
      const previousMenu = updatedHistory.pop(); // Get last menu
      setSelectedRibbonData(previousMenu || [ribbonData]);
      return updatedHistory;
    });
  };

  const onMainMenuClick = () => {
    setNavigationHistory([]);
    setSelectedRibbonData(ribbonData.options);
  };

  const onDoneClick = () => {
    setNavigationHistory([]);
    addDataToChatHistory({ dataType: "user", value: "I'm Done!" });
    setLoadingChatMsg(true);
    setSelectedRibbonData([ribbonData]);
    setTimeout(() => {
      setLoadingChatMsg(false);
      addDataToChatHistory({
        dataType: "bot",
        value: ["Thank you! Glad to be of service."],
        msgRenderType: "txt",
      });
    }, 600);
  };

  const renderFloatingChatBot = () => {
    return (
      <div id="corover-cb-widget" className="">
        <div className="corover-dialog">
          <img className="botIcon" src={robotIcon} width="40px" alt="bot" />
          <div>
            <div className="header">BLRPulse bot</div>
            <div className="sub-header">
              Hi, I am Eko.
              <br /> I can help clarify across a variety of topics such as
              boarding gate number, flight status and many more.
            </div>
          </div>
        </div>
        <div id="floating-lottie" onClick={onChatIconClick}>
          <LottiePlayer mobileFile={robotAnimate} desktopFile={robotAnimate} />
        </div>
        <div
          id="corover-min-btn"
          onClick={() => setChatBotViewType("labelFixedRight")}
          style={{ backgroundImage: `url(${closeBtn})` }}
        ></div>
      </div>
    );
  };

  const renderFloatingRight = () => {
    return (
      <div
        onClick={() => setChatBotViewType("animatedBot")}
        className="animated-chat-right"
      >
        <p>E</p>
        <p>K</p>
        <p>O</p>
      </div>
    );
  };

  const renderUserQuestionUI = (question) => {
    return <p className="chat-text">{question}</p>;
  };

  const renderBotResError = () => {
    return (
      <span>
        Sorry, that’s the end of the road (or in my case, runway) for me. Our
        team will help you resolve this query. Please reach out to them at{" "}
        <a className="fallback" href="mailto:feedback@bialairport.com">
          feedback@bialairport.com
        </a>{" "}
        or{" "}
        <a className="fallback" href="tel:08022012001">
          080-22012001
        </a>
        .
      </span>
    );
  };

  const renderBotResContent = (data, queId) => {
    const timeAgo = data.timestamp
      ? formatDistanceToNow(new Date(data.timestamp), { addSuffix: true })
      : "";
    switch (data.msgRenderType) {
      case "flightInfo":
        return <FlightInformationCard data={data.value} />;
      case "error":
        return (
          <div style={{ marginBottom: "30px" }}>
            <div className="chat-text">{renderBotResError()}</div>
            <span className="chat-time">{timeAgo}</span>
          </div>
        );
      case "txt":
        return (
          <div style={{ marginBottom: "30px" }}>
            {data.value.length > 0 ? (
              data.value.map((answer, index) => (
                <div
                  key={`quesId-${queId}answId-${index}`}
                  className="chat-text"
                >
                  <div dangerouslySetInnerHTML={{ __html: answer }}></div>
                </div>
              ))
            ) : (
              <div className="chat-text">{renderBotResError()}</div>
            )}
            <span className="chat-time">{timeAgo}</span>
          </div>
        );
      default:
        return "";
    }
  };

  const renderBotResUI = (data, queId) => {
    return (
      <React.Fragment>
        <div>
          <img alt="bot" src={robotIcon} width="40" />
        </div>
        {renderBotResContent(data, queId)}
      </React.Fragment>
    );
  };

  const renderTrendingButtons = () => {
    return (
      <div className="trendingContainer">
        <div style={{ width: "5%" }}>
          <input
            onClick={() => handleScroll("left")}
            className="btnLeft"
            type="button"
            value="<"
          />
        </div>
        <div ref={trendingWrapRef} className="trending-wrap">
          {selectedRibbonData.map((data) => (
            <button
              onClick={() => onRibbonClick(data)}
              key={data.category}
              className="btn"
            >
              {" "}
              {data.category}{" "}
            </button>
          ))}
          {selectedRibbonData !== ribbonData.options &&
            selectedRibbonData[0] !== ribbonData && (
              <button onClick={onMainMenuClick} className="btn">
                Main Menu
              </button>
            )}
          {navigationHistory.length > 0 && (
            <button onClick={onPrevMenuClick} className="btn">
              Previous Menu
            </button>
          )}
          {selectedRibbonData[0] !== ribbonData && (
            <button onClick={onDoneClick} className="btn">
              {" "}
              I'm Done!{" "}
            </button>
          )}
        </div>
        <div style={{ width: "5%" }}>
          <input
            className="btnRight"
            onClick={() => handleScroll("right")}
            type="button"
            value=">"
          />
        </div>
      </div>
    );
  };

  const renderStartConversationForm = () => {
    return (
      <div className="chat-input-box">
        {selectedRibbonData.length > 0 && renderTrendingButtons()}

        {/* {selectedRibbonData.length> 0 && <div className="trending-wrap">
                    {selectedRibbonData.map((data) => <button onClick={() => onRibbonClick(data)} key={data.category} className="btn"> {data.category} </button>)}
                    {(selectedRibbonData !== ribbonData.options && selectedRibbonData[0] !== ribbonData) && (
                        <button
                            onClick={onMainMenuClick}
                            className="btn"
                        >
                            Main Menu
                        </button>
                    )}

                    {
                        navigationHistory.length > 0 && (
                            <button onClick={onPrevMenuClick} className="btn">
                              Prev Menu
                            </button>
                          )
                    }
                    {selectedRibbonData[0] !== ribbonData && <button onClick={onDoneClick} className="btn"> I'm Done! </button>}
                </div>} */}

        <div className="chat-input__form">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div style={{ width: "79%" }}>
              <input
                onChange={onSearchInputChange}
                onKeyDown={onSearchKeyDown}
                value={searchVal}
                autoComplete="off"
                ref={inputRef}
                data-type="searchByTxt"
                className="chat-input__text"
                type="text"
                placeholder="Start a conversation"
              />
            </div>
            <div className="buttonsDiv">
              <button
                onClick={onSubmitSearch}
                className="chat-submit"
                id="chat-submit"
              >
                <img alt="Send" className="sendicon" src={sendIcon} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChatLog = () => {
    return (
      <React.Fragment>
        <div ref={chatWrapRef} className="chat-wrap" id="scroll">
          <div className="bnglrAirpotImgContainer">
            <img
              alt="bnglreAirPort"
              src={bnglreAirport}
              style={{ height: "160px", borderRadius: "15px", width: "372px" }}
            />
          </div>
          {chatData.map((val, index) => {
            return (
              <div
                key={`${val.dataType}-${index}`}
                className={`chat-bubble chat-${val.dataType}`}
              >
                {val.dataType === "user"
                  ? renderUserQuestionUI(val.value)
                  : renderBotResUI(val, index)}
              </div>
            );
          })}
          {loadingChatMsg && (
            <div className="lottie-loading">
              <LottiePlayer
                mobileFile={loaderAnimate}
                desktopFile={loaderAnimate}
                height="70px"
              />
            </div>
          )}
          <button onClick={() => scrollChatScreen("top")} className="chatGoTop">
            <i className="anticon anticon-arrow-up">
              <svg
                viewBox="64 64 896 896"
                fill="currentColor"
                width="1em"
                height="1em"
                data-icon="arrow-up"
                aria-hidden="true"
              >
                <path d="M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z"></path>
              </svg>
            </i>
          </button>
          ̰
        </div>

        {isFlightSearchCard ? (
          <FlightSearchCard
            searchByOriginDestination={searchByOriginDestination}
            disableSearch
          />
        ) : (
          renderStartConversationForm()
        )}
      </React.Fragment>
    );
  };

  const renderGetStartedScreen = () => {
    return (
      <div className="introductionBoxContainer">
        <div className="h-70">
          <div className="introductionBox">
            Hello! I am <span className="ekoGray">EKO</span>, your personal AI
            assistant. I am happy to answer all your queries on BLR airport.
            <ol className="numberedList">
              <li>
                Flight Related Info (Gate No, Belt No, Flight Timings etc.)
              </li>
              <li>T2 Terminal Related Information</li>
              <li>Travel Related Information</li>
              <li>Things to do at BLR Airport</li>
              <li>Covid-19 Related information </li>
            </ol>
            <div className="lottie-welcome">
              <LottiePlayer
                mobileFile={robotAnimate}
                desktopFile={robotAnimate}
              />
            </div>
          </div>
        </div>
        <div className="txtCtr">
          <button
            className="button"
            onClick={onStartedClick}
            id="getStartedBtn"
          >
            {" "}
            Get Started{" "}
          </button>
        </div>
      </div>
    );
  };

  const renderBotMsgsView = () => {
    return (
      <div
        style={{ "--arrow-right-url": `url(${arrowRight})` }}
        id="corover-chatbox"
      >
        <div id="corover-title-bar">
          <div
            id="corover-close-cb-btn"
            onClick={() => setChatBotViewType("animatedBot")}
            style={{ backgroundImage: `url(${closeBtn})` }}
          ></div>
        </div>
        <div id="corover-frame-body">
          <div className="chatbot__header">
            <div className="bot">
              <div className="lottie" style={{ width: "82px" }}>
                <LottiePlayer
                  mobileFile={robotAnimate}
                  desktopFile={robotAnimate}
                  width="100px"
                />
              </div>
              <div className="nameing">
                <div style={{ fontWeight: "600", fontSize: "22px" }}>EKO</div>
                <div
                  style={{
                    marginTop: "-5px",
                    fontSize: "13px",
                    color: "#e4eeee",
                  }}
                >
                  the BLRPulse bot
                </div>
              </div>
            </div>
          </div>
          {isStarted ? renderChatLog() : renderGetStartedScreen()}
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (chatBotViewType) {
      case "animatedBot":
        return renderFloatingChatBot();
      case "labelFixedRight":
        return renderFloatingRight();
      case "botMsgView":
        return renderBotMsgsView();
      default:
        return null; // Optional: Handle unexpected cases
    }
  };

  return <React.Fragment>{renderView()}</React.Fragment>;
}
