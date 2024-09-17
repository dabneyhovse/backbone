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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    navigate('/home', { replace: true });
    dispatch(logout());
  });

  return (<></>);
}

export default PostLogout;
