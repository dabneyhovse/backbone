/**
 * Author:	Melissa Foster
 * Date:		2024-09-16
 *
 * Post-login callback URL to get user info, set client user state, and redirect to home page
 *
 */

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import { me } from "../../store/user";

function PostLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [searchParams, setSearchParams] = useSearchParams();

  const redirectURL = decodeURIComponent(searchParams.get('redirect'))

  useEffect(() => {
    navigate(redirectURL || '/', { replace: true });
    dispatch(me());
  });

  return (<></>);
}

export default PostLogin;
