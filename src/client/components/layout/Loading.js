import React from "react";
import ReactLoading from "react-loading";

import { Container } from "react-bootstrap";

import "./Loading.css";

function Loading() {
  return (
    <div className="loading-container">
      <Container>
        <h1>Loading</h1>
        <ReactLoading
          type={"spinningBubbles"}
          color={"rgb(14, 78, 40)"}
          height={"100px"}
          width={"100px"}
        />
      </Container>
    </div>
  );
}

export default Loading;
