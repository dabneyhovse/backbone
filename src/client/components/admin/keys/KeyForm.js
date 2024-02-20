import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { deleteAdminKey, updateAdminKey } from "../../../store/admin";
import { useDispatch } from "react-redux";

function KeyForm(props) {
  const [changed, setChanged] = useState(props.data);
  const dispatch = useDispatch();

  const triggerClose = () => props.setShow(false);

  const handleChange = (event) => {
    setChanged({ ...changed, [event.target.name]: event.target.value });
  };

  const submitEdits = () => {
    dispatch(updateAdminKey(changed));
    triggerClose();
  };

  const submitRegenerate = () => {
    dispatch(updateAdminKey({ id: props.data.id, regenerate: true }));
    triggerClose();
  };

  const submitDelete = () => {
    dispatch(deleteAdminKey({ id: props.data.id }));
    triggerClose();
  };

  return (
    <>
      <Form.Group className="mb-3" controlId="formBasicEmail">
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

      <Form.Group className="mb-3" controlId="formBasicEmail">
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

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>API Key Scopes</Form.Label>
        <Form.Control
          type="text"
          as="textarea"
          name="scopes"
          aria-label="API key scopes"
          placeholder="API key scopes"
          value={changed.scopes}
          onChange={handleChange}
        />
      </Form.Group>

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
      <hr />

      <div className="d-flex justify-content-end">
        <Button
          className="ms-2"
          variant="primary"
          type="submit"
          onClick={submitEdits}
        >
          Update
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

export default KeyForm;
