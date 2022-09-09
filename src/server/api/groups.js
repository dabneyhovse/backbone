const router = require("express").Router();
const { User, Affiliation, UserGroup, Group } = require("../db/models");
const { isLoggedIn, isAdmin } = require("./middleware");
module.exports = router;

/**
 * get groups for the current user
 *
 * GET /api/groups/user
 */
router.get("/user", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Group }],
    });
    res.status(200).json(user.groups);
  } catch (error) {
    next(error);
  }
});

/**
 * get user groups based on id
 *
 * GET /api/groups/:userId
 */
router.get("/user/:userId", isAdmin, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{ model: Group }],
    });
    res.status(200).json(user.groups);
  } catch (error) {
    next(error);
  }
});

/**
 * edit groups for a user
 *
 * takes a list of group ids to add and iteratively adds all of them
 *
 * req.body.groupIds
 *  the list of group ids
 *
 * POST /api/groups/user
 */
router.post("/user", isAdmin, async (req, res, next) => {
  try {
    for (let i = 0; i < req.body.groupIds.length; i++) {
      await UserGroup.findOrCreate({
        where: { userId: req.body.userId, groupId: req.body.groupIds[i] },
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * get a json list of all groups
 *
 * GET /api/groups/
 */
router.get("/", isAdmin, async (req, res, next) => {
  try {
    const group = await Group.findAll();
    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
});

/**
 * edit a group and return the edit
 *
 * req.body.groupId
 *    the id off the group to change
 * req.body.name
 *    new name of the group
 * req.body.description
 *    new description of the group
 *
 * PUT /api/groups/
 */
router.put("/", isAdmin, async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.body.groupId);
    await group.update({
      name: req.body.name,
      description: req.body.description,
    });
    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
});

/**
 * create a new group
 *
 * req.body.name
 *    name of the group
 * req.body.description
 *    description of the group
 *
 * POST /api/groups/
 */
router.post("/", isAdmin, async (req, res, next) => {
  try {
    const group = await Group.create({
      where: {
        name: req.body.name,
        description: req.body.description,
      },
    });
    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
});

/**
 * delete a group
 *
 * req.body.groupId
 *    the id of the group to delete
 *
 * DELETE /api/groups/
 */
router.delete("/", isAdmin, async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.body.groupId);
    await group.destroy();
    res.send(200);
  } catch (error) {
    next(error);
  }
});
