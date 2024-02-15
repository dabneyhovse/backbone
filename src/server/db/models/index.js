const db = require("../db");
const User = require("./user");
const Verification = require("./verification");
const Affiliation = require("./affiliation");
const Group = require("./group");
const UserGroup = require("./userGroup");
const Key = require("./key");
const Scope = require("./scope");

Key.belongsToMany(Scope, { through: "key-scopes" });
Scope.belongsToMany(Key, { through: "key-scopes" });

User.hasMany(Affiliation);
Affiliation.belongsTo(User);

User.hasMany(Verification);
Verification.belongsTo(User);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

module.exports = {
  User,
  Verification,
  Affiliation,
  Group,
  UserGroup,
};
