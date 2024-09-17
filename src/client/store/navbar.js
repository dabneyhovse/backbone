/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * // TODO: navbar props to modify it
 * I might directly push react code through this
 */

// Action Types
export const UPDATE_NAV = "UPDATE_NAV";
export const UPDATE_NAV_SERVICES = "UPDATE_NAV_SERVICES";
export const UPDATE_NAV_VISIBILITY = "UPDATE_NAV_VISIBILITY";
export const ADD_HIDDEN_NAV_ROUTE = "ADD_HIDDEN_NAV_ROUTE";
export const ADD_TRANSPARENT_NAV_ROUTES = "ADD_TRANSPARENT_NAV_ROUTES";

// TODO restructure to serviceConfigs
import { serviceConfigs } from "../../services";

// Action Creators
export const updateNav = (nav) => {
  return { type: UPDATE_NAV, nav };
};

export const updateNavServices = (services) => {
  return { type: UPDATE_NAV_SERVICES, services };
};

export const updateNavVisibility = (visible) => {
  return { type: UPDATE_NAV_VISIBILITY, visible };
};

export const addHiddenNavRoute = (route) => {
  return { type: ADD_HIDDEN_NAV_ROUTE, route };
};

export const addTransparentNavRoute = (route) => {
  return { type: ADD_TRANSPARENT_NAV_ROUTES, route };
};

export const defaultNav = () => {
  return update_nav(init);
};

// load service info from /services json files
const loadServices = () => {
  let allServices = serviceConfigs;

  allServices.sort((a, b) =>
    a.dropdownItemPosition < b.dropdownItemPosition ? 1 : -1
  );

  let copy = [...allServices.map((e) => ({ ...e, type: e.routeType }))];
  let added = 0;
  for (let i = 1; i < allServices.length; i++) {
    if (
      allServices[i - 1].dropdownItemPosition !=
      allServices[i].dropdownItemPosition
    ) {
      copy.splice(i + added, 0, { type: "line", key: added });
      added++;
    }
  }
  return copy;
};

const services = loadServices();

// init state / default
const init = {
  visible: true,
  transparentRoutes: ["/", "/home"],
  hiddenRoutes: ["/auth/postlogin", "/auth/postlogout"],
  links: {
    type: "main",
    links: [
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
            route:
              "https://dabney.caltech.edu/wiki/doku.php?id=hovse_positions",
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
      {
        name: "Services",
        type: "dropdown",
        links: services,
      },
    ],
  },
};

// Reducer

const reducer = (state = init, action) => {
  switch (action.type) {
    case UPDATE_NAV: {
      return { ...state, nav: action.nav };
    }
    case UPDATE_NAV_VISIBILITY: {
      return { ...state, visible: action.visible };
    }
    case ADD_HIDDEN_NAV_ROUTE: {
      return { ...state, hiddenRoutes: [...state.hiddenRoutes, action.route] };
    }
    case ADD_TRANSPARENT_NAV_ROUTES: {
      return {
        ...state,
        transparentRoutes: [...state.transparentRoutes, action.route],
      };
    }
    default:
      return state;
  }
};

export default reducer;
