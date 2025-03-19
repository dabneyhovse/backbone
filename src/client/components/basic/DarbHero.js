/**
 * Author:	Nick Jasinski
 * Date:		2022-08-20
 *
 * Implementation of a simple "Hero" wep component
 * this makes a full width image appear at the start of the
 * home component.
 *
 * Simple stylistically
 *
 * using sample code from
 * https://codepen.io/eversionsystems/pen/YOmqdj
 * as a seed
 *
 * // TODO connect to redux and load in the hero images from the server
 */

import React from "react";
import { connect } from "react-redux";
import Carousel from "react-bootstrap/Carousel";

import "./DarbHero.css";

class DarbHero extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: "0px",
      heros: [
        {
          id: -1,
          img: "./resources/images/home_page/minions.jpg",
          title: "It's Hard to Tell Where The Irony Ends",
          paragraph:
            "A group of darbs went see the new minions movie in yellow ponchos as an extremely low budget minion costume.",
        },
        {
          id: 0,
          img: "./resources/images/home_page/darb_talks_justin.jpg",
          title: "During Darb Talks Darbs Present on Whatever They Desire",
          paragraph: 'Usually they\'re quite "enlightening"...',
        },
        {
          id: 1,
          img: "./resources/images/home_page/pumpkin_drop_1.jpg",
          title: "Halloween Pumpkin Drop",
          paragraph:
            "Every year on Halloween night Dabney drops frozen pumpkins off of the tallest building on campus. ",
        },
        {
          id: 2,
          img: "./resources/images/home_page/red_dress.jpg",
          title: "Sometimes Events Just Create Themselves",
          paragraph:
            "Our social events are scheduled at the start of each term (see the social calender), but sometimes random events emerge from the chaos that is Dabney Hovse...",
        },
        {
          id: 3,
          img: "./resources/images/home_page/sheared_sheep.jpeg",
          title: "During Powerpoint Karaoke Darbs Present Rants Made By Other Darbs",
          paragraph: 'They usually consist of very good content.',
        },
      ],
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  /**
   * force load images so there isnt a delay showing the next
   */
  componentWillUnmount() {
    this.state.heros.forEach((hero) => {
      const img = new Image();
      img.src = hero.img;
    });
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      height: window.innerHeight + "px",
    });
  }

  render() {
    return (
      <Carousel>
        {this.state.heros.map((hero) => {
          return (
            <Carousel.Item key={hero.id}>
              <div
                className="carousel-content"
                style={{
                  backgroundImage: `url(${hero.img})`,
                  height: this.state.height,
                }}
              />
              <Carousel.Caption>
                <h3>{hero.title}</h3>
                <p>{hero.paragraph}</p>
              </Carousel.Caption>
            </Carousel.Item>
          );
        })}
      </Carousel>
    );
  }
}

export default connect(null, null)(DarbHero);
