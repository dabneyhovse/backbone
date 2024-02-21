// TODO, create and delete groups

import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminGroups } from "../../../store/admin";

function GroupPanel(props) {
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => ({
    groups: state.admin.groups,
  }));

  const [newGroup, setNewGroup] = useState({ groupName: "", description: "" });

  const onChange = (event) => {
    setNewGroup({ ...newGroup, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    dispatch(fetchAdminGroups());
  }, []);

  return (
    <React.Fragment>
      <p>
        Groups are a structure used by doku wiki to determine what content a
        user can access. For example a user within the group "full" can access
        content meant for full darbs. You can add users to a group via the users
        tab above. Currently you cannot add new groups (via this interface, just
        connect to the db on lenin directly to add one). //TODO alow adding new
        groups
      </p>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Group Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            return (
              <tr>
                <td>{group.groupName}</td>
                <td>{group.description}</td>
              </tr>
            );
          })}
          {/* <tr>
            <td>
              <Form.Group controlId="groupName">
                <Form.Control
                  onChange={onChange}
                  name="groupName"
                  type="groupName"
                  placeholder="Enter Group Name"
                  value={newGroup.groupName}
                />
              </Form.Group>
            </td>

            <td>
              <Form.Group controlId="description">
                <Form.Control
                  onChange={onChange}
                  name="description"
                  type="description"
                  placeholder="Enter Group Description"
                  value={newGroup.description}
                />
              </Form.Group>
            </td>
          </tr> */}
        </tbody>
      </Table>
    </React.Fragment>
  );
}

export default GroupPanel;
