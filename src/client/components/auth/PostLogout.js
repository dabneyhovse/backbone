/**
 * Author:	Melissa Foster
 * Date:		2024-09-16
 *
 * Post-logout callback URL to clear user state and redirect to home page
 *
 */

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../store/user";

function PostLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    navigate("/", { replace: true });
  });

  return null;
}

export default React.memo(PostLogout);
