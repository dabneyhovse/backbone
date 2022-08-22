import { Container } from "react-bootstrap";
import React from "react";

import About from "./About";
import DarbHero from "./DarbHero";
import DarbGallery from "./DarbGallery";
import Motto from "./Motto";

function Home() {
  return (
    <>
      <DarbHero />
      <Motto />

      <Container className="mainContent">
        <About />
      </Container>

      <DarbGallery />
    </>
  );
}

export default Home;
