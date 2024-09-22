/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * Main app file with highest level components (toasts, route container etc)
 */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Routes from "./routes";
// import { AuthModal, Loading, Navdarb } from "./components";
import AuthModal from "./components/auth/AuthModal";
import Loading from "./components/layout/Loading";
import Navdarb from "./components/nav/Navdarb";

import { me } from "./store/user";

function App() {
  const dispatch = useDispatch();
  const { loaded } = useSelector((state) => ({ loaded: state.auth.loaded }));

  useEffect(() => {
    dispatch(me());
  }, []);

  return (
    <>
      {loaded ? (
        <>
          <Navdarb />
          {/* <AuthModal /> */}
          <Routes />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
