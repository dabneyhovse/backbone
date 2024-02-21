import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useDispatch } from "react-redux";
import {
  createAdminScope,
  deleteAdminScope,
  updateAdminScope,
} from "../../../store/admin";

function ScopeForm(props) {
  const [changed, setChanged] = useState(props.data);
  const creatingNew = props.creatingNew;

  const dispatch = useDispatch();
  const triggerClose = () => props.setShow(false);
  const handleChange = (event) => {
    setChanged({ ...changed, [event.target.name]: event.target.value });
  };

  const submitEdits = () => {
    if (creatingNew) {
      dispatch(createAdminScope(changed));
      triggerClose();
    } else {
      dispatch(updateAdminScope(changed));
      triggerClose();
    }
  };

  const submitDelete = () => {
    dispatch(deleteAdminScope({ id: props.data.id }));
    triggerClose();
  };

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          aria-label="API scope name"
          placeholder="API scope name"
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
          aria-label="API scope description"
          placeholder="API scope description"
          value={changed.description}
          onChange={handleChange}
        />
      </Form.Group>

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
              Delete Scope
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

export default ScopeForm;
