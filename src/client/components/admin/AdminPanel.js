/**
 * Author:	Nick Jasinski
 * Date:		2022-08-12
 *
 * Secondary routes / tab level for admin to manage the site (only users for now)
 * // TODO dynamic import for admin pages of other services?
 */

import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Container from "react-bootstrap/Container";
import { Nav } from "react-bootstrap";

import { UserPanel } from "./users";
import { LinkContainer } from "react-router-bootstrap";

import { moduleServices } from "../../../services";
import { clearAdminStore } from "../../store/admin";
import { useDispatch } from "react-redux";

/**
 * converts the service json file into a nav tab and route content
 * @param {object} service service json
 * @returns
 */
function serivceToTC(service) {
  const tab = (
    <Nav.Item key={service.moduleName}>
      <LinkContainer to={"/adminpanel" + service.route}>
        <Nav.Link eventKey={service.moduleName}>{service.name}</Nav.Link>
      </LinkContainer>
    </Nav.Item>
  );

  let content;

  if (service.element) {
    // For if its one of the built in admin panels
    content = (
      <Route
        key={service.moduleName}
        path={service.route + "/*"}
        element={service.element}
      />
    );
  } else {
    content = (
      <Route
        key={service.moduleName}
        path={service.route}
        element={
          <Suspense fallback={<div>Loading...</div>}>
            {React.lazy(() => import(`${service.moduleName}/submodules/Admin`))}
          </Suspense>
        }
      />
    );
  }
  return {
    tab,
    content,
  };
}

/**
 * admin panel components which are built into backbone
 */
const BUILT_IN_ADMIN = [
  {
    importAdmin: true,
    name: "Users",
    moduleName: "users",
    route: "/users",
    element: <UserPanel />,
  },
];

/**
 * Turns all of the admin panels from modules (and built in)
 * into nav tabs and route elements
 * @returns object with navlink array .tabs & route array .content
 */
function servicesToTCS() {
  let tcs = { tabs: [], content: [] };
  let all = [...moduleServices, ...BUILT_IN_ADMIN];
  for (let i = 0; i < all.length; i++) {
    if (all[i].importAdmin) {
      const { tab, content } = serivceToTC(all[i]);
      tcs.tabs.push(tab);
      tcs.content.push(content);
    }
  }
  return tcs;
}

function clearAllIntervals() {
  const upperBound = setInterval(() => {}, 999999);
  for (let i = 1; i < upperBound + 1; i++) {
    clearInterval(i);
  }
}

function clearAllTimeouts() {
  const upperBound = setTimeout(() => {}, 999999);
  for (let i = 1; i < upperBound + 1; i++) {
    clearTimeout(i);
  }
}

function AdminPanel() {
  const location = useLocation();
  const dispatch = useDispatch();
  /**
   * Clear any sus intervals, timeouts
   * cheap way of defending against lurking from other services
   * isnt very good but it protects a tiny bit
   */
  useEffect(() => {
    clearAllIntervals();
    clearAllTimeouts();
    return () => {
      if (location.pathname.indexOf("adminpanel") == -1) {
        dispatch(clearAdminStore());
      }
    };
  }, []);
  const dynamicTCS = servicesToTCS();
  return (
    <Container className="mainContent">
      <Nav variant="tabs">{dynamicTCS.tabs}</Nav>
      <Routes>{dynamicTCS.content}</Routes>
    </Container>
  );
}

export default AdminPanel;
