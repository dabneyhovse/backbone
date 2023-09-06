import React, { useEffect } from "react";
import store from "../../store";

function ManagerContainer({ reducer, serviceKey }) {
  useEffect(() => {
    // load in the reducer when component loads
    console.log("adding", serviceKey);
    store.reducerManager.add(serviceKey, reducer);
    return () => {
      console.log("removing", serviceKey);
      // unload the reducer
      store.reducerManager.remove(serviceKey);
    };
  }, []);

  // nothing to render, this is just for logic
  return <></>;

  // debug
  // return <div>{serviceKey} manager</div>;
}

export default ManagerContainer;
