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
    const scopes = await Scope.findAll({});
    res.status(200).json(scopes);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scopes/
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
    const scope = await Scope.create({
      name: req.body.name,
      description: req.body.description,
    });
    res.status(201).json(scope);
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
 * PUT /api/scopes/
 *
 * edit a scope and return the edit
 *
 * req.body.id
 *    the id of the key to change
 * req.body.name
 *    new name of the scope
 * req.body.description
 *    new description of the scope
 */
router.put("/", isAdmin, async (req, res, next) => {
  try {
    const scope = await Scope.findByPk(req.body.id);
    scope.name = req.body.name;
    scope.description = req.body.description;
    await scope.save();

    res.status(200).json(scope);
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
 * DELETE /api/scopes/
 *
 * delete a key
 *
 * req.body.id
 *    the id of the scope to delete
 */
router.delete("/", isAdmin, async (req, res, next) => {
  try {
    const scope = await Scope.findByPk(req.body.id);
    // cascades
    await scope.destroy();
    res.send(204);
  } catch (error) {
    next(error);
  }
});
