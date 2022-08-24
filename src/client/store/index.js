/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * Main header file for redux
 * //TODO: dynamic import of services redux?
 */

import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import user from "./user";
import auth from "./authModal";
import admin from "./admin";
import navbar from "./navbar";

const reducer = combineReducers({
  user,
  auth,
  admin,
  navbar
});

let log = [];
if (process.env.NODE_ENV === "development") {
  log = [createLogger({ collapsed: true })];
}

const middleware = composeWithDevTools(applyMiddleware(thunk, ...log));

// TODO: update code
const store = createStore(reducer, middleware);

export default store;
