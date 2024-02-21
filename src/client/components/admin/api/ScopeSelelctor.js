import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminScopes } from "../../../store/admin";

function ScopeSelector(props) {
  // the parent component will pass setValue
  // and value so it this can communicate back
  // easily
  const { value, setValue } = props;
  const [scope, setScope] = useState("default");
  const scopes = useSelector((state) => state.admin.scopes);
  const dispatch = useDispatch();

  // fetch scopes on load
  useEffect(() => {
    dispatch(fetchAdminScopes());
  }, []);

  // handle dropdown changes
  const handleScopeChange = (event) => setScope(event.target.value);

  // add scope button
  const handleAddScope = () => {
    if (scope == "default") {
      // TODO error message, or just toast
    } else if (!value.includes(scopes[scope])) {
      setValue([...value, scopes[scope]]);
    }
  };

  // remove scope button
  const handleRemoveScope = () => {
    if (scope == "default") {
      // TODO error message, or just toast
    } else {
      setValue(value.filter((s) => s.id !== scopes[scope].id));
    }
  };

  return (
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Api Key Scopes</Form.Label>
      <Form.Control
        className="mb-3"
        type="text"
        as="textarea"
        name="scopes"
        disabled
        aria-label="API key scopes"
        placeholder="API key scopes"
        value={value.map((s) => s.name).join(", ")}
      />
      <InputGroup className="mb-3">
        <Form.Select
          onChange={handleScopeChange}
          aria-label="Default select example"
        >
          <option value="default">Select Scope</option>
          {scopes.map((s, idx) => {
            return (
              <option key={s.id} value={idx}>
                {s.name}
              </option>
            );
          })}
        </Form.Select>
        <Button
          onClick={handleAddScope}
          variant="outline-primary"
          id="button-addon1"
        >
          +
        </Button>
        <Button
          onClick={handleRemoveScope}
          variant="outline-danger"
          id="button-addon1"
        >
          -
        </Button>
      </InputGroup>
      <Form.Text>Use the dropdown and buttons to add / remove scopes</Form.Text>
    </Form.Group>
  );
}

export default ScopeSelector;
