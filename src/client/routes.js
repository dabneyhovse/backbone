/**
 * Author:	Nick Jasinski
 * Date:		2022-08-19
 *
 *  Main routes file which switches between the given rute paths
 * // TODO dynamic import service routes from the service folder
 * // TODO setup import of basic html? or make a quick template for
 * //      users to make simple react
 * // TODO special routes allowing any user to host a personal website
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import {
  AuthModal,
  Calender,
  DarbGallery,
  Home,
  VerfyPage,
} from "./components";

import SlideRoutes from "react-slide-routes";

class SiteRoutes extends Component {
  constructor() {
    super();
    this.dynamicPublicRoutes = <></>;
    this.dynamicLoggedinRoutes = <></>;
    this.dynamicLoggedoutRoutes = <></>;
    this.dynamicAdminRoutes = <></>;
    this.dynamicUserPages = <></>;
    this.dynamicRoutes.bind(this);
  }

  /**
   * imports the main components for all services from the directory specified
   * @param {string} directory path to the directory
   */
  dynamicRoutes(directory) {
    // TODO: dynamic import new routes from the services folder
  }

  render() {
    const { isLoggedIn, isAdmin } = this.props;
    return (
      <>
        {/* the below routes are always visible */}
        {/* <Route exact path="/" element={<Redirect to="/home" />} /> */}
        <SlideRoutes>
          <Route path="/" element={<Home />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/gallery" element={<DarbGallery />} />
          <Route exact path="/socialcalender" element={<Calender />} />
          <Route exact path="/auth" element={<AuthModal />} />
          <Route path="/verify" element={<VerfyPage />} />
        </SlideRoutes>
        {/* Routes below are only visible to people not logged in*/}
        {!isLoggedIn && <>{/* <AuthPage /> */}</>}
        {/* Routes placed below are only available after logging in */}
        {isLoggedIn && (
          <>
            {/* <Route exact path="/profile" component={ProfileWall} /> */}
            {this.dynamicPublicRoutes}
            {
              // Below routes are only accessible if user is admin
              isAdmin ? (
                <>
                  {/* <Route exact path="/users" component={} /> */}
                  {this.dynamicAdminRoutes}
                </>
              ) : (
                <></>
              )
            }
            {/* TODO <Footer /> */}
          </>
        )}
      </>
    );
  }
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
    isAdmin: state.user.isAdmin,
  };
};

// TODO deal with with router bullshit
export default connect(mapState)(SiteRoutes);
