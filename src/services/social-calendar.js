/**
 * Author:	Nick Jasinski
 * Date:		2022-08-23
 *
 * config file for the built in "service" "social-calendar"
 *
 * this doesnt really count as  service im just staying with this
 * config file to setup the format in the future...
 */

module.exports = {
  /**
   * The name of the service, this is what you will see on the navbar dropdown of the main dabney website
   */
  name: "Social Calendar",

  /**
   * A description of the service that will be given along with the name (above) on the services page
   */
  description:
    "The Dabney Hovse social calendar. Is updated by the current Soc Vps",

  /**
   * the route you want your service to occupy ie "example" gives the service dabney.caltech.edu/example/*
   * simply use your own react router to get vaired routes from the base ie
   * dabney.caltech.edu/example/about and dabney.caltech.edu/example/home
   * would be two different routes
   *
   * if your route overlaps with an existing one the serivce that has been up longer will recieve the route,
   * and the other will not be connected
   *
   * do not request a route if your service is external or built in (leave route as null)
   */
  route: "socialcalender",

  /**
   * If backbone should add the route about to the router
   * (usually true, but false for smth like the about services service)
   * as its built in and already has routes
   */
  createRoute: false,

  /**
   * the name of the module (string|null)
   *    string is module name so each part can import based on it
   *    ie import "moduleName/server"
   *
   *    null for built in
   */
  moduleName: null,

  /**
   * navlink type (href|react-router)
   *
   * href will be a normal link while react will use a link container
   */
  routeType: "react-router",

  /**
   * if the service should be displayed in the navbar
   */
  displayInNav: true,

  /**
   * Describes what section the dropdown item appears in
   *
   * options are ("b","m","t")
   *
   * "b" => bottom
   * "m" => middle
   * "t" => top
   */
  dropdownItemPosition: "m",

  /**
   * Tool tip to display when hovering over the link in the services dropdown
   * try to keep the text short
   */
  tooltip: "The current Dabney Social Calendar",

  /**
   *  OpenID Connect claims (as strings) that the user needs to view the service
   *  Administrators can create new roles and make roles from other clients visible
   *  to Backbone in the Keycloak admin console.
   */
  requiredClaims: [],

  /**
   * the below are all false since this is a built in service
   */
  importDb: false,
  importReact: false,
  importExpress: false,
};
