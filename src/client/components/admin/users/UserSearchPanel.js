/**
 * Author:	Nick Jasinski
 * Date:		2022-09-04
 *
 * Admin Panel that allows editing of users
 */

import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Accordion, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { fetchAdminUsers } from "../../../store/admin";
import UserRow from "./UserRow";
import UserSearchPagination from "./UserSearchPagination";

const DEFAULT_SEARCH = {
  verification_status: "1",
  house_membership: "0",
  sort: "0",
};

function UserSearchPanel() {
  const [search, setSearch] = useState(DEFAULT_SEARCH);
  const dispatch = useDispatch();
  const { users } = useSelector((state) => ({
    users: state.admin.users,
  }));

  const onChange = (event) => {
    setSearch({ ...search, [event.target.name]: event.target.value });
  };

  const onSearch = (event) => {
    event.preventDefault();
    dispatch(fetchAdminUsers(search));
  };

  useEffect(() => {
    dispatch(fetchAdminUsers(DEFAULT_SEARCH));
  }, []);

  return (
    <Row className="mt-3">
      <Col sm="12">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Search Options</Accordion.Header>
            <Accordion.Body>
              <Form>
                <Form.Group className="mb-3" controlId="searchFormName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    onChange={onChange}
                    name="name"
                    type="name"
                    placeholder="Enter Name"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="searchFormUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    onChange={onChange}
                    name="username"
                    type="username"
                    placeholder="Enter username"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="searchFormEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    onChange={onChange}
                    name="email"
                    type="email"
                    placeholder="Enter email"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Membership Verification Status</Form.Label>
                  <Form.Select onChange={onChange} name="verification_status">
                    <option value="1">Any</option>
                    <option value="2">Verified</option>
                    <option value="3">Unverified</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>House Membership</Form.Label>
                  <Form.Select onChange={onChange} name="house_membership">
                    <option value="0">Any</option>
                    <option value="1">None</option>
                    <option value="2">Dabney</option>
                    <option value="3">Blacker</option>
                    <option value="4">Venerable</option>
                    <option value="5">Avery</option>
                    <option value="6">Fleming</option>
                    <option value="7">Ricketts</option>
                    <option value="8">Page</option>
                    <option value="9">LLoyd</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Sort By</Form.Label>
                  <Form.Select onChange={onChange} name="sort">
                    <option value="0">New Users First</option>
                    <option value="1">Old Users First</option>
                    <option value="2">Firstname A-Z</option>
                    <option value="3">Firstname Z-A</option>
                    <option value="4">Username A-Z</option>
                    <option value="5">Username Z-A</option>
                    <option value="6">Recently modified</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  className="mt-3"
                  onClick={onSearch}
                  variant="primary"
                  type="submit"
                >
                  Search
                </Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
      <Col sm="12" className="mt-3">
        <Table striped bordered hover className="p-3">
          <thead>
            <tr>
              <td>ID</td>
              <td>Username</td>
              <td>First Name</td>
              <td>Last Name</td>
              <td>Caltech email</td>
              <td>Personal email</td>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </Table>
        <UserSearchPagination updateList={onSearch} />
      </Col>
    </Row>
  );
}

export default UserSearchPanel;
