import React from "react";
import { Redirect } from "react-router";
import { Route, Routes } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import KeyPanel from "./KeyPanel";
import ScopePanel from "./ScopePanel";

export default function APIRoutes() {
  return (
    <React.Fragment>
      <Nav variant="tabs">
        <Nav.Item key="api-keys">
          <LinkContainer to="/adminpanel/api">
            <Nav.Link eventKey="api-keys">API Keys</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item key="api-scopes">
          <LinkContainer to="/adminpanel/api/scopes">
            <Nav.Link eventKey="api-scopes">Scopes</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item key="api-history">
          <LinkContainer to="/adminpanel/api/history">
            <Nav.Link eventKey="api-history">History</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </Nav>
      <Routes>
        <Route exact path="/scopes" element={<ScopePanel />} />
        <Route
          exact
          path="/history"
          element={<div>TODO make component to list api history?</div>}
        />
        <Route exact path="/" element={<KeyPanel />} />
      </Routes>
    </React.Fragment>
  );
}
