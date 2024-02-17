const router = require("express").Router();
const { User, Scope, Key, KeyScope } = require("../db/models");
const { isAdmin } = require("module-middleware");
module.exports = router;

/**
 * GET /api/scopes/
 *
 * get a json list of all scopes
 */
router.get("/", isAdmin, async (req, res, next) => {
  try {
    const keys = await Scope.findAll({
      include: Scope,
    });
    res.status(200).json(keys);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scope/
 *
 * create a new scope
 *
 * returns the new scope as json
 *
 * req.body.name
 *    name of the scope
 * req.body.description
 *    description of the scope
 */

router.post("/", async (req, res, next) => {
  try {
    const key = await Scope.create({
      name: req.body.name,
      description: req.body.description,
    });
    res.status(201).json(key);
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
 * PUT /api/scope/
 *
 * edit a scope and return the edit
 *
 * req.body.scopeId
 *    the id of the key to change
 * req.body.name
 *    new name of the scope
 * req.body.description
 *    new description of the scope
 */
router.put("/", isAdmin, async (req, res, next) => {
  try {
    const scope = await Scope.findByPk(req.body.scopeId);
    await scope.update({
      name: req.body.name,
      description: req.body.description,
    });

    res.status(200).json(group);
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
  }
});

/**
 * DELETE /api/scopes/
 *
 * delete a key
 *
 * req.body.scopeId
 *    the id of the scope to delete
 */
router.delete("/", isAdmin, async (req, res, next) => {
  try {
    const key = await Key.findByPk(req.body.scopeId);
    // cascades
    await key.destroy();
    res.send(204);
  } catch (error) {
    next(error);
  }
});
