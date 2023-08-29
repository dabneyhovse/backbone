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

// TODO change into lazy dynamic imports + use serviceConfigs to make tabbar.
import { moduleImports, moduleServices } from "../../../services";
import { clearAdminStore } from "../../store/admin";
import { useDispatch } from "react-redux";
import { GroupPanel } from "./groups";

// /**
//  * converts the service json file into a nav tab and route content
//  * @param {object} service service json
//  * @returns
//  */
// async function serivceToTC(service) {
//   const tab = (
//     <Nav.Item key={service.moduleName}>
//       <LinkContainer to={"/adminpanel/" + service.route}>
//         <Nav.Link eventKey={service.moduleName}>{service.name}</Nav.Link>
//       </LinkContainer>
//     </Nav.Item>
//   );

//   let content;

//   if (service.element) {
//     // For if its one of the built in admin panels
//     content = (
//       <Route
//         key={service.moduleName}
//         path={"/" + service.route + "/*"}
//         element={service.element}
//       />
//     );
//   } else {
//     let { default: CurrModule } = await moduleImports[service.moduleName].admin;
//     content = (
//       <Route
//         key={service.moduleName}
//         path={"/" + service.route + "/*"}
//         element={<CurrModule />}
//       />
//     );
//   }
//   return {
//     tab,
//     content,
//   };
// }

// /**
//  * admin panel components which are built into backbone
//  */
// const BUILT_IN_ADMIN = [
//   {
//     importAdmin: true,
//     name: "Users",
//     moduleName: "users",
//     route: "users",
//     element: <UserPanel />,
//   },
//   {
//     importAdmin: true,
//     name: "Groups",
//     moduleName: "groups",
//     route: "groups",
//     element: <GroupPanel />,
//   },
// ];

// /**
//  * Turns all of the admin panels from modules (and built in)
//  * into nav tabs and route elements
//  * @returns object with navlink array .tabs & route array .content
//  */
// async function servicesToTCS() {
//   let tcs = { tabs: [], content: [] };
//   let all = [...BUILT_IN_ADMIN, ...moduleServices];
//   for (let i = 0; i < all.length; i++) {
//     if (all[i].importAdmin) {
//       const { tab, content } = await serivceToTC(all[i]);
//       tcs.tabs.push(tab);
//       tcs.content.push(content);
//     }
//   }
//   return tcs;
// }

// const dynamicTCS = await servicesToTCS();

function AdminPanel() {
  // const location = useLocation();
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   return () => {
  //     if (location.pathname.indexOf("adminpanel") == -1) {
  //       dispatch(clearAdminStore());
  //     }
  //   };
  // }, []);

  // return (
  //   <Container className="mainContent">
  //     <Nav variant="tabs">{dynamicTCS.tabs}</Nav>
  //     <Routes>{dynamicTCS.content}</Routes>
  //   </Container>
  // );
  return (
    <Container className="mainContent">
    </Container>
  );
}

export default AdminPanel;
