/**
 * Author:	Nick Jasinski
 *
 * Key Panel that allows editing of keys
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";

import { fetchAdminKeys } from "../../../store/admin";
import KeyRow from "./KeyRow";
import KeyModal from "./KeyModal";
import "./index.css";

function KeyPanel() {
  const dispatch = useDispatch();
  const { keys } = useSelector((state) => ({
    keys: state.admin.keys,
  }));

  const [changed, setChanged] = useState({});
  const [show, setShow] = useState(false);
  const [popup, setPopup] = useState({});

  const addToChanged = (id, obj) => {
    setChanged({ ...changed, [id]: obj });
    console.log(changed);
  };

  const triggerPopup = (title, content, buttons) => {
    setShow(true);
    setPopup({ title, content, buttons });
  };

  useEffect(() => {
    dispatch(fetchAdminKeys());
  }, []);

  return (
    <React.Fragment>
      <KeyModal show={show} setShow={setShow} {...popup} />
      <p>
        API keys give darbs access to various api endpoints in backbone and
        related services. Which endpoints they can access is controlled by what
        scopes they have. Click to edit a key.
      </p>
      <Table striped bordered hover className="p-3">
        <thead>
          <tr>
            <td>ID</td>
            <td>Key name</td>
            <td>Description</td>
            <td>Scopes</td>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <KeyRow
              setShow={setShow}
              triggerPopup={triggerPopup}
              key={key.id}
              data={key}
              addToChanged={addToChanged}
            />
          ))}
        </tbody>
      </Table>
    </React.Fragment>
  );
}

export default KeyPanel;
