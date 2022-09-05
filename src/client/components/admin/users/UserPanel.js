/**
 * Author:	Nick Jasinski
 * Date:		2022-09-04
 *
 * Admin Panel that allows editing of users
 */

import React, { useEffect } from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import UserSearchPanel from "./UserSearchPanel";
import "./index.css";
import UserSinglePanel from "./UserSinglePanel";

function UserPanel() {
  useEffect(() => {
    // TODO request users default
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<UserSearchPanel />} />
      <Route path="/:userId" element={<UserSinglePanel />} />
    </Routes>
  );
}

export default UserPanel;
