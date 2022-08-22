/**
 * Author:	Nick Jasinski
 * Date:		2022-08-20
 *
 * Basic React component made to load in the newest motto
 */

import "./Motto.css";
import React from "react";

function Motto() {
  return (
    <div className="motto-bar">
      <h2> Welcome to Dabney Hovse!</h2>
      <div>
        Our current motto is: {" "}
        <span className={"redacted motto"}>oiwenfeoianfo ienfioenne</span>
      </div>
    </div>
  );
}

export default Motto;
