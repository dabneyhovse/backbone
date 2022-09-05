import React from "react";
import Gallery from "react-grid-gallery";
import images from "./gallery.json";
import { Container } from "react-bootstrap";

function DarbGallery() {
  return (
    <Container className="mainContent small-gallery">
      <h1>Gallery</h1>
      <p>
        "Surviving Caltech isn't always easy. Sometimes you just need to take
        some time out of your your day to have a good laugh."
      </p>
      <Gallery images={images} />
    </Container>
  );
}

export default DarbGallery;
