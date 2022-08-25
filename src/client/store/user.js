/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * redux for managing the user's state
 * //TODO edit user thunk
 */

import axios from "axios";
import { toast } from "react-toastify";
import history from "../history";

import { loadedAuth, updateModalVisibility } from "./authModal";

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
    toast.error(`There was an error loading your user.`);
    console.error(err);
  }
};

export const auth = (
  username,
  password,
  method,
  caltechEmail,
  personalEmail
) => {
  return async (dispatch) => {
    let res;
    try {
      if (method === "signup") {
        res = await axios.post("/auth/signup", {
          username,
          password,
          caltechEmail,
          personalEmail,
        });
        toast.success("Successfully signed up! Welcome to Dabney™.");
        dispatch(updateModalVisibility(false));
      } else if (method === "signin") {
        res = await axios.post("/auth/login", { username, password });
        toast.success("Successfully logged in");
        dispatch(updateModalVisibility(false));
      }
    } catch (authError) {
      toast.error(
        `There was an error ${
          method == "signin" ? "signing in" : "signing up"
        }.`
      );
      return dispatch(getUser({ error: authError }));
    }
    try {
      dispatch(getUser(res.data));
      history.push("/home");
    } catch (error) {
      toast.error(
        `There was an error ${
          method == "signin" ? "signing in" : "signing up"
        }.`
      );
    }
  };
};

export const logout = () => async (dispatch) => {
  try {
    await axios.post("/auth/logout");
    dispatch(removeUser());
  } catch (err) {
    toast.error("There was an error logging out");
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
