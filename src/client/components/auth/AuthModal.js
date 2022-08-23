/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * Implement login modal using the ReactModaLogin package
 *
 * TODO signup by caltech email and affilation
 */

import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { IoMdArrowRoundBack } from "react-icons/io";

import { auth } from "../../store/user";
import { updateModalVisibility } from "../../store/authModal";

import "./AuthModal.css";

function AuthModal() {
  // Hooks
  const [authMode, setAuthMode] = useState("signin");
  const [personalEmail, setPersonalEmail] = useState("");
  const [caltechEmail, setCaltechEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, visible } = useSelector((state) => ({
    visible: state.auth.visible,
    user: state.user,
  }));

  // handle form submission and form errors
  const clearError = (err) => {
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

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  /**
   * handle clicking the back arrow (either going to home if at /auth
   * or dissappear if on any other page)
   * @param {click event} event
   */
  const handleBack = () => {
    if (location.pathname == "/auth") {
      // Go back in history or just go directly to "/" on click
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate("/", { replace: true });
      }
    }
    dispatch(updateModalVisibility(false));
  };

  return (
    <div
      className={`Auth-form-container ${
        visible || location.pathname == "/auth" ? "" : "hidden"
      }`}
    >
      <div className={`Auth-blackout ${visible ? "" : "hidden"}`}></div>
      <form className={`Auth-form ${visible ? "" : "hidden"}`}>
        <div onClick={handleBack}>
          <IoMdArrowRoundBack
            className="Auth-close"
            color="black"
            size="1.5em"
          />
        </div>
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

          {authMode == "signin" ? null : (
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
          {authMode == "signin" ? null : (
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

// const mapDispatch = (dispatch) => {
//   return {
//     hideModal: () => {
//       dispatch(updateModalStatus(false, false));
//     },
//     login: (email, password) => {
//       dispatch(auth(email, password, "login"));
//     },
//     register: (email, password, verification) => {
//       dispatch(auth(email, password, "signup", verification));
//     },
//   };
// };

export default AuthModal;
