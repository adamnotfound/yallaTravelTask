import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
const app = (
  <Provider store={store}>
    <BrowserRouter basename={""}>
      {" "}
      <App />
    </BrowserRouter>
  </Provider>
);
ReactDOM.render(app, document.getElementById("root"));

//offline
serviceWorker.unregister();
