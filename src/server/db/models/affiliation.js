/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * Affliation db model for all possible memberhsipsd
 */
const Sequelize = require("sequelize");
const db = require("../db");

const Affiliation = db.define("affiliation", {
  house: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.ENUM(["social", "full"]),
  },
  verified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

const membershipToNickname = (memberships) => {
  const base = {
    dabney: "Darb",
    blacker: "Mole",
    fleming: "Flem",
    ricketts: "Scurve",
    page: "Pageboy",
    venerable: "Ven",
    lloyd: "Lloydie",
    avery: "Averite",
  };

  // const extra = {
  //   "0,1": "marble",
  //   "1,2": "",
  //   "1,3": "scull",
  //   "1,4": "",
  //   "1,5": "",
  //   "1,6": "",
  //   "1,7": "",
  //   "0,1,3 ": "Admin Dissapointment",
  //   "0,1,2,3,4,5,6,7 ": "Cow",
  // };
  names = [];
  [...memberships].forEach((membership) => {
    names.push(base[membership.house]);
  });
};

module.exports = Affiliation;
