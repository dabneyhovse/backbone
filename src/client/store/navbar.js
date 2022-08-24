/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * // TODO: navbar props to modify it
 * I might directly push react code through this
 */

// Action Types

import { test } from "../../services/index";
console.log(test)

export const UPDATE_NAV = "UPDATE_NAV";
export const UPDATE_SERVICES = "UPDATE_SERVICES";

// Action Creators
export const update_nav = (nav) => {
  return { type: UPDATE_NAV, nav };
};

export const update_services = (services) => {
  return { type: UPDATE_SERVICES, services };
};

export const default_nav = () => {
  return update_nav(init);
};

// load services from the /services/json
const loadServices = () => {
  const end = {
    name: "About Services",
    route: "/services/about",
  };
};

// init state / default
const init = {
  navbar: [
    {
      name: "Gallery",
      route: "/gallery",
      type: "react-router",
    },
    {
      name: "Contact",
      type: "dropdown",
      links: [
        {
          name: "House Positions",
          route: "https://dabney.caltech.edu/wiki/doku.php?id=hovse_positions",
          type: "href",
        },
        {
          name: "Student Resources",
          route:
            "https://dabney.caltech.edu/wiki/doku.php?id=student_resources",
          type: "href",
        },
        {
          name: "Emergency",
          route: "https://directory.caltech.edu/EmergencyInfo",
          type: "href",
        },
      ],
    },
  ],
};

// Reducer

const reducer = (state = init, action) => {
  switch (action.type) {
    case UPDATE_NAV: {
      return { ...state, nav: action.nav };
    }
    default:
      return state;
  }
};

export default reducer;
