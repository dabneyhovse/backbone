/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * Main header file for redux
 * //TODO: dynamic import of services redux?
 */

import { combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";

import user from "./user";
import auth from "./authModal";
import admin from "./admin";
import navbar from "./navbar";
import affiliation from "./affiliation";

import { builtInServices, moduleServices } from "../../services";
const allServices = [...builtInServices, ...moduleServices];
const serviceReducers = {};
for (let i = 0; i < allServices.length; i++) {
  const curr = allServices[i];
  if (curr.importRedux) {
    serviceReducers[curr.route] = await import(
      `${curr.moduleName}/submodules/Redux`
    ).default();
  }
}

const reducer = combineReducers({
  user,
  auth,
  admin,
  navbar,
  affiliation,
});

let log = [];
if (process.env.NODE_ENV === "development") {
  log = [createLogger({ collapsed: true })];
}

const middleware = composeWithDevTools(applyMiddleware(thunk, ...log));

const store = configureStore({ reducer });
export default store;
