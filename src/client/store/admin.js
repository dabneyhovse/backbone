/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * admin redux
 *
 * #TODO: get all users, remove user edit user etc
 */

import Axios from "axios";

// Action Types
export const GOT_ADMIN_EVENTS = "GOT_ADMIN_EVENTS";

// Action Creators
export const got_admin_events = (events) => {
  return { type: GOT_ADMIN_EVENTS, events };
};

export const fetchAdminEvents = () => {
  return async (dispatch) => {
    const { data } = await Axios.get(`/api/events/admin`);
    dispatch(got_admin_events(data));
  };
};

// Reducer
const init = {
  events: [],
};

const reducer = (state = init, action) => {
  switch (action.type) {
    case GOT_ADMIN_EVENTS: {
      return { ...state, events: action.events };
    }
    default:
      return state;
  }
};

export default reducer;
