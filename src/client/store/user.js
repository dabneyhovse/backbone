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
import { unflattenObject } from "./helpers";
import { TRUE } from "sass";

const AUTH_ERR_TOAST_TIME = 3000;

/**
 * ACTION TYPES
 */
const GET_USER = "GET_USER";
const REMOVE_USER = "REMOVE_USER";
// const VERIFIED_USER = "VERIFIED_USER";
const CLEAR_USER_ERROR = "CLEAR_USER_ERROR";

/**
 * INITIAL STATE
 */
const defaultUser = {
  default: true,

};

/**
 * ACTION CREATORS
 */
const getUser = (userInfo) => ({ type: GET_USER, userInfo });
const removeUser = () => ({ type: REMOVE_USER });
// const verifiedUser = (email, attempt) => ({
//   type: VERIFIED_USER,
//   email,
//   attempt,
// });
export const clearUserError = () => ({
  type: CLEAR_USER_ERROR,
});

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch, getState) => {
  try {
    const res = await axios.get("/auth/userinfo");
    if (res.data.userInfo.email_verified !== true) {
      toast.warn("Please verify your email", {
        autoClose: AUTH_ERR_TOAST_TIME,
      });
    }
    dispatch(loadedAuth());
    dispatch(getUser(res.data || defaultUser));
  } catch (err) {
    dispatch(loadedAuth());
    toast.error(`There was an error loading your user.`, {
      autoClose: AUTH_ERR_TOAST_TIME,
    });
  }
};

export const auth = () => {
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
        }.`,
        {
          autoClose: AUTH_ERR_TOAST_TIME,
        }
      );
      return dispatch(getUser({ error: authError }));
    }
    try {
      // TODO: clean this up, not sure why two try catches
      dispatch(getUser(res.data));
      history.push("/home");
    } catch (error) {
      toast.error(
        `There was an error ${
          method == "signin" ? "signing in" : "signing up"
        }.`,
        {
          autoClose: AUTH_ERR_TOAST_TIME,
        }
      );
    }
  };
};

// export const linkTelegram = (hash) => async (dispatch, getState) => {
//   try {
//     if (hash.length !== 6) {
//       throw "Improper verification code, it must be 6 characters long.";
//     }
//     let res;
//     try {
//       res = await axios.post("/auth/verify", {
//         hash,
//       });
//     } catch (error) {
//       throw error.response.data;
//     }

//     if (res.status == 201) {
//       // grab new user
//       dispatch(me());
//       toast.success("Successfully verifed your telegram account.");
//     } else {
//       throw "There was an error linking your telegram account, please make sure the code is correct";
//     }
//   } catch (err) {
//     toast.error(err, {
//       autoClose: AUTH_ERR_TOAST_TIME,
//     });
//   }
// };

// export const passwordReset = (personalEmail) => async (dispatch, getState) => {
//   try {
//     const res = await axios.post("/auth/password-reset", {
//       personalEmail,
//     });
//     toast.success(
//       "Your password reset requested was approved, please check your email"
//     );
//     // hide modal on success
//     dispatch(updateModalVisibility(true));
//   } catch (error) {
//     dispatch(getUser({ error: error }));
//     toast.error(
//       "There was an issue requesting a password reset, please try again later."
//     );
//   }
// };

// export const updateUser = (userData) => async (dispatch, getState) => {
//   try {
//     /**
//      * sanitizes in server
//      */
//     const res = await axios.put("/api/users", userData, {
//       headers: { "content-type": "multipart/form-data" },
//     });

//     let data = unflattenObject(res.data);
//     let oldData = getState().user.data;
//     // server sends back what we sent if it's ok
//     dispatch(
//       getUser({
//         ...oldData,
//         ...data,
//         profile: { ...oldData.profile, ...data.profile },
//       })
//     );
//     toast.success("Your information was updated!", { autoClose: 2000 });
//   } catch (error) {
//     toast.error("There was an error updating your information", {
//       autoClose: AUTH_ERR_TOAST_TIME,
//     });
//   }
// };
 
export const logout = () => async (dispatch) => {
  try {
    history.push("/");
    dispatch(removeUser());
  } catch (err) {
    toast.error("There was an error logging out", {
      autoClose: AUTH_ERR_TOAST_TIME,
    });
  }
};

// const VERIFICATION_DELAY = 1000;
// const goHome = (dispatch) => {
//   // spend a little time on the verification
//   // page so it isnt so jarring
//   setTimeout(() => {
//     history.push("/home");
//     // change the status back so another verification can be done
//     // if this isnt working, the user can just reload the page ig
//     dispatch(verifiedUser(null, false));
//   }, VERIFICATION_DELAY);
// };

// export const verifyUser = (hash) => async (dispatch, getState) => {
//   if (!getState().user.verifyAttempt) {
//     dispatch(verifiedUser(null, true));
//     // remove the hash from the hash route
//     hash = hash.replace("#", "");
//     try {
//       if (hash.length !== 64) {
//         throw "Improper verification hash, please use the link from the email you recieved.";
//       }
//       const res = await axios.post("/auth/verify", {
//         hash,
//       });

//       if (res.status == 200) {
//         toast.success(
//           "Successfully verifed your email, this page will redirect you in a moment"
//         );
//         goHome(dispatch);
//       } else if (res.status == 201) {
//         toast.success("Your password was reset, please check your email.");
//         goHome(dispatch);
//       } else {
//         throw "Verification code not found, perhaps you already verified.";
//       }
//     } catch (err) {
//       goHome(dispatch);
//       toast.error(err, {
//         autoClose: AUTH_ERR_TOAST_TIME,
//       });
//     }
//   }
// };

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return { ...state, data: action.userInfo };
    case REMOVE_USER:
      return defaultUser;
    // case VERIFIED_USER: {
    //   return { ...state, verifyAttempt: action.attempt };
    // }
    case CLEAR_USER_ERROR: {
      return { ...state, data: { ...state.data, error: "" } };
    }
    default:
      return state;
  }
}
