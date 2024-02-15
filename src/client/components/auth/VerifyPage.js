/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * Page for waiting to verify ur hash
 */

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ReactLoading from "react-loading";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyUser } from "../../store/user";

const HASH_LENGTH = 64;

function VerifyPage() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyUser(location.hash));
  }, []);

  // TODO: include your password reset modal component below
  // trigger the popup (make a new store or add onto one) after checking the hash in src/client/store/user.js

  /**
   * yeah i kinda stole the classes from the other thing
   * this is still "Auth" too so I dont feel too bad abt it
   */
  return (
    <div className="Auth-form-container dark">
      <div className="Auth-form">
        <div className="verify-content">
          <h2>Please wait while we verify you.</h2>
          <ReactLoading
            type={"spinningBubbles"}
            color={"rgb(14, 78, 40)"}
            height={"100px"}
            width={"100px"}
          />
        </div>
      </div>
    </div>
  );
}

export default VerifyPage;
