const router = require("express").Router();
const { User, Scope, Key } = require("../db/models");
const { isAdmin } = require("./middleware");
module.exports = router;

/**
 * GET /api/keys/
 *
 * get a json list of all keys and their scopes
 */
router.get("/", isAdmin, async (req, res, next) => {
  try {
    const keys = await Key.findAll({
      attributes: ["name", "description"],
      include: Scope,
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
 * 
 */

router.post("/", isAdmin, async (req, res, next) => {
  try {
    const key = await Key.create({
      where: {
        name: req.body.name,
        description: req.body.description,
      },
      attributes: ["name", "description"],
    });

    // TODO add scopes

    res.status(201).json(key);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/keys/
 *
 * edit a key and return the edit
 *
 * req.body.keyId
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
    const key = await Group.findByPk(req.body.keyId);
    await key.update({
      name: req.body.name,
      description: req.body.description,
    });

    // TODO edit scopes

    res.status(200).json(group);
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
