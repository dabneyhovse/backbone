/**
 * Author:	Nick Jasinski
 *
 * Key Panel that allows editing of keys
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table } from "react-bootstrap";

import { fetchAdminScopes } from "../../../store/admin";

import "./index.css";
import ScopeRow from "./ScopeRow";
import ScopeForm from "./ScopeForm";
import KeyModal from "./KeyModal";

function ScopePanel() {
  const dispatch = useDispatch();
  const { scopes } = useSelector((state) => ({
    scopes: state.admin.scopes,
  }));

  const [show, setShow] = useState(false);
  const [popup, setPopup] = useState({});

  const triggerPopup = (title, content, buttons) => {
    setShow(true);
    setPopup({ title, content, buttons });
  };

  const handleNew = () => {
    triggerPopup(
      "Create New Api Key",
      <ScopeForm
        setShow={setShow}
        data={{ name: "", description: "" }}
        triggerPopup={triggerPopup}
        creatingNew={true}
      ></ScopeForm>,
      []
    );
  };

  useEffect(() => {
    dispatch(fetchAdminScopes());
  }, []);

  return (
    <React.Fragment>
      <KeyModal show={show} setShow={setShow} {...popup} />
      <p>
        API scopes control what API endpoint an api key is able to be used for.
        So if you wanted an api key to have access to check a user's dbux balance
        you woud give it the dbux-get scope. This is a rough setup but I dont
        want env variable api keys.
      </p>
      <Table striped bordered hover className="p-3">
        <thead>
          <tr>
            <td>ID</td>
            <td>Scope name</td>
            <td>Description</td>
          </tr>
        </thead>
        <tbody>
          {scopes.map((scope) => (
            <ScopeRow
              setShow={setShow}
              triggerPopup={triggerPopup}
              key={scope.id}
              data={scope}
            />
          ))}
        </tbody>
      </Table>
      <Button onClick={handleNew}>Create New Api Scope</Button>
    </React.Fragment>
  );
}

export default ScopePanel;
