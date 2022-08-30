const router = require("express").Router();
const { User } = require("../db/models");
const { isAdmin, isLoggedIn, upload } = require("./middleware");
module.exports = router;

const paginate = (page) => {
  const offset = (page - 1) * 20;
  const limit = 21;

  return {
    offset,
    limit,
  };
};

/**
 *  GET all users (api/users)
 */
router.get("/", isAdmin, async (req, res, next) => {
  try {
    let allUsers = await User.findAll({
      ...paginate(Number(req.query.pageNum)),
      order: [["firstName", "ASC"]],
    });
    res.json(allUsers).status(200);
  } catch (error) {
    next(error);
  }
});

/**
 *  GET single user (api/users/:id)
 */
router.get("/:userId", isLoggedIn, async (req, res, next) => {
  try {
    let user = await User.findByPk(req.params.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * GET user from telegram_id
 */
router.get("/telegram/:telegramId", async (req, res, next) => {
  try {
    const user = User.findOne({
      attributes: ["username"],
      where: { telegram_id: req.params.telegramId },
    });
    res.json(user).sendStatus(200);
  } catch (e) {
    next(e);
  }
});

/**
 *  PUT single user (api/users/:id)
 */

router.put("/:userId", isLoggedIn, async (req, res, next) => {
  try {
    let oldUser = await User.findById(req.params.userId);
    await oldUser.update({
      email: req.body.email,
      password: req.body.password,
      googleId: req.body.googleId,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT single user based on req
 */

router.put(
  "/",
  isLoggedIn,
  upload.single("profile"),
  async (req, res, next) => {
    try {
      let oldUser = await User.findByPk(req.user.id);
      const ALLOWED_USER_EDITS = [
        "firstName",
        "lastName",
        "uuid",
        "phone",
        "room",
        "bio",
        "profile.photo",
        "profile.room",
        "profile.bio",
      ];

      sizeLimits = {
        firstName: 69,
        lastName: 69,
        uuid: 69,
        phone: 69,
        room: 69,
        bio: 421,
        "profile.photo": -1,
        "profile.room": 69,
        "profile.bio": 421,
      };

      let filtered = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => {
          if (sizeLimits[key] !== -1) {
            if (sizeLimits[key] < req.body[key].length) {
              return false;
            }
          }
          return ALLOWED_USER_EDITS.indexOf(key) !== -1;
        })
      );

      if (filtered.profile) {
        filtered.profile = { ...oldUser.profile.toJSON(), ...filtered.profile };
      }

      await oldUser.update(filtered);
      res.status(201).send(req.body);
    } catch (error) {
      next(error);
    }
  }
);

/**
 *  DELETE single user (api/users/:id)
 */

router.delete("/:userId", isAdmin, async (req, res, next) => {
  try {
    await User.destroy({
      where: { id: req.body.userId },
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

/**
 *  PATCH promote single user (api/users/:id)
 */
router.patch("/:userId", isAdmin, async (req, res, next) => {
  try {
    await User.update(
      {
        isAdmin: true,
      },
      { where: { id: req.body.userId } }
    );
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});
