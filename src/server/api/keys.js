const router = require("express").Router();
const { User, Scope, Key, KeyScope } = require("../db/models");
const { isAdmin } = require("module-middleware");
module.exports = router;

/**
 * GET /api/keys/
 *
 * get a json list of all keys and their scopes
 */
router.get("/", isAdmin, async (req, res, next) => {
  try {
    const keys = await Key.findAll({
      attributes: ["id", "name", "description"],
      include: Scope,
      order: [["id", "ASC"]],
    });
    res.status(200).json(keys);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/keys/
 *
 * returns the new key, with its unhashed value
 * this is the only time you'll see the unhashed value
 * so make sure to get it lol
 *
 * create a new key
 *
 * req.body.name
 *    name of the key
 * req.body.description
 *    description of the key
 * req.body.scopes
 *    array of scope ids
 * req.body.owner
 *    id of the user that requested the key,
 *    maybe do it by username so the interface is easy
 */

router.post("/", async (req, res, next) => {
  try {
    const key = await Key.create({
      name: req.body.name,
      description: req.body.description,
    });
    res.status(201).json(key);

    // add in the scopes
    scopeErrors = "";
    scopes = req.body.scopes;
    console.log(scopes);
    for (let i = 0; i < scopes.length; i++) {
      let scope = await Scope.findByPk(scopes[i]);
      if (scope == null) {
        scopeErrors += `Scope id ${scopes[i]} does not exist`;
      }
      await KeyScope.create({ keyId: key.id, scopeId: scopes[i] });
    }

    // if there were scope errors throw them
    if (scopeErrors !== "") {
      let error = new Error(scopeErrors);
      error.status = 500;
      throw error;
    }
  } catch (error) {
    // sequelize errors
    if (!!error.error) {
      next(new Error(error.errors[0].message));
      return;
    } else if (!!error.detail) {
      next(new Error(error.detail));
      return;
    }
    next(error);
  }
});

/**
 * PUT /api/keys/
 *
 * edit a key and return the edit
 *
 * req.body.id
 *    the id of the key to change
 * req.body.name
 *    new name of the key
 * req.body.description
 *    new description of the key
 * req.body.scopes
 *    array of scope ids
 */
router.put("/", isAdmin, async (req, res, next) => {
  try {
    key = await Key.update(
      {
        name: req.body.name,
        description: req.body.description,
      },
      { where: { id: req.body.id } }
    );

    // TODO edit scopes

    res.status(201).json(key);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/keys/
 *
 * delete a key
 *
 * req.body.keyId
 *    the id of the key to delete
 */
router.delete("/", isAdmin, async (req, res, next) => {
  try {
    const key = await Key.findByPk(req.body.keyId);
    await key.destroy();
    res.send(200);
  } catch (error) {
    next(error);
  }
});
