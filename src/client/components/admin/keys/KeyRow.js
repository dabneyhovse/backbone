/**
 * Author:	Nick Jasinski
 *
 * Key row display for admin components
 */

import React from "react";
import KeyForm from "./KeyForm";

function KeyRow(props) {
  const { data } = props;

  const handleClick = (event) => {
    console.log("DATA:\t", data);
    props.triggerPopup(
      `Edit Api Key ${data.id}`,
      <KeyForm setShow={props.setShow} data={data}></KeyForm>,
      []
    );
  };

  return (
    <tr onClick={handleClick} className="key-row">
      <td>{data.id}</td>
      <td>{data.name}</td>
      <td>{data.description}</td>
      <td>{data.scopes}</td>
    </tr>
  );
}

export default KeyRow;
