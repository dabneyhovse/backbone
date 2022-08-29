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
import ReactLoading from "react-loading";

import { IoMdArrowRoundBack } from "react-icons/io";

import { auth } from "../../store/user";
import { updateModalVisibility } from "../../store/authModal";

import "./AuthModal.css";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const CALTECH_REGEX = /.*@caltech\.edu/;
const validateEmail = (email, regex) => {
  return !!email.match(regex);
};

function AuthModal() {
  // Hooks
  const [authMode, setAuthMode] = useState("signin");
  const [username, setUsername] = useState("");
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
    if (authMode == "signup") {
      if (password !== passwordConfirm) {
        error.passwordConfirm = "Passwords do not match.";
      }
      if (caltechEmail === "") {
        error.caltechEmail = "Caltech Email cannot be empty.";
      } else if (!validateEmail(caltechEmail, EMAIL_REGEX)) {
        error.caltechEmail = "Invalid email address";
      } else if (!validateEmail(caltechEmail, CALTECH_REGEX)) {
        error.caltechEmail = "Caltech email does not end in @caltech.edu";
      }
      if (personalEmail === "") {
        error.personalEmail = "Personal Email cannot be empty.";
      } else if (!validateEmail(personalEmail, EMAIL_REGEX)) {
        error.personalEmail = "Invalid email address";
      } else if (validateEmail(personalEmail, CALTECH_REGEX)) {
        error.personalEmail = "Personal email should not be caltech email";
      }
    }
    if (password === "") {
      error.password = "Password cannot be empty.";
    } else if (password.length < 8) {
      error.password = "Password must be at least 8 characters long.";
    }
    if (username === "") {
      error.username = "Username cannot be empty.";
    }

    if (Object.keys(error).length !== 0) {
      setFormError(error);
      return;
    }

    dispatch(auth(username, password, authMode, personalEmail, caltechEmail));
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

  if (location.pathname == "/auth" && user.id !== undefined) {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  }

  let hidden = !visible || location.pathname == "/auth";

  /**
   * if hidden changed then the form should be cleared
   */
  useEffect(() => {
    setUsername("");
    setPersonalEmail("");
    setCaltechEmail("");
    setPassword("");
    setPasswordConfirm("");
  }, [hidden]);

  /**
   * if user is logged in hide anyway
   */
  if (!hidden && user.id !== undefined) {
    hidden = true;
  }
  return (
    <div className={`Auth-form-container ${hidden ? "hidden" : ""}`}>
      <div
        className={`Auth-blackout ${hidden ? "hidden" : ""}`}
        onClick={handleBack}
      ></div>
      <form className={`Auth-form ${hidden ? "hidden" : ""}`}>
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
            {authMode == "signin"
              ? "Not registered yet?"
              : "Already registered?"}{" "}
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
            <label>Username</label>
            <input
              type="username"
              className="form-control mt-1"
              placeholder="Enter username"
              onChange={(event) => {
                setUsername(event.target.value);
                clearError("username");
              }}
              value={username}
            />
            <small className="Auth-error">{formError.username}</small>
          </div>

          {authMode == "signin" ? null : (
            <React.Fragment>
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
                  value={personalEmail}
                />
                <small className="Auth-error">{formError.personalEmail}</small>
              </div>

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
                  value={caltechEmail}
                />
                <small className="Auth-error">{formError.caltechEmail}</small>
              </div>
            </React.Fragment>
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
              value={password}
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
                value={passwordConfirm}
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
