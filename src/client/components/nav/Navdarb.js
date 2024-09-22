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
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

import { FaUserCircle } from "react-icons/fa";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";

import { Tooltip, OverlayTrigger } from "react-bootstrap";

const NAVWRAP_DEFAULT = {};

const NAVWRAP_FIXED = {
  position: "absolute",
  width: "100%",
  zIndex: 69,
};

const NAVBAR_DEFAULT = {
  backgroundColor: "#0e3e1a",
};

const NAVBAR_TRANSPARENT = {
  backgroundColor: "rgba(14,62,26,0.5) !important",
};

const NAVBAR_HIDDEN = {
  display: "none",
};

/**
 * Recursive method that turns json representation of nav items into actual nested react
 * the redux store loads in items from services automatically
 * @param {obj} item the json item representing the nav item (see redux nav store for examples)
 * @param {boolean} dropdown if the call is creating dropdown components
 * @returns
 */

function navItemToReact(item, userClaims, dropdown = false) {
  let out = null;
  if (item.requiredClaims && !(item.requiredClaims.every((claim) => userClaims.includes(claim)))) {
    return "";
  }

  if (item.type == "href") {
    out = dropdown ? (
      <NavDropdown.Item
        pullRight={false}
        key={item.name}
        href={item.href ? item.href : item.route}
      >
        {item.name}
      </NavDropdown.Item>
    ) : (
      <Nav.Link key={item.name} href={item.route}>
        {item.name}
      </Nav.Link>
    );
  } else if (item.type == "react-router") {
    out = (
      <LinkContainer key={item.name} to={item.route}>
        {dropdown ? (
          <NavDropdown.Item pullRight={false}>{item.name}</NavDropdown.Item>
        ) : (
          <Nav.Link>{item.name}</Nav.Link>
        )}
      </LinkContainer>
    );
  } else if (item.type == "dropdown") {
    out = (
      <NavDropdown
        className="dropLeft"
        key={item.name}
        title={item.name}
        id="collasible-nav-dropdown"
        drop="start"
      >
        {item.links.map((link) =>
          navItemToReact(link, userClaims, (dropdown = true))
        )}
      </NavDropdown>
    );
  } else if (item.type == "main") {
    out = (
      <>
        {item.links.map((link) => {
          return navItemToReact(link, userClaims);
        })}
      </>
    );
  } else if (item.type == "line") {
    out = <NavDropdown.Divider key={item.key} />;
  }
  // TODO fix tooltips
  // if (item.tooltip) {
  //   out = (
  //     <OverlayTrigger
  //       placement="left"
  //       delay={{ show: 250, hide: 400 }}
  //       overlay={() => (
  //         <Tooltip id={`tooltip-${item.name}`}>{item.tooltip}</Tooltip>
  //       )}
  //     >
  //       {out}
  //     </OverlayTrigger>
  //   );
  // }
  return out;
}

/**
 *
 * @returns React.Component
 */
function Navdarb() {
  // hooks
  let location = useLocation();

  const { user, userClaims, navbar } = useSelector((state) => ({
    user: state.user,
    userClaims: state.user.backbone_roles ? state.user.backbone_roles : [],
    navbar: state.navbar,
  }));

  // determing the styling of the navbar
  let navbarStyle = NAVBAR_DEFAULT;
  let navwrapStyle = NAVWRAP_DEFAULT;
  if (navbar.transparentRoutes.indexOf(location.pathname) !== -1) {
    navbarStyle = NAVBAR_TRANSPARENT;
    navwrapStyle = NAVWRAP_FIXED;
  }
  if (navbar.hiddenRoutes.indexOf(location.pathname) !== -1) {
    navwrapStyle = NAVBAR_HIDDEN;
  }
  const ref = useRef(null);
  useEffect(() => {
    if (
      ref.current !== null &&
      navbar.transparentRoutes.indexOf(location.pathname) !== -1
    ) {
      ref.current.style.setProperty(
        "background-color",
        "rgba(14,62,26,0.5)",
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
              {navItemToReact(navbar.links, userClaims)}
              <NavDropdown
                drop="start"
                className="icon"
                title={<FaUserCircle size="1.5em" />}
                id="collasible-nav-dropdown"
              >
                {user.default == true ? (
                  <LinkContainer reloadDocument to="/login">
                    <NavDropdown.Item pullRight={false} href>
                      Login
                    </NavDropdown.Item>
                  </LinkContainer>
                ) : (
                  <React.Fragment>
                    <LinkContainer to={`${process.env.ISSUER_BASE_URL}/account`}>
                      <NavDropdown.Item pullRight={false} href>
                        Profile
                      </NavDropdown.Item>
                    </LinkContainer>
                    {userClaims.includes("backbone-admin") ? (
                      <LinkContainer to="/adminpanel">
                        <NavDropdown.Item pullRight={false} href>
                          Admin
                        </NavDropdown.Item>
                      </LinkContainer>
                    ) : (
                      ""
                    )}
                    <NavDropdown.Divider />
                    <LinkContainer reloadDocument to="/logout">
                      <NavDropdown.Item pullRight={false} href>
                        Logout
                      </NavDropdown.Item>
                    </LinkContainer>
                  </React.Fragment>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navdarb;
