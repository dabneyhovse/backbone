/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * Main app file with highest level components (toasts, route container etc)
 */

import React from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import Routes from "./routes";
import { me } from "./store/user";
import { AuthModal, Navdarb } from "./components";

import "react-toastify/dist/ReactToastify.css";

class App extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.me();
  }

  render() {
    return (
      <>
        <ToastContainer />
        {this.props.loaded ? (
          <>
            <Navdarb />
            <AuthModal />
            <Routes />
          </>
        ) : (
          <div>loading animation goes brrrr</div>
        )}
      </>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    me: () => {
      dispatch(me());
    },
  };
};

const mapState = (state) => {
  return {
    loaded: state.auth.loaded,
  };
};

export default connect(mapState, mapDispatch)(App);
