// const router = require("express").Router();
// const { Op } = require("sequelize");
// const { Scope, Key, KeyScope } = require("../db/models");
// const { isAdmin } = require("module-middleware");
// module.exports = router;

// /**
//  * GET /api/keys/
//  *
//  * get a json list of all keys and their scopes
//  */
// router.get("/", isAdmin, async (req, res, next) => {
//   try {
//     const keys = await Key.findAll({
//       attributes: ["id", "name", "description"],
//       include: Scope,
//       order: [["id", "ASC"]],
//     });
//     res.status(200).json(keys);
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  * POST /api/keys/
//  *
//  * returns the new key, with its unhashed value
//  * this is the only time you'll see the unhashed value
//  * so make sure to get it lol
//  *
//  * create a new key
//  *
//  * req.body.name
//  *    name of the key
//  * req.body.description
//  *    description of the key
//  * req.body.scopes
//  *    array of scope ids
//  * req.body.owner
//  *    id of the user that requested the key,
//  *    maybe do it by username so the interface is easy
//  */

// router.post("/", async (req, res, next) => {
//   try {
//     const key = await Key.create({
//       name: req.body.name,
//       description: req.body.description,
//     });

//     // add in the scopes, empty array if none
//     scopeErrors = "";
//     scopes = req.body.scopes || [];

//     for (let i = 0; i < scopes.length; i++) {
//       let scope = await Scope.findByPk(scopes[i]);
//       if (scope == null) {
//         scopeErrors += `Scope id ${scopes[i]} does not exist`;
//       }
//       await KeyScope.create({ keyId: key.id, scopeId: scopes[i] });
//     }

//     // if there were scope errors throw them
//     if (scopeErrors !== "") {
//       let error = new Error(scopeErrors);
//       error.status = 500;
//       throw error;
//     }

//     // return the version with scopes so they r viewable
//     const keyWScopes = await Key.findByPk(key.id, { include: Scope });
//     res.status(201).json(keyWScopes);

//     // remove the raw unhashed value, only available once
//     key.unhashed = null;
//     await key.save();
//   } catch (error) {
//     // sequelize errors
//     if (!!error.error) {
//       next(new Error(error.errors[0].message));
//       return;
//     } else if (!!error.detail) {
//       next(new Error(error.detail));
//       return;
//     }
//     next(error);
//   }
// });

// /**
//  * PUT /api/keys/
//  *
//  * edit a key and return the edit
//  *
//  * req.body.id
//  *    the id of the key to change
//  * req.body.name
//  *    new name of the key
//  * req.body.description
//  *    new description of the key
//  * req.body.scopes
//  *    array of scope ids
//  */
// router.put("/", isAdmin, async (req, res, next) => {
//   try {
//     key = await Key.findOne({ where: { id: req.body.id }, include: Scope });

//     if (req.body.regenerate === true) {
//       // regenerate key, hashed when val is updated,
//       Key.generateKey(key);
//     } else {
//       // enforce not null reqs, or just let seq error propagate?
//       // dont care enough lol
//       key.name = req.body.name;
//       key.description = req.body.description;
//     }
//     await key.save();

//     // update the scopes
//     scopes = req.body.scopes;
//     if (req.body.scopes == undefined) {
//       res.json(key);
//       return;
//     }

//     scopeErrors = "";
//     oldScopes = key.scopes.map((s) => s.id);
//     // find difference oldScopes - scopes, so the ones to remove
//     const toRemove = oldScopes.filter((x) => !scopes.includes(x));
//     // find difference scopes - oldscopes, so ones to add
//     const toAdd = scopes.filter((x) => !oldScopes.includes(x));

//     // add in new scopes
//     for (let i = 0; i < toAdd.length; i++) {
//       let scope = await Scope.findByPk(toAdd[i]);
//       if (scope == null) {
//         scopeErrors += `Scope id ${toAdd[i]} does not exist`;
//       }
//       await KeyScope.create({ keyId: key.id, scopeId: toAdd[i] });
//     }

//     // remove all the ones in toRemove
//     await KeyScope.destroy({
//       where: {
//         scopeId: { [Op.in]: toRemove },
//         keyId: key.id,
//       },
//     });

//     // if there were scope errors throw them
//     if (scopeErrors !== "") {
//       let error = new Error(scopeErrors);
//       error.status = 500;
//       throw error;
//     }

//     const keyWScopes = await Key.findByPk(key.id, { include: Scope });
//     res.status(201).json(keyWScopes);

//     if (req.body.regenerate === true) {
//       // remove the raw unhashed value, only available once
//       key.unhashed = null;
//       await key.save();
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  * DELETE /api/keys/
//  *
//  * delete a key
//  *
//  * req.body.id
//  *    the id of the key to delete
//  */
// router.delete("/", isAdmin, async (req, res, next) => {
//   try {
//     const key = await Key.findByPk(req.body.id);
//     await key.destroy();
//     res.sendStatus(204);
//   } catch (error) {
//     next(error);
//   }
// });
