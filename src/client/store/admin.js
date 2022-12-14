/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * admin redux
 *
 * #TODO: get all users, remove user edit user etc
 */

import axios from "axios";
import Axios from "axios";
import { toast } from "react-toastify";
import { unflattenObject } from "./helpers";

// Action Types
export const GOT_ADMIN_USERS = "GOT_ADMIN_USERS";
export const GOT_ADMIN_USER = "GOT_ADMIN_USER";
export const ADMIN_USERS_SET_PAGE = "ADMIN_USERS_SET_PAGE";
export const CLEAR_ADMIN_STORE = "CLEAR_ADMIN_STORE";
export const GOT_ADMIN_GROUPS = "GOT_ADMIN_GROUPS";

// Action Creators
export const gotAdminUsers = (users) => ({
  type: GOT_ADMIN_USERS,
  users,
});
export const gotAdminUser = (user) => ({
  type: GOT_ADMIN_USER,
  user,
});
export const adminUsersSetPage = (page) => ({
  type: ADMIN_USERS_SET_PAGE,
  page,
});
export const clearAdminStore = () => ({
  type: CLEAR_ADMIN_STORE,
});
export const gotAdminGroups = (groups) => ({
  type: GOT_ADMIN_GROUPS,
  groups,
});

export const fetchAdminUsers = (search) => {
  return async (dispatch, getState) => {
    try {
      const { data } = await Axios.get(`/api/users`, {
        params: { search, pageNum: getState().admin.page },
      });
      dispatch(gotAdminUsers(data));
    } catch (error) {
      toast.error("There was an error fetching the users");
    }
  };
};

export const fetchAdminUser = (id) => {
  return async (dispatch, getState) => {
    try {
      const { data } = await Axios.get(`/api/users/admin/${id}`);
      data.groups.forEach((group) => {
        data[`group-check-${group.id}`] = true;
      });
      data.affiliations.map((affiliation) => {
        data[`verification-key-${affiliation.house}-${affiliation.status}`] = {
          ...affiliation,
        };
      });
      dispatch(gotAdminUser(data));
    } catch (error) {
      toast.error("There was an error fetching the users");
    }
  };
};

export const updateAdminUser =
  (userData, userId) => async (dispatch, getState) => {
    try {
      /**
       * sanitizes in server
       */
      const res = await Axios.put(`/api/users/${userId}`, userData, {
        headers: { "content-type": "multipart/form-data" },
      });
      toast.success("The information was updated!");
    } catch (error) {
      toast.error("There was an error updating the information");
    }
  };

export const deleteAdminUser = (userId) => async (dispatch) => {
  try {
    const res = await Axios.delete(`/api/users/${userId}`);
    toast.success("The user was deleted. /goodbyeforever");
  } catch (error) {
    toast.error("There was an error deleting this user");
  }
};

export const promoteAdminUser = (userId) => async (dispatch) => {
  try {
    const res = await Axios.patch(`/api/users/${userId}`);
    toast.success("The user was promoted");
    dispatch(fetchAdminUser(userId));
  } catch (error) {
    toast.error("There was an error promoting this user");
  }
};

export const fetchAdminGroups = () => async (dispatch) => {
  try {
    const res = await Axios.get("/api/groups");
    dispatch(gotAdminGroups(res.data));
  } catch (error) {
    toast.error("There was an error fetching the groups");
  }
};

// Reducer
const init = {
  users: [],
  user: {},
  page: 1,
  count: 1,
  groups: [],
};

const reducer = (state = init, action) => {
  switch (action.type) {
    case GOT_ADMIN_USERS: {
      return { ...state, users: action.users.rows, count: action.users.count };
    }
    case GOT_ADMIN_USER: {
      return { ...state, user: action.user };
    }
    case ADMIN_USERS_SET_PAGE: {
      return { ...state, page: action.page };
    }
    case CLEAR_ADMIN_STORE: {
      return init;
    }
    case GOT_ADMIN_GROUPS: {
      return { ...state, groups: action.groups };
    }
    default:
      return state;
  }
};

export default reducer;
