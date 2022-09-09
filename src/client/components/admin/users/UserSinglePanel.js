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

  console.log(user.groups, user);
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
                    <MDBCardText className="text-muted">
                      <MDBInput
                        type="text"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleChange}
                      />
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Last Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      <MDBInput
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                      />
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Bio</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      <MDBTextArea
                        rows={4}
                        type="text"
                        name="bio"
                        value={user.profile.bio}
                        onChange={handleChange}
                      />
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Room No.</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      <MDBInput
                        type="text"
                        name="room"
                        value={user.profile.room}
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
                    <MDBCardText className="text-muted">
                      <MDBInput
                        type="text"
                        name="uuid"
                        value={user.uuid}
                        onChange={handleChange}
                      />
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      <MDBInput
                        type="text"
                        name="phone"
                        value={user.phone}
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
                      <strong>DBUX</strong>
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
                      <strong>Dokuwiki user settings</strong>
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>User Groups</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {groups.map((group) => {
                        return (
                          <MDBCheckbox
                            name={`group-check-${group.id}`}
                            label={group.groupName}
                            key={group.id}
                            onChange={handleChange}
                            checked={!!user[`group-check-${group.id}`]}
                          />
                        );
                      })}
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
