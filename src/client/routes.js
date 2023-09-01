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
import { Route } from "react-router-dom";
import Loading from "./components/layout/Loading";
import SlideRoutes from "react-slide-routes";
import ManagerContainer from "./components/layout/ManagerContainer";

// lazy load in the components
const Home = React.lazy(() => import("./components/basic/Home"));
const Gallery = React.lazy(() => import("./components/basic/DarbGallery"));
const Calender = React.lazy(() => import("./components/basic/Calender"));
const AuthModal = React.lazy(() => import("./components/auth/AuthModal"));
const VerifyPage = React.lazy(() => import("./components/auth/VerifyPage"));
const ProfileWall = React.lazy(() => import("./components/user/Profile"));
const AdminPanel = React.lazy(() => import("./components/admin/AdminPanel"));

// SERVICES NOTE: add services lazy load main component here:
const Example = React.lazy(() => import("service-example/React"));
const Frotator = React.lazy(() => import("service-frotator/React"));

// SERVICES NOTE: add services redux here:
import exampleReducer from "service-example/Redux"
import frotatorReducer from "service-frotator/Redux"

/**
 * quick wrapper comoponent for suspense & attach redux manager
 * for the dynamic redux store
 */
function LazyAuth({ lazyElement, requiredAuth, authLevel, managerContainer }) {
  if (authLevel >= requiredAuth) {
    return (
      <Suspense fallback={<Loading />}>
        {/* {managerContainer == null ? <></> : managerContainer} */}
        {lazyElement}
      </Suspense>
    );
  }
  return <></>;
}

/**
 *  requiredAuth values:
 *    0.5 => hasnt verified email yet
 *    0 => no login required                      (or 1/2/3/4 reqs)
 *    1 => login required (non darbs can access)  (or 2/3/4 reqs)
 *    2 => login & socialDarb required            (or 3/4 reqs)
 *    3 => login & fullDarb required              (or 4 reqs)
 *    4 => admin status required
 */

function SiteRoutes() {
  const { authLevel } = useSelector((state) => ({
    authLevel: state.user.data.authLevel ? state.user.data.authLevel : 0,
  }));

  return (
    <SlideRoutes>
      <Route
        exact={false}
        path={"/"}
        element={
          <LazyAuth
            requiredAuth={0}
            authLevel={authLevel}
            lazyElement={<Home />}
          />
        }
      />

      <Route
        exact={true}
        path={"/home"}
        element={
          <LazyAuth
            requiredAuth={0}
            authLevel={authLevel}
            lazyElement={<Home />}
          />
        }
      />

      <Route
        exact={true}
        path={"/gallery"}
        element={
          <LazyAuth
            requiredAuth={0}
            authLevel={authLevel}
            lazyElement={<Gallery />}
          />
        }
      />

      <Route
        exact={true}
        path={"/socialcalender"}
        element={
          <LazyAuth
            requiredAuth={0}
            authLevel={authLevel}
            lazyElement={<Calender />}
          />
        }
      />

      <Route
        exact={true}
        path={"/auth"}
        element={
          <LazyAuth
            requiredAuth={0}
            authLevel={authLevel}
            lazyElement={<AuthModal />}
          />
        }
      />

      <Route
        exact={false}
        path={"/verify"}
        element={
          <LazyAuth
            requiredAuth={0}
            authLevel={authLevel}
            lazyElement={<VerifyPage />}
          />
        }
      />

      <Route
        exact={true}
        path={"/profile"}
        element={
          <LazyAuth
            requiredAuth={0.5}
            authLevel={authLevel}
            lazyElement={<ProfileWall />}
          />
        }
      />

      <Route
        exact={false}
        path={"/adminpanel/*"}
        element={
          <LazyAuth
            requiredAuth={4}
            authLevel={authLevel}
            lazyElement={<AdminPanel />}
          />
        }
      />
      {/* SERVICES NOTE: add your services main component route below
            if your service needs redux, make sure you add a
            ManagerContainer (see example below)
      */}

      <Route
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
            requiredAuth={4}
            authLevel={authLevel}
            lazyElement={<Example />}
          />
        }
      />

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
            requiredAuth={4}
            authLevel={authLevel}
            lazyElement={<Frotator />}
          />
        }
      />
    </SlideRoutes>
  );
}

export default SiteRoutes;
