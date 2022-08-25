/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * Blank page for just the auth modal
 */

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateNavVisibility } from "../../store/navbar";

function VerfyPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateNavVisibility(false));
  });
  return (
    <div className="auth-background">
      <div className="login-logo-container">
        <div id="login-logo"></div>
      </div>
    </div>
  );
}

export default VerfyPage;
