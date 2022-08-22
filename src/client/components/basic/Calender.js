import React from "react";
import Container from "react-bootstrap/Container";

function Calender() {
  return (
    <Container className="mainContent">
      <h1>Dabney Hovse Social Calender</h1>
      <iframe
        title="calender"
        src="https://calendar.google.com/calendar/embed?src=dabneysocveeps%40gmail.com&ctz=America%2FLos_Angeles"
        style={{ border: 0 }}
        width="100%"
        height="600"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </Container>
  );
}

export default Calender;
