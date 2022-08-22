/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * redux for managing the user's state
 * //TODO edit user thunk
 */

import axios from "axios";
import history from "../history";

import { loadedAuth } from "./authModal";

/**
 * ACTION TYPES
 */
const GET_USER = "GET_USER";
const REMOVE_USER = "REMOVE_USER";

/**
 * INITIAL STATE
 */
const defaultUser = {};

/**
 * ACTION CREATORS
 */
const getUser = (user) => ({ type: GET_USER, user });
const removeUser = () => ({ type: REMOVE_USER });

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  try {
    const res = await axios.get("/auth/me");
    dispatch(loadedAuth());
    dispatch(getUser(res.data || defaultUser));
  } catch (err) {
    dispatch(loadedAuth());
    console.error(err);
  }
};

export const auth =
  (username, password, method, verification) => async (dispatch) => {
    let res;
    try {
      if (method === "signup") {
        res = await axios.post("/auth/signup", {
          username,
          password,
          verification,
        });
      } else if (method === "login") {
        res = await axios.post("/auth/login", { username, password });
      }
    } catch (authError) {
      return dispatch(getUser({ error: authError }));
    }
    try {
      dispatch(getUser(res.data));
      history.push("/home");
    } catch (dispatchOrHistoryErr) {
      console.error(dispatchOrHistoryErr);
    }
  };

export const logout = () => async (dispatch) => {
  try {
    await axios.post("/auth/logout");
    dispatch(removeUser());
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case REMOVE_USER:
      return defaultUser;
    default:
      return state;
  }
}
