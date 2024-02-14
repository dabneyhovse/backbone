/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * page to see a users profile
 *
 * # TODO change fields like name email
 * # TODO link telegram account
 */
import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { AiOutlineQuestionCircle } from "react-icons/ai";

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
  MDBInputGroup,
} from "mdb-react-ui-kit";
import DarbAvatarEditor from "./DarbAvatarEditor";
import Affiliation from "./Affiliation";
import { linkTelegram, updateUser } from "../../store/user";

const EDITABLE = ["firstName", "lastName", "uuid", "phone", "room", "bio"];
const PROFILE = ["bio", "room"];

const renderTooltip = (text) => (props) =>
  (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

function ProfileWall() {
  const { storeUser } = useSelector((state) => ({
    storeUser: state.user.data,
  }));

  const [user, setUser] = useState(storeUser);
  const [vcode, setVcode] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const dispatch = useDispatch();

  /**
   * force update?
   */

  useEffect(() => {
    setUser(storeUser);
  }, [storeUser]);

  const handleSave = () => {
    dispatch(updateUser(user));
  };

  const handleVCodeChange = (event) => {
    setVcode(event.target.value);
  };

  const handleVerify = (event) => {
    // TODO validate, code has to be 6 long
    // TODO refetch user
    dispatch(linkTelegram(vcode));
  };

  const handleChange = (event) => {
    /**
     * front end protection against altering other data
     * (very lazy)
     */
    if (EDITABLE.indexOf(event.target.name) !== -1) {
      if (PROFILE.indexOf(event.target.name) !== -1) {
        if (event.target.name == "bio" && event.target.value.length >= 420) {
          return;
          /**
           * yeah ik this is messy but im tired rn
           */
        } else if (
          event.target.name !== "bio" &&
          event.target.value.length > 69
        ) {
          return;
        }
        setUser({
          ...user,
          profile: { ...user.profile, [event.target.name]: event.target.value },
        });
      } else if (event.target.value.length < 69) {
        setUser({ ...user, [event.target.name]: event.target.value });
      }
    }
  };

  return (
    <React.Fragment>
      <DarbAvatarEditor show={modalShow} hide={() => setModalShow(false)} />
      <Container className="mainContent" style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="4">
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

              <MDBCard className="mb-4">
                <MDBCardBody className="p-0">
                  <MDBRow className="d-flex justify-content-between align-items-center p-3 pt-0">
                    <Affiliation />
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>

              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBRow className="d-flex justify-content-between align-items-left">
                    <MDBCol sm="2">
                      <MDBIcon
                        fab
                        icon="telegram"
                        style={{ color: "#3b5998", height: "100%" }}
                        size="2x"
                      />
                    </MDBCol>

                    <MDBCol sm="10">
                      <MDBCardText>
                        <strong>Telegram Integration</strong> <br /> (for
                        integration with telegram bots)
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow className="d-flex justify-content-between align-items-center p-3 pt-0">
                    <MDBCardText>
                      {user.telegram_id == undefined ||
                      user.telegram_id == "" ? (
                        <MDBRow>
                          <MDBCol sm="12">
                            <MDBCardText>
                              Request a verification code{" "}
                              <a href="https://t.me/DabneyHouseBot">here</a>
                            </MDBCardText>
                          </MDBCol>
                          <MDBCol sm="12">
                            <MDBInputGroup className="mb-3">
                              <input
                                className="form-control"
                                type="text"
                                name="vcode"
                                placeholder="Verification Code"
                                value={vcode}
                                onChange={handleVCodeChange}
                              />
                              <Button
                                className="btn btn-primary"
                                onClick={handleVerify}
                              >
                                Verify
                              </Button>
                            </MDBInputGroup>
                          </MDBCol>
                        </MDBRow>
                      ) : (
                        "Account already linked!"
                      )}
                    </MDBCardText>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>

              <MDBCard className="mb-4 mb-lg-0">
                <MDBCardBody className="p-0">
                  <MDBRow className="d-flex justify-content-between align-items-center p-3 pb-0">
                    <MDBCardText style={{ fontSize: "1.5em" }}>
                      DBUX: <span className="dbux">{user.tokens}</span>
                    </MDBCardText>
                  </MDBRow>
                  <hr />
                  <MDBRow className="d-flex justify-content-between align-items-center p-3 pt-0">
                    <MDBCardText>
                      To earn more DBUX, participate in events or games on the
                      website. DBUX can also be purchased at a ratio of $1 :
                      <span className="dbux"> 100</span>. Contact the
                      comptrollers if you really wish to make such a
                      transaction. Money will be added to the "comptroller
                      fund", ie our venmos
                    </MDBCardText>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol lg="8">
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
                      <MDBCardText className="text-muted">
                        {user.personalEmail}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Caltech Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {user.caltechEmail}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>
                        Caltech UUID
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip(
                            "Your Caltech UUID is only used for the dabney library physical checkout system. (cardswipe like in amogus)"
                          )}
                        >
                          <span className="tooltip-profile">
                            <AiOutlineQuestionCircle />
                          </span>
                        </OverlayTrigger>
                      </MDBCardText>
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
                      <MDBCardText>
                        Phone
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip(
                            "Your Phone number will only be used in emergency situations."
                          )}
                        >
                          <span className="tooltip-profile">
                            <AiOutlineQuestionCircle />
                          </span>
                        </OverlayTrigger>
                      </MDBCardText>
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
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol sm="9" />
            <MDBCol className="align-self-end" sm="3">
              <Button onClick={handleSave}>Save Changes</Button>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </Container>
    </React.Fragment>
  );
}

export default ProfileWall;
