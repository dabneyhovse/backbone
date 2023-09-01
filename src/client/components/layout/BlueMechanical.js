/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * Standard error page for missing pages and errors loading
 */

import React, { useEffect, useState } from "react";
import { push } from "../../history";
import { toast } from "react-toastify";
import lines from "./beemovie";

import "./BlueMechanical.css";

function handleHover(setX, setY) {
  return () => {
    setX(Math.floor(Math.random() * 100) - 50 + "vw");
    setY(Math.floor(Math.random() * 100) - 50 + "vh");
  };
}

function BlueMechanical() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    let index = 0;

    const interv = setInterval(() => {
      if (index >= lines.length) {
        toast.warning("Why are you still here? Do your work.");
      } else {
        toast.info(lines[index]);
        toast.info(lines[index], { position: "top-left" });
      }
      index++;
    }, 1000);
    return () => {
      clearInterval(interv);
    };
  }, []);

  return (
    <div className="blue-mechanical">
      <div
        onMouseEnter={handleHover(setX, setY)}
        style={{
          left: x,
          top: y,
        }}
        className="alert alert-primary mt-5"
      >
        <h4>We couldn't find the page you're looking for.</h4>
        <p className="mb-0">So we've prepared a movie for you.</p>
        <hr />
        <p>
          Go{" "}
          <a
            onClick={push("/")}
            className="alert-link"
            onMouseEnter={handleHover(setX, setY)}
          >
            back
          </a>{" "}
          to the homepage.
        </p>
      </div>
    </div>
  );
}

export default BlueMechanical;
