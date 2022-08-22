/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * Implement login modal using the ReactModaLogin package
 *
 * TODO signup by caltech email and affilation
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { IoMdArrowRoundBack } from "react-icons/io";

import { auth } from "../../store/user";
import { updateModalStatus } from "../../store/authModal";

import "./AuthModal.css";

function AuthModal(props) {
  const [personalEmail, setPersonalEmail] = useState("");
  const [caltechEmail, setCaltechEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [formError, setFormError] = useState({});
  const clearError = (err) => {
    console.log(formError);
    setFormError({ ...formError, [err]: "" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let error = {};
    if (password !== passwordConfirm) {
      error.passwordConfirm = "Passwords do not match.";
    }
    if (password === "") {
      error.password = "Password cannot be empty.";
    }
    if (caltechEmail === "") {
      error.caltechEmail = "Caltech Email cannot be empty.";
    }
    if (personalEmail === "") {
      error.personalEmail = "Personal Email cannot be empty.";
    }
    if (error !== {}) {
      setFormError(error);
      return;
    }
  };

  let [authMode, setAuthMode] = useState("signin");

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <IoMdArrowRoundBack className="Auth-close" color="black" size="1.5em" />
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">
            Sign {authMode == "signin" ? "In" : "Up"}
          </h3>
          <div className="text-center">
            Not registered yet?{" "}
            <span
              className="link-primary"
              onClick={() => {
                changeAuthMode();
                setFormError({});
              }}
            >
              Sign {authMode == "signin" ? "Up" : "In"}
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Personal Email</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              onChange={(event) => {
                setPersonalEmail(event.target.value);
                clearError("personalEmail");
              }}
            />
            <small className="Auth-error">{formError.personalEmail}</small>
          </div>

          {authMode == "signin" ? (
            <></>
          ) : (
            <div className="form-group mt-3">
              <label>Caltech Email</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
                onChange={(event) => {
                  setCaltechEmail(event.target.value);
                  clearError("caltechEmail");
                }}
              />
              <small className="Auth-error">{formError.caltechEmail}</small>
            </div>
          )}

          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              onChange={(event) => {
                setPassword(event.target.value);
                clearError("password");
              }}
            />
            <small className="Auth-error">{formError.password}</small>
          </div>
          {authMode == "signin" ? (
            <></>
          ) : (
            <div className="form-group mt-3">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                onChange={(event) => {
                  setPasswordConfirm(event.target.value);
                  clearError("passwordConfirm");
                }}
              />
              <small className="Auth-error">{formError.passwordConfirm}</small>
            </div>
          )}

          <div className="d-grid gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              onSubmit={handleSubmit}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  );
}

const mapDispatch = (dispatch) => {
  return {
    hideModal: () => {
      dispatch(updateModalStatus(false, false));
    },
    login: (email, password) => {
      dispatch(auth(email, password, "login"));
    },
    register: (email, password, verification) => {
      dispatch(auth(email, password, "signup", verification));
    },
  };
};

const mapState = (state) => {
  return {
    visible: state.auth.visible,
    user: state.user,
  };
};

export default connect(mapState, mapDispatch)(AuthModal);
