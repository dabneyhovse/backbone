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
} from "mdb-react-ui-kit";
import { fetchAdminUser, updateAdminUser } from "../../../store/admin";
import { useParams } from "react-router-dom";

const PROFILE = ["bio", "room"];

function UserSinglePanel() {
  const { storeUser } = useSelector((state) => ({
    storeUser: state.admin.user,
  }));
  const params = useParams();

  const [user, setUser] = useState(storeUser);
  const [modalShow, setModalShow] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminUser(params.userId));
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
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  return (
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
              <div className="d-flex justify-content-center mb-2">
                <Button
                  onClick={() => {
                    setModalShow(true);
                  }}
                >
                  Edit Picture
                </Button>
              </div>
            </MDBCardBody>
          </MDBCard>

          <MDBCard className="mb-4 mb-lg-0">
            <MDBCardBody className="p-0">
              <MDBRow className="d-flex justify-content-between align-items-center p-3 pt-0"></MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol lg="12">
          <MDBCard className="mb-4">
            <MDBCardBody>
              <MDBRow>
                <MDBCol sm="12">
                  <MDBCardText>
                    <strong>Public Information</strong> <br /> (other users will
                    be able to see the below information)
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
                    <strong>Advanced</strong>
                  </MDBCardText>
                </MDBCol>
              </MDBRow>
              <hr />
              <MDBRow>
                
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
  );
}

export default UserSinglePanel;
