import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import {
  createAdminKey,
  deleteAdminKey,
  fetchAdminKeys,
  gotAdminNewKey,
  updateAdminKey,
} from "../../../store/admin";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ScopeSelector from "./ScopeSelelctor";

function KeyForm(props) {
  const [changed, setChanged] = useState(props.data);

  const dispatch = useDispatch();
  const creatingNew = props.creatingNew;
  const triggerClose = () => props.setShow(false);
  const handleChange = (event) => {
    setChanged({ ...changed, [event.target.name]: event.target.value });
  };

  // accessor and setter to pass to scope selector
  const scopes = changed["scopes"] || [];
  const setScopes = (value) => {
    setChanged({ ...changed, scopes: value });
  };

  const submitEdits = () => {
    if (creatingNew) {
      dispatch(createAdminKey(changed));
      triggerClose();
      props.triggerPopup(
        `New Api Key Value`,
        <NewApiKeyModalBody setShow={props.setShow} />,
        []
      );
    } else {
      dispatch(updateAdminKey(changed));
      triggerClose();
    }
  };

  const submitRegenerate = () => {
    dispatch(updateAdminKey({ id: props.data.id, regenerate: true }));
    triggerClose();
    // trigger the popup again lol
    props.triggerPopup(
      `New Api Key Value`,
      <NewApiKeyModalBody setShow={props.setShow} />,
      []
    );
  };

  const submitDelete = () => {
    dispatch(deleteAdminKey({ id: props.data.id }));
    triggerClose();
  };

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          aria-label="API key name"
          placeholder="API key name"
          value={changed.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          as="textarea"
          name="description"
          aria-label="API key description"
          placeholder="API key description"
          value={changed.description}
          onChange={handleChange}
        />
      </Form.Group>

      <ScopeSelector value={scopes || ""} setValue={setScopes} />

      {creatingNew ? (
        ""
      ) : (
        <>
          <hr />
          <Form.Label>
            Dangerous actions below lol (TODO add confirm modal)
          </Form.Label>
          <div className="d-flex justify-content-end">
            <Button
              className="ms-2"
              variant="danger"
              type="submit"
              onClick={submitDelete}
            >
              Delete Key
            </Button>
            <Button
              className="ms-2"
              variant="warning"
              type="submit"
              onClick={submitRegenerate}
            >
              Regenerate API Key
            </Button>
          </div>
        </>
      )}
      <hr />

      <div className="d-flex justify-content-end">
        <Button
          className="ms-2"
          variant="primary"
          type="submit"
          onClick={submitEdits}
        >
          {creatingNew ? "Create" : "Update"}
        </Button>
        <Button
          className="ms-2"
          variant="secondary"
          type="submit"
          onClick={triggerClose}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}

/**
 * Component specifically made to display new api key value
 * @param {*} props
 * @returns
 */
function NewApiKeyModalBody(props) {
  const key_value = useSelector((state) => state.admin.keys.new_key);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(gotAdminNewKey(undefined));
    props.setShow(false);
    // refetch keys as brute clear key hash if it was incuded
    dispatch(fetchAdminKeys());
  };

  return (
    <>
      <div>
        {key_value == undefined ? (
          "Generating API key, please wait. If this doesnt update after a while there was probably an error."
        ) : (
          <>
            <p>New api key:</p>
            <code
              onClick={() => {
                navigator.clipboard.writeText(key_value);
                toast.success("Copied api key");
              }}
            >
              {key_value}
            </code>
            <p>
              This is the only time the unhashed key will be available, make
              sure to copy it. (click to copy)
            </p>
          </>
        )}
      </div>
      <div className="d-flex justify-content-end">
        <Button variant="primary" type="submit" onClick={handleClose}>
          Close
        </Button>
      </div>
    </>
  );
}

export default KeyForm;
