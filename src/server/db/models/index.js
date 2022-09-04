const db = require("../db");
const User = require("./user");
const Verification = require("./verification");
const Affiliation = require("./affiliation");

User.hasMany(Affiliation);
Affiliation.belongsTo(User);

module.exports = {
  User,
  Verification,
  Affiliation,
};
