/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * Top level imprt of the app component
 *
 * Setup Redux provider and router history
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import history from "./history";
import App from "./App";
import store from "./store";
// TODO: import { Footer } from "./components";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
