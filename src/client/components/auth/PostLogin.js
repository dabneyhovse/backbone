/**
 * Author:	Melissa Foster
 * Date:		2024-09-16
 *
 * Post-login callback URL to get user info, set client user state, and redirect to home page
 *
 */

import { memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import { me } from "../../store/user";

function PostLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [searchParams, setSearchParams] = useSearchParams();

  const redirectURL = searchParams.get('redirect') ? decodeURIComponent(searchParams.get('redirect')) : null;

  useEffect(() => {
    navigate(redirectURL || '/', { replace: true });
    dispatch(me());
  }, []);

  return null;
}

export default memo(PostLogin);
