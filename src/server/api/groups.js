const router = require("express").Router();
const { User, Affiliation } = require("../db/models");
const Group = require("../db/models/group");
const UserGroup = require("../db/models/userGroup");
const { isLoggedIn, isAdmin } = require("./middleware");
module.exports = router;

/**
 * get groups for the current user
 *
 * GET /api/groups
 */
router.get("/", isLoggedIn, async (req, res, next) => {
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
router.get("/:userId", isLoggedIn, async (req, res, next) => {
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
 * POST /api/groups/:userId
 */
router.post("/:userId", isAdmin, async (req, res, next) => {
  try {
    req.params.userId;
    for (let i = 0; i < req.body.groupIds.length; i++) {
      await UserGroup.findOrCreate({
        where: { userId: req.params.userId, groupId: req.body.groupIds[i] },
      });
    }
  } catch (error) {
    next(error);
  }
});
