/**
 * Author:	Nick Jasinski
 * Date:		2022-08-12
 *
 * Secondary routes / tab level for admin to manage the site (only users for now)
 * // TODO dynamic import for admin pages of other services?
 */

import React, { useEffect, useState, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Container from "react-bootstrap/Container";
import { Nav } from "react-bootstrap";

import { UserPanel } from "./users";
import { LinkContainer } from "react-router-bootstrap";

// TODO change into lazy dynamic imports + use serviceConfigs to make tabbar.
import { serviceConfigs } from "../../../services";
import { clearAdminStore } from "../../store/admin";
import { useDispatch } from "react-redux";
import { GroupPanel } from "./groups";

/**
 * converts the service json file into a nav tab and route content
 * @param {object} service service json
 * @returns
 */
async function serivceToTC(service) {
  const tab = (
    <Nav.Item key={service.moduleName}>
      <LinkContainer to={"/adminpanel/" + service.route}>
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
        path={"/" + service.route + "/*"}
        element={service.element}
      />
    );
  } else {
    let { default: CurrModule } = await import(service.moduleName + "/Admin");
    content = (
      <Route
        key={service.moduleName}
        path={"/" + service.route + "/*"}
        element={<CurrModule />}
      />
    );
  }
  return {
    tab,
    content,
  };
}
const addSuspense = (lazy) => {
  return <Suspense fallback={<div>loading</div>}>{lazy}</Suspense>;
};

const Frotator = React.lazy(() => import("service-frotator/Admin"));
const Example = React.lazy(() => import("service-example/Admin"));
// const APIRoutes = React.lazy(() => import("./api/ApiRoutes"));

/**
 * admin panel components which are built into backbone
 */
const BUILT_IN_ADMIN = [
  {
    importAdmin: true,
    name: "About",
    moduleName: "about",
    route: "",
    element: (
      <div>
        This is the Backbone admin panel. Here you can manage services on the website. If you're looking for user and group configuration, you're in the wrong place! Go to the IdM or Keycloak admin panel.
      </div>
    ),
  },
  // {
  //   importAdmin: true,
  //   name: "Users",
  //   moduleName: "users",
  //   route: "users",
  //   element: <UserPanel />,
  // },
  // {
  //   importAdmin: true,
  //   name: "Groups",
  //   moduleName: "groups",
  //   route: "groups",
  //   element: <GroupPanel />,
  // },
  // {
  //   importAdmin: true,
  //   name: "API",
  //   moduleName: "api",
  //   route: "api",
  //   element: <APIRoutes />,
  // },
  {
    importAdmin: true,
    name: "Frotator",
    moduleName: "service-frotator",
    route: "frotator",
    element: <Frotator />,
  },
  {
    importAdmin: true,
    name: "Example",
    moduleName: "service-example",
    route: "example",
    element: <Example />,
  },
];

/**
 * Turns all of the admin panels from modules (and built in)
 * into nav tabs and route elements
 * @returns object with navlink array .tabs & route array .content
 */
async function servicesToTCS() {
  let tcs = { tabs: [], content: [] };
  let all = [...BUILT_IN_ADMIN];
  for (let i = 0; i < all.length; i++) {
    if (all[i].importAdmin) {
      const { tab, content } = await serivceToTC(all[i]);
      tcs.tabs.push(tab);
      tcs.content.push(content);
    }
  }
  return tcs;
}

const dynamicTCS = await servicesToTCS();

function AdminPanel() {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      if (location.pathname.indexOf("adminpanel") == -1) {
        dispatch(clearAdminStore());
      }
    };
  }, []);

  return (
    <Container className="mainContent">
      <Nav variant="tabs">{dynamicTCS.tabs}</Nav>
      <Routes>{dynamicTCS.content}</Routes>
    </Container>
  );
  // return (
  //   <Container className="mainContent">
  //   </Container>
  // );
}

export default AdminPanel;
