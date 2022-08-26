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
/**
 * "
 * This API is currently prefixed as unstable_ because you may unintentionally
 * add two versions of the history library to your app, the one you have added
 * to your package.json and whatever version React Router uses internally. If
 * it is allowed by your tooling, it's recommended to not add history as a direct
 * dependency and instead rely on the nested dependency from the react-router
 * package. Once we have a mechanism to detect mis-matched versions, this API
 * will remove its unstable_ prefix.
 * "
 */
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

import history from "./history";
import App from "./App";
import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HistoryRouter history={history}>
        <App />
      </HistoryRouter>
    </Provider>
  </React.StrictMode>
);
