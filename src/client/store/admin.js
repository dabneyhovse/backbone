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

// Action Types
export const GOT_ADMIN_USERS = "GOT_ADMIN_USERS";
export const GOT_ADMIN_USER = "GOT_ADMIN_USER";
export const ADMIN_USERS_SET_PAGE = "ADMIN_USERS_SET_PAGE";

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

export const fetchAdminUsers = (search) => {
  return async (dispatch, getState) => {
    try {
      console.log(getState().admin.page);
      const { data } = await Axios.get(`/api/users`, {
        params: { search, pageNum: getState().admin.page },
      });
      console.log(data);
      dispatch(gotAdminUsers(data));
    } catch (error) {
      toast.error("There was an error feching the users");
    }
  };
};

export const updateAdminUser =
  (userData, userId) => async (dispatch, getState) => {
    try {
      /**
       * sanitizes in server
       */
      const res = await axios.put(`/api/users/${userId}`, userData, {
        headers: { "content-type": "multipart/form-data" },
      });

      let data = unflattenObject(res.data);
      let oldData = getState().user.data;
      // server sends back what we sent if it's ok
      dispatch(
        gotAdminUser({
          ...oldData,
          ...data,
          profile: { ...oldData.profile, ...data.profile },
        })
      );
      toast.success("The information was updated!", { autoClose: 2000 });
    } catch (error) {
      toast.error("There was an error updating the information");
    }
  };

// Reducer
const init = {
  users: [],
  user: {},
  page: 1,
  count: 0,
};

const reducer = (state = init, action) => {
  switch (action.type) {
    case GOT_ADMIN_USERS: {
      console.log(action.users.rows);
      return { ...state, users: action.users.rows, count: action.users.count };
    }
    case GOT_ADMIN_USER: {
      return { ...state, user: action.user };
    }
    case ADMIN_USERS_SET_PAGE: {
      return { ...state, page: action.page };
    }
    default:
      return state;
  }
};

export default reducer;
