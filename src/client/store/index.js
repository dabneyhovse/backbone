/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * Main header file for redux
 * //TODO: dynamic import of services redux?
 */

import { applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";

import user from "./user";
import auth from "./authModal";
import admin from "./admin";
import navbar from "./navbar";
import affiliation from "./affiliation";

import { createReducerManager } from "./manager";

// TODO change to dynamic importing and restructure tree.

//      ie dont want full available tree loaded, just what is needed.
// import { builtInServices, moduleImports, moduleServices } from "../../services";
// const allServices = [...builtInServices, ...moduleServices];
// const serviceReducers = {};
// for (let i = 0; i < allServices.length; i++) {
//   const curr = allServices[i];
//   if (curr.importRedux) {
//     const { default: reducer } = await moduleImports[curr.moduleName].redux;
//     serviceReducers[curr.route] = reducer;
//   }
// }

// SERVICES NOTE: add services redux here:
// import exampleReducer from "service-example/Redux";
import frotatorReducer from "service-frotator/Redux";

const staticReducers = {
  user,
  auth,
  admin,
  navbar,
  affiliation,
  example: exampleReducer,
  frotator: frotatorReducer,
};

let log = [];
if (process.env.NODE_ENV === "development") {
  log = [createLogger({ collapsed: true })];
}

const middleware = composeWithDevTools(applyMiddleware(thunk, ...log));

const reducerManager = createReducerManager(staticReducers);

// Create a store with the root reducer function being the one exposed by the manager.
const store = configureStore({ reducer: reducerManager.reduce });
// put the reducer manager on the store so it is easily accessible
store.reducerManager = reducerManager;
export default store;
