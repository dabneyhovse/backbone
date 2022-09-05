/**
 * Author:	Nick Jasinski
 * Date:		2022-09-05
 *
 * User card display for admin components
 */

import React from "react";
import { LinkContainer } from "react-router-bootstrap";

function UserRow(props) {
  const { user } = props;

  return (
    <LinkContainer to={`./${user.id}`}>
      <tr className = "user-row">
        <td>{user.id}</td>
        <td>{user.username}</td>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.caltechEmail}</td>
        <td>{user.personalEmail}</td>
      </tr>
    </LinkContainer>
  );
}

export default UserRow;
