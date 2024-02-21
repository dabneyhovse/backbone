/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * admin redux
 *
 * #TODO: get all users, remove user edit user etc
 */

import Axios from "axios";
import { toast } from "react-toastify";
import { unflattenObject } from "./helpers";
import { AFFILATION_OPTIONS } from "./affiliation";

// Action Types
export const GOT_ADMIN_USERS = "GOT_ADMIN_USERS";
export const GOT_ADMIN_USER = "GOT_ADMIN_USER";
export const ADMIN_USERS_SET_PAGE = "ADMIN_USERS_SET_PAGE";
export const CLEAR_ADMIN_STORE = "CLEAR_ADMIN_STORE";
export const GOT_ADMIN_GROUPS = "GOT_ADMIN_GROUPS";
export const GOT_ADMIN_KEYS = "GOT_ADMIN_KEYS";
export const GOT_ADMIN_NEW_KEY = "GOT_ADMIN_NEW_KEY";
export const ADD_ADMIN_KEY = "ADD_ADMIN_KEY";
export const GOT_ADMIN_SCOPES = "GOT_ADMIN_SCOPES";
export const ADD_ADMIN_SCOPE = "ADD_ADMIN_SCOPE";

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
export const gotAdminKeys = (keys) => ({
  type: GOT_ADMIN_KEYS,
  keys,
});
export const gotAdminNewKey = (key) => ({
  type: GOT_ADMIN_NEW_KEY,
  key,
});
export const addAdminKey = (key) => ({
  type: ADD_ADMIN_KEY,
  key,
});
export const gotAdminScopes = (scopes) => ({
  type: GOT_ADMIN_SCOPES,
  scopes,
});
export const addAdminScope = (scope) => ({
  type: ADD_ADMIN_SCOPE,
  scope,
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

      Object.keys(AFFILATION_OPTIONS).map((key) => {
        const userKey = `verification-key-${AFFILATION_OPTIONS[key].house}-${AFFILATION_OPTIONS[key].status}`;
        if (!data[userKey]) {
          // make fake filler if needed
          data[userKey] = {};
          data[userKey].verified = false;
          data[userKey].userRequested = false;
          data[userKey].fake = true;
        }
      });
      dispatch(gotAdminUser(data));
    } catch (error) {
      toast.error("There was an error fetching the user");
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

export const fetchAdminKeys = () => async (dispatch) => {
  try {
    const res = await Axios.get("/api/keys");
    dispatch(gotAdminKeys(res.data));
  } catch (error) {
    toast.error("There was an error fetching the api keys");
  }
};

export const updateAdminKey = (data) => async (dispatch) => {
  try {
    if (data.scopes.length !== 0) {
      data.scopes = data.scopes.map((s) => s.id);
    }
    const result = await Axios.put("/api/keys", data);

    if (data.regenerate) {
      toast.success("Generated new key value");
      dispatch(gotAdminNewKey(result.data.unhashed));
    } else {
      toast.success("Updated key");
      dispatch(fetchAdminKeys());
    }
  } catch (error) {
    if (data.regenerate) {
      toast.error("There was an error generating a new key value");
    } else {
      toast.error("There was an error updating the api key");
    }
  }
};

export const createAdminKey = (data) => async (dispatch) => {
  try {
    if (data.scopes.length !== 0) {
      data.scopes = data.scopes.map((s) => s.id);
    }
    const result = await Axios.post("/api/keys", data);
    // could do at once but i like reusing (ie lazy)
    dispatch(addAdminKey(result.data));
    dispatch(gotAdminNewKey(result.data.unhashed));
  } catch (error) {
    toast.error("There was an error creating a new key");
  }
};

export const deleteAdminKey = (data) => async (dispatch) => {
  try {
    await Axios.delete("/api/keys", {
      data: { id: data.id },
    });
    toast.success("Deleted key");
    dispatch(fetchAdminKeys());
  } catch (error) {
    toast.error("There was an error deleting the api key");
  }
};

export const fetchAdminScopes = () => async (dispatch) => {
  try {
    const res = await Axios.get("/api/scopes");
    dispatch(gotAdminScopes(res.data));
  } catch (error) {
    toast.error("There was an error fetching the scopes");
  }
};

export const updateAdminScope = (data) => async (dispatch) => {
  try {
    const result = await Axios.put("/api/scopes", data);
    toast.success("Updated scope");
    dispatch(fetchAdminScopes());
  } catch (error) {
    toast.error("There was an error updating the api scope");
  }
};

export const createAdminScope = (data) => async (dispatch) => {
  try {
    const result = await Axios.post("/api/scopes", data);
    dispatch(addAdminScope(result.data));
  } catch (error) {
    toast.error("There was an error creating a new key");
  }
};

export const deleteAdminScope = (data) => async (dispatch) => {
  try {
    await Axios.delete("/api/scopes", {
      data: { id: data.id },
    });
    dispatch(fetchAdminScopes());
    toast.success("Deleted scope");
  } catch (error) {
    toast.error("There was an error deleting the api scope");
  }
};

// Reducer
const init = {
  users: [],
  user: {},
  page: 1,
  count: 1,
  groups: [],
  keys: {
    list: [],
    new_key: undefined,
  },
  scopes: [],
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
    case GOT_ADMIN_KEYS: {
      return { ...state, keys: { ...state.keys, list: action.keys } };
    }
    case GOT_ADMIN_NEW_KEY: {
      return {
        ...state,
        keys: {
          ...state.keys,
          new_key: action.key,
        },
      };
    }
    case ADD_ADMIN_KEY: {
      return {
        ...state,
        keys: {
          ...state.keys,
          list: [...state.keys.list, action.key],
        },
      };
    }
    case GOT_ADMIN_SCOPES: {
      return {
        ...state,
        scopes: action.scopes,
      };
    }
    case ADD_ADMIN_SCOPE: {
      return {
        ...state,
        scopes: [...state.scopes, action.scope],
      };
    }
    default:
      return state;
  }
};

export default reducer;
