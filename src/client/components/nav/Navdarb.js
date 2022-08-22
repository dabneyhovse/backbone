/**
 * Author:	Nick Jasinski
 * Date:		2022-08-19
 *
 * main navbar for the website
 * // TODO dynamiclly include new services and tabs
 * // TODO allow services to make a custom navbar somehow
 * // TODO login logout tabs
 */

import React from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { LinkContainer } from "react-router-bootstrap";

import { updateModalStatus } from "../../store/authModal";

const NAVWRAP_DEFAULT = {};

const NAVWRAP_FIXED = {
  position: "absolute",
  width: "100%",
  zIndex: 69,
};

const NAVBAR_DEFAULT = {
  backgroundColor: "#092916",
};

const NAVBAR_TRANSPARENT = {
  backgroundColor: "rgba(9,41,22,0.5) !important",
};

const NAVBAR_HIDDEN = {
  display: "none",
};

/**
 * Loads in the services which request to be included in the services dropdown
 * // TODO
 */
function loadDynamic() {}

const TRANS_FIXED_ROUTES = ["/", "/home"];

function Navdarb() {
  let location = useLocation();

  let dynServices = [];

  let navbarStyle = NAVBAR_DEFAULT;
  let navwrapStyle = NAVWRAP_DEFAULT;
  if (TRANS_FIXED_ROUTES.indexOf(location.pathname) !== -1) {
    navbarStyle = NAVBAR_TRANSPARENT;
    navwrapStyle = NAVWRAP_FIXED;
  }

  if (location.pathname == "/auth") {
    navwrapStyle = NAVBAR_HIDDEN;
  }

  const ref = useRef(null);
  console.log(ref);

  useEffect(() => {
    if (
      ref.current !== null &&
      TRANS_FIXED_ROUTES.indexOf(location.pathname) !== -1
    ) {
      ref.current.style.setProperty(
        "background-color",
        "rgba(9,41,22,0.5)",
        "important"
      );
    }
  });

  return (
    <div className="navwrap" style={navwrapStyle}>
      <Navbar
        ref={ref}
        className="navbar-custom"
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        style={navbarStyle}
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Dabney Hovse</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="transparent">
              <LinkContainer to="/gallery">
                <Nav.Link>Gallery</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/socialcalender">
                <Nav.Link>Social Calender</Nav.Link>
              </LinkContainer>
              <NavDropdown title="Contact" id="collasible-nav-dropdown">
                <NavDropdown.Item href="https://dabney.caltech.edu/wiki/doku.php?id=hovse_positions">
                  House Positions
                </NavDropdown.Item>
                <NavDropdown.Item href="https://dabney.caltech.edu/wiki/doku.php?id=student_resources">
                  Student Resources
                </NavDropdown.Item>
                <NavDropdown.Item href="https://directory.caltech.edu/EmergencyInfo">
                  Emergency
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Services" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/wiki">Wiki</NavDropdown.Item>
                {dynServices.map((service) => {
                  <NavDropdown.Item href={`/${service.href}`}>
                    service.name
                  </NavDropdown.Item>;
                })}
                {/* TODO remove farther and dinner and port them as actual services */}
                <NavDropdown.Item href="/farther">Farther</NavDropdown.Item>
                <NavDropdown.Item href="/dinner">Dinner</NavDropdown.Item>
                <NavDropdown.Divider />
                <LinkContainer to="/socialcalender">
                  <NavDropdown.Item>Social Calender</NavDropdown.Item>
                </LinkContainer>

                {/* TODO include the library catalog as a service */}
                <NavDropdown.Item href=" http://dabneylibrary.loganapple.com/">
                  Library Catalog
                </NavDropdown.Item>

                <NavDropdown.Divider />
                <LinkContainer to="/services/about">
                  <NavDropdown.Item>About Services</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <>
        <Offcanvas placement={"end"} show={this.show} onHide={this.handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Services</Offcanvas.Title>
            <> http://dabneylibrary.loganapple.com/ </>
          </Offcanvas.Header>
          <Offcanvas.Body></Offcanvas.Body>
        </Offcanvas>
      </> */}
    </div>
  );
}

const mapDispatch = (dispatch) => {
  return {
    showLogin: () => {
      dispatch(updateModalStatus(true));
    },
  };
};

export default connect(null, mapDispatch)(Navdarb);
