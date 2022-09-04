/**
 * Author:	Nick Jasinski
 * Date:		2022-08-12
 *
 * Secondary routes / tab level for admin to manage the site (only users for now)
 * // TODO dynamic import for admin pages of other services?
 */

import React from "react";
import UserPanel from "./UserPanel";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";

const SERVICES = [];

function AdminPanel() {
  return (
    <Container className="mainContent">
      <Tabs defaultActiveKey="users" className="mb-3">
        <Tab eventKey="users" title="Users">
          <UserPanel />
        </Tab>

        {SERVICES.map((service) => {
          return (
            <Tab eventKey="contact" title="Contact" disabled>
              <Suspense fallback={<div>Loading...</div>}>
                {React.lazy(() => import(`${service.name}/React`))}
              </Suspense>
            </Tab>
          );
        })}
      </Tabs>
    </Container>
  );
}

export default AdminPanel;
