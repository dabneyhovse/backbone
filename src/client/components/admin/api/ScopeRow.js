/**
 * Author:	Nick Jasinski
 *
 * Key row display for admin components
 */

import React from "react";
import ScopeForm from "./ScopeForm";

function ScopeRow(props) {
  const { data } = props;

  const handleClick = () => {
    props.triggerPopup(
      `Edit Api Scope ${data.id}`,
      <ScopeForm
        setShow={props.setShow}
        data={data}
        triggerPopup={props.triggerPopup}
        creatingNew={false}
      ></ScopeForm>,
      []
    );
  };

  return (
    <tr onClick={handleClick} className="scope-row">
      <td>{data.id}</td>
      <td>{data.name}</td>
      <td>{data.description}</td>
    </tr>
  );
}

export default ScopeRow;
