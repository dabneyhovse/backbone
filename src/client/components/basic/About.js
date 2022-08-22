// https://en.wikipedia.org/wiki/House_system_at_the_California_Institute_of_Technology#Dabney_House

import React from "react";
import { Container } from "react-bootstrap";

// import { Carousel } from "react-bootstrap";

function About() {
  return (
    <>
      <h1>About Us</h1>
      <div className="about">
        <div className="about-blurb flex-xs-column flex-sm-row">
          <img src="./resources/images/carousel/t_pose.jpg" />
          <p>
            Welcome to Dabney! Here, you can usually find people doing sets in
            the gazebo or library and hanging out in the lounge, talking or
            screening movies. We have a massive collection of board games to
            play, and a large pile of squashy objects in the lounge, called the
            bear pit. We just finished a new mural in the house, many darbs (as
            Dabney members are known) are artistically or musically inclined.
          </p>
        </div>
        <div className="about-blurb flex-xs-column flex-sm-row">
          <img src="./resources/images/about/zombie_night_2.jpg" />
          <p>
            Surviving Caltech isn't always easy. Sometimes you just need to take
            some time out of your your day to have a good laugh. Here at Dabney,
            our family of eccentric Darbs have cultivated a space that makes all
            of us feel at home. You have any crazy ideas, like driving up a
            mountain to bring back snow to Dabney's courtyard? Or racing your
            friends across campus in wheeled trash can-based "hot tubs"? Or
            barricading the house against invading zombies (members of
            Venerable)? If you get enough support, we'll probably turn it into
            one of our weekly social events!
          </p>
        </div>

        <div className="about-blurb flex-xs-column flex-sm-row">
          <img src="./resources/images/about/mar_pumpkin.jpg" />
          <p>
            We hold some other large events, including the Pumpkin Drop, where
            we drop LN2 frozen pumpkins from the roof of the Caltech Hall to the
            sound of the 1812 Overture, our yearly Interhouse (a themed party),
            and a visit to Joshua Tree to watch the stars! In addition to these
            large events we also plan smaller weekly social events at the start
            of each new term.
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
