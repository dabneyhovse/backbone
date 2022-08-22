/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * Blank page for just the auth modal
 */

import React from "react";
import { connect } from "react-redux";
import { updateModalStatus } from "../../store/authModal";
import AuthModal from "./AuthModal";

// TODO include steryotipical smiling people activities in background

class AuthPage extends React.Component {
  componentDidMount() {
    this.props.showModal();
  }

  render() {
    return (
      <div className="auth-background">
        <div className="login-logo-container">
          <div id="login-logo"></div>
        </div>
        <AuthModal />
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    showModal: () => {
      dispatch(updateModalStatus(true));
    },
  };
};

export default connect(null, mapDispatch)(AuthPage);
