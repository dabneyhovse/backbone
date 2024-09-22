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

import React, { Component, Suspense } from "react";
// import { lazy } from 'react';
import { connect, useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";
import Loading from "./components/layout/Loading";
import SlideRoutes from "react-slide-routes";
import ManagerContainer from "./components/layout/ManagerContainer";

// lazy load in the components
const Home = React.lazy(() => import("./components/basic/Home"));
const BlueMechanical = React.lazy(() =>
  import("./components/layout/BlueMechanical")
);
const Gallery = React.lazy(() => import("./components/basic/DarbGallery"));
const Calender = React.lazy(() => import("./components/basic/Calender"));
const AdminPanel = React.lazy(() => import("./components/admin/AdminPanel"));
const PostLogin = React.lazy(() => import("./components/auth/PostLogin"));
const PostLogout = React.lazy(() => import("./components/auth/PostLogout"));

// SERVICES NOTE: add services lazy load main component here:
// const Example = React.lazy(() => import("service-example/React"));
const Frotator = React.lazy(() => import("service-frotator/React"));

// SERVICES NOTE: add services redux here:
// import exampleReducer from "service-example/Redux";
import frotatorReducer from "service-frotator/Redux";

/**
 * quick wrapper comoponent for suspense & attach redux manager
 * for the dynamic redux store
 */
function LazyAuth({ lazyElement, requiredClaims, userClaims, managerContainer }) {
  if (
    requiredClaims.every((claim) => userClaims.includes(claim))
  ) {
    return (
      <Suspense fallback={<Loading />}>
        {/* {managerContainer == null ? <></> : managerContainer} */}
        {lazyElement}
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<Loading />}>
        {/* {managerContainer == null ? <></> : managerContainer} */}
        {<BlueMechanical />}
    </Suspense>
  );

}

/**
 *  See Keycloak admin console to view and configure roles
 */

function SiteRoutes() {
  const { userClaims } = useSelector((state) => ({
    userClaims: state.user?.backbone_roles ? state.user.backbone_roles : [],
  }));

  return (
    <SlideRoutes>
      <Route
        exact={false}
        path={"/"}
        element={
          <LazyAuth
            requiredClaims={[]}
            userClaims={userClaims}
            lazyElement={<Home />}
          />
        }
      />

      <Route
        exact={true}
        path={"/home"}
        element={
          <LazyAuth
            requiredClaims={[]}
            userClaims={userClaims}
            lazyElement={<Home />}
          />
        }
      />

      <Route
        exact={true}
        path={"/gallery"}
        element={
          <LazyAuth
            requiredClaims={[]}
            userClaims={userClaims}
            lazyElement={<Gallery />}
          />
        }
      />

      <Route
        exact={true}
        path={"/socialcalender"}
        element={
          <LazyAuth
            requiredClaims={[]}
            userClaims={userClaims}
            lazyElement={<Calender />}
          />
        }
      />
      <Route 
        exact={true}
        path={"/login"}
        element={
          <LazyAuth
            requiredClaims={[]}
            userClaims={userClaims}
            lazyElement={React.lazy(<Navigate to="/login"/>)}
          />
        }
      />
      <Route 
        exact={true}
        path={"/logout"}
        element={
          <LazyAuth
            requiredClaims={[]}
            userClaims={userClaims}
            lazyElement={React.lazy(<Navigate to="/logout"/>)}
          />
        }
      />
      <Route
        exact={true}
        path={"/auth/postlogin"}
        element={
          <LazyAuth
            requiredClaims={[]}
            userClaims={userClaims}
            lazyElement={<PostLogin />}
          />
        }
      />

      <Route
        exact={true}
        path={"/auth/postlogout"}
        element={
          <LazyAuth
            requiredClaims={[]}
            userClaims={userClaims}
            lazyElement={<PostLogout />}
          />
        }
      />

      <Route
        exact={false}
        path={"/adminpanel/*"}
        element={
          <LazyAuth
            requiredClaims={["backbone-admin"]}
            userClaims={userClaims}
            lazyElement={<AdminPanel />}
          />
        }
      />
      {/* SERVICES NOTE: add your services main component route below
            if your service needs redux, make sure you add a
            ManagerContainer (see example below)
      */}

      {/* <Route
        exact={false}
        path={"/example/*"}
        element={
          <LazyAuth
            managerContainer={
              <ManagerContainer
                reducer={exampleReducer}
                serviceKey={"example"}
              />
            }
            requiredClaims={["backbone-admin"]}
            userClaims={userClaims}
            lazyElement={<Example />}
          />
        }
      /> */}

      <Route
        exact={false}
        path={"/frotator/*"}
        element={
          <LazyAuth
            managerContainer={
              <ManagerContainer
                reducer={frotatorReducer}
                serviceKey={"frotator"}
              />
            }
            requiredClaims={["frotator-access"]}
            userClaims={userClaims}
            lazyElement={<Frotator />}
          />
        }
      />
      <Route
        path={"*"}
        exact={false}
        element={
          <LazyAuth
            requiredClaims={[]}
            userClaims={userClaims}
            lazyElement={<BlueMechanical />}
          />
        }
      />
    </SlideRoutes>
  );
}

export default SiteRoutes;
