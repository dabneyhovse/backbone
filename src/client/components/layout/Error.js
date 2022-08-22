/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * Standard error page for missing pages and errors loading
 */

import React from "react";
import { push } from "../../history";

const Error = (props) => {
  const { error, back_loc, back_txt } = props;
  error.name = "";
  return (
    <div className="container error">
      <div className="alert alert-danger mt-5">
        <h4>There was an error loading this page</h4>
        <p className="mb-0">{`${error}`}</p>
        <hr />
        <p>
          {!!back_txt ? (
            <>
              Click{" "}
              <a className="alert-link" onClick={push(back_loc)}>
                here
              </a>{" "}
              {back_txt}
            </>
          ) : (
            <>
              Go{" "}
              <a className="alert-link" onClick={push("/")}>
                back
              </a>{" "}
              to the homepage.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Error;
