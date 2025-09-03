import "./polyfills"; // Ensure this is at the very top
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "../node_modules/antd/dist/antd.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import * as themes from "./theme/schema.json";
import { setLocalStorage } from "./util/storageUtil.js";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

// const styleLink = document.createElement('link');
// styleLink.rel = 'stylesheet';
// styleLink.href =
//   'https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css';
// document.head.appendChild(styleLink);

// const styleLink1 = document.createElement("link");
// styleLink1.rel = "stylesheet";
// styleLink1.href = "https://uatbengaluruairport.corover.ai/#/";
// document.head.appendChild(styleLink1);

const Index = () => {
  setLocalStorage("all-themes", themes.default);
  return <App />;
};

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <Index />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
