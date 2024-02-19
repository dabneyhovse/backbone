/**
 * Author:	Nick Jasinski
 * Date:		2022-09-04
 *
 * Admin Panel that allows editing of users
 */

import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTextArea,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import {
  deleteAdminUser,
  promoteAdminUser,
  fetchAdminUser,
  updateAdminUser,
  fetchAdminGroups,
} from "../../../store/admin";
import { useNavigate, useParams } from "react-router-dom";
import UserConfirmModal from "./UserConfirmModal";
import { AFFILATION_OPTIONS } from "../../../store/affiliation";

const PROFILE = ["bio", "room"];

function UserSinglePanel() {
  const { storeUser, groups } = useSelector((state) => ({
    storeUser: state.admin.user,
    groups: state.admin.groups,
  }));
  const params = useParams();

  const [deleteModal, setDeleteModal] = useState(false);
  const [promoteModal, setPromoteModal] = useState(false);

  const [user, setUser] = useState(storeUser);
  const [modalShow, setModalShow] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAdminUser(params.userId));
    dispatch(fetchAdminGroups());
  }, []);

  useEffect(() => {
    setUser(storeUser);
  }, [storeUser]);

  if (user.id == undefined) {
    return <div>Loading...</div>;
  }

  const handleSave = () => {
    dispatch(updateAdminUser(user, params.userId));
  };

  const handleChange = (event) => {
    /**
     * front end protection against altering other data
     * (very lazy)
     */
    if (PROFILE.indexOf(event.target.name) !== -1) {
      setUser({
        ...user,
        profile: { ...user.profile, [event.target.name]: event.target.value },
      });
      return;
    }
    if (event.target.name.indexOf("group-check-") == 0) {
      setUser({ ...user, [event.target.name]: event.target.checked });
      return;
    }
    if (event.aff) {
      setUser({ ...user, [event.target.name]: JSON.parse(event.target.value) });
      return;
    }
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleDeleteUser = () => {
    dispatch(deleteAdminUser(params.userId));
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/adminpanel/users", { replace: true });
    }
  };

  const handlePromoteUser = () => {
    dispatch(promoteAdminUser(params.userId));
  };

  return (
    <>
      <UserConfirmModal
        message="Are you sure you want to delete this user?"
        show={deleteModal}
        setShow={setDeleteModal}
        confirmAction={handleDeleteUser}
      />
      <UserConfirmModal
        message="Are you sure you want to promote this user?"
        show={promoteModal}
        setShow={setPromoteModal}
        confirmAction={handlePromoteUser}
      />
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="12">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardText>
                  <strong>Profile Picture</strong>
                </MDBCardText>
                <MDBCardImage
                  src={user.profile.photo}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px" }}
                  fluid
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol lg="12">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="12">
                    <MDBCardText>
                      <strong>Public Information</strong> <br /> (other users
                      will be able to see the below information)
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>First Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      type="text"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Last Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      type="text"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Bio</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBTextArea
                      rows={4}
                      type="text"
                      name="bio"
                      value={user.profile.bio}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Room No.</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      type="text"
                      name="room"
                      value={user.profile.room}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="12">
                    <MDBCardText>
                      <strong>Private Information</strong> <br /> (other users
                      will not be able to see the below information)
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Personal Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText>
                      <MDBInput
                        type="text"
                        name="personalEmail"
                        value={user.personalEmail}
                        onChange={handleChange}
                      />
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Caltech Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText>
                      <MDBInput
                        type="text"
                        name="caltechEmail"
                        value={user.caltechEmail}
                        onChange={handleChange}
                      />
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Caltech UUID</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      type="text"
                      name="uuid"
                      value={user.uuid}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      type="text"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="12">
                    <MDBCardText>
                      <strong>DBUX</strong>
                      <br /> User dbux balance
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>DBUX Balance</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText>
                      <MDBInput
                        type="text"
                        name="tokens"
                        value={user.tokens}
                        onChange={handleChange}
                      />
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="12">
                    <MDBCardText>
                      <strong>House Membership</strong>
                      <br /> House membership controls what people can access
                      (ie more perms if darb verified). Values with an * are
                      user requested house memberships. Otherwise it was set by
                      an admin here.
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Memberships</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBRow>
                      <MDBCol sm="6">House Membership</MDBCol>
                      <MDBCol sm="3">Verification Status</MDBCol>
                    </MDBRow>
                    {Object.keys(AFFILATION_OPTIONS).map((key) => {
                      const userKey = `verification-key-${AFFILATION_OPTIONS[key].house}-${AFFILATION_OPTIONS[key].status}`;
                      return (
                        <MDBRow key={userKey}>
                          <MDBCol sm="6">{key}</MDBCol>
                          <MDBCol sm="3">
                            <MDBCheckbox
                              name={userKey}
                              label={
                                /* put an asterisk if they did request it */
                                `${key}${
                                  !user[userKey].userRequested ? "" : "*"
                                }`
                              }
                              key={userKey}
                              onChange={(event) => {
                                event.target.value = JSON.stringify({
                                  ...user[userKey],
                                  verified: event.target.checked,
                                });
                                event.aff = true;
                                handleChange(event);
                              }}
                              checked={user[userKey].verified}
                            />
                          </MDBCol>
                        </MDBRow>
                      );
                    })}
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="12">
                    <MDBCardText>
                      <strong>Dokuwiki user settings</strong>
                      <br />
                      Groups are a structure used by doku wiki to determine what
                      content a user can access. For example a user within the
                      group "full" can access content meant for full darbs.
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>User Groups</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {groups.map((group) => {
                      return (
                        <MDBRow key={group.id}>
                          <MDBCol sm="6">{group.description}</MDBCol>
                          <MDBCol sm="6">
                            <MDBCheckbox
                              name={`group-check-${group.id}`}
                              label={group.groupName}
                              key={group.id}
                              onChange={handleChange}
                              checked={!!user[`group-check-${group.id}`]}
                            />
                          </MDBCol>
                        </MDBRow>
                      );
                    })}
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="12">
                    <MDBCardText>
                      <strong>Advanced</strong>
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Admin Status</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {user.isAdmin ? "Admin" : "Not Admin"}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>
                      <Button
                        variant="danger"
                        disabled={user.isAdmin}
                        onClick={() => {
                          if (!user.isAdmin) {
                            setDeleteModal(true);
                          }
                        }}
                      >
                        Delete User
                      </Button>
                    </MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText>
                      This action will delete the user, and related records from
                      the database forever. It might not get data stored in
                      service databases though.
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>
                      <Button
                        variant="danger"
                        disabled={user.isAdmin}
                        onClick={() => {
                          if (!user.isAdmin) {
                            setPromoteModal(true);
                          }
                        }}
                      >
                        Promote To Admin
                      </Button>
                    </MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText>
                      This action will promote the user to an admin, giving them
                      access to the admin pages and routes. This privilege is
                      meant to be reserved for the excomm and the comptrollers.
                      TODO add demoting via this interface. If there are issues
                      here a direct connection can be made to the postgress sql
                      db on lenin (see comptroller github)
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol sm="9" />
          <MDBCol className="align-self-end" sm="3">
            <Button onClick={handleSave}>Save Changes</Button>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}

export default UserSinglePanel;
