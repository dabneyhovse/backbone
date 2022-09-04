/**
 * Author:	Nick Jasinski
 * Date:		2022-08-19
 *
 *  Main routes file which switches between the given rute paths
 * // TODO dynamic import service routes from the service folder
 * // TODO setup import of basic html? or make a quick template for
 * //      users to make simple react
 * // TODO special routes allowing any user to host a personal website
 */

import React, { Component } from "react";
import { connect, useSelector } from "react-redux";
import { Route } from "react-router-dom";
import {
  AdminPanel,
  AuthModal,
  Calender,
  DarbGallery,
  Home,
  VerfyPage,
} from "./components";
import { moduleServices, builtInServices } from "../services";

import SlideRoutes from "react-slide-routes";
import ProfileWall from "./components/user/Profile";

/**
 * imports in all of the routes for services
 */
function dynamicRoutes() {
  let allServices = [...moduleServices, ...builtInServices];
  let out = [];
  for (let i = 0; i < allServices.length; i++) {
    const curr = allServices[i];
    if (!curr.createRoute) {
      continue;
    }
    out.push({
      exact: false,
      path: curr.route,
      requiredAuth: curr.requiredAuth,
      element: <div>#TODO {curr.name}</div>,
    });
  }
  return out;
}

// list of routes and their restrictions so they can be
// generated easily
// only need to generate once?
const ROUTES = [
  { requiredAuth: 0, exact: false, path: "/", element: <Home /> },
  { requiredAuth: 0, exact: true, path: "/home", element: <Home /> },
  { requiredAuth: 0, exact: true, path: "/gallery", element: <DarbGallery /> },
  {
    requiredAuth: 0,
    exact: true,
    path: "/socialcalender",
    element: <Calender />,
  },
  { requiredAuth: 0, exact: true, path: "/auth", element: <AuthModal /> },
  { requiredAuth: 0, exact: false, path: "/verify", element: <VerfyPage /> },
  {
    requiredAuth: 0.5,
    exact: true,
    path: "/profile",
    element: <ProfileWall />,
  },
  {
    requiredAuth: 4,
    exact: false,
    path: "/adminpanel",
    element: <AdminPanel />,
  },

  ...dynamicRoutes(),
];

/**
 *  requiredAuth values:
 *    0.5 => hasnt verified email yet
 *    0 => no login required                      (or 1/2/3/4 reqs)
 *    1 => login required (non darbs can access)  (or 2/3/4 reqs)
 *    2 => login & socialDarb required            (or 3/4 reqs)
 *    3 => login & fullDarb required              (or 4 reqs)
 *    4 => admin status required
 */

/**
 *
 * @param {array of objects} routes
 * @returns a function of user authLevel that returns the
 *          routes the user can access
 */
function generateRouteFunction(routes) {
  let reactRoutes = routes.map((route) => (
    <Route
      exact={route.exact}
      path={route.path}
      element={route.element}
      requiredAuth={route.requiredAuth}
      key={route.path}
    />
  ));

  return (authLevel) => {
    let out = reactRoutes.filter(
      (route) => route.props.requiredAuth <= authLevel
    );
    return out;
  };
}

/**
 * Function that returns accessiible routes based on the users
 * auth level, should only have to be called a few times
 */
const ROUTE_FUNCTION = generateRouteFunction(ROUTES);

function SiteRoutes() {
  const { authLevel } = useSelector((state) => ({
    authLevel: state.user.data.authLevel ? state.user.data.authLevel : 0,
  }));

  return <SlideRoutes>{ROUTE_FUNCTION(authLevel)}</SlideRoutes>;
}

export default SiteRoutes;
