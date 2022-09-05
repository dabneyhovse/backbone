const router = require("express").Router();
const { Op } = require("sequelize");
const { User, Affiliation, Verification } = require("../db/models");
const { isAdmin, isLoggedIn, upload } = require("./middleware");
module.exports = router;

const USERS_PER_PAGE = 20;
const paginate = (page) => {
  const offset = (page - 1) * USERS_PER_PAGE;
  const limit = USERS_PER_PAGE;

  return {
    offset,
    limit,
  };
};

const sortMap = {
  ["1"]: [["updatedAt", "ASC"]],
  ["2"]: [["id", "ASC"]],
  ["3"]: [["id", "DESC"]],
};
const houseMembershipMap = {
  ["0"]: "any",
  ["1"]: "dabney",
  ["2"]: "blacker",
  ["3"]: "venerable",
  ["4"]: "avery",
  ["5"]: "fleming",
  ["6"]: "ricketts",
  ["7"]: "page",
  ["8"]: "lloyd",
};
const verificationStatusMap = {
  ["1"]: null,
  ["2"]: true,
  ["3"]: false,
};
// TODO remove
const util = require("util");
/**
 *  GET all users (api/users)
 */
router.get("/", isAdmin, async (req, res, next) => {
  try {
    const search = JSON.parse(req.query.search);
    console.log(search);

    let where = {};
    let include = [];
    if (search.name) {
      let fl = search.name.split(" ");

      let or = [];
      for (let i = 0; i < fl.length; i++) {
        or.push(
          ...[
            {
              firstName: {
                [Op.iLike]: "%" + fl[0] + "%",
              },
            },
            {
              lastName: {
                [Op.iLike]: "%" + fl[0] + "%",
              },
            },
          ]
        );
      }

      where = {
        ...where,
        [Op.or]: or,
      };
    }
    if (search.email) {
      where = {
        ...where,
        [Op.or]: [
          {
            personalEmail: {
              [Op.iLike]: "%" + search.email + "%",
            },
          },
          {
            caltechEmail: {
              [Op.iLike]: "%" + search.email + "%",
            },
          },
        ],
      };
    }
    if (search.username) {
      where = {
        ...where,
        username: {
          [Op.iLike]: "%" + username + "%",
        },
      };
    }
    if (search.house_membership && search.house_membership !== "0") {
      console.log("member", search.house_membership);
      include = [
        ...include,
        {
          model: Affiliation,
          required: true,
          where: { house: houseMembershipMap[search.house_membership] },
        },
      ];
    }
    if (search.verification_status && search.verification_status != "1") {
      include = [
        ...include,
        {
          model: Affiliation,
          required: true,
          where: {
            verified: verificationStatusMap[search.verification_status],
          },
        },
      ];
    }

    let query = {
      ...paginate(Number(req.query.pageNum || 1)),
      order: sortMap[search.sort],
      where,
      include,
    };

    console.log(
      util.inspect(query, { showHidden: false, depth: null, colors: true })
    );
    let allUsers = await User.findAndCountAll(query);

    allUsers.count = Math.ceil(allUsers.count / USERS_PER_PAGE);

    res.json(allUsers).status(200);
  } catch (error) {
    next(error);
  }
});

/**
 *  GET single user (api/users/:id)
 */
router.get("/admin/:userId", isAdmin, async (req, res, next) => {
  try {
    let user = await User.findByPk(req.params.userId, {
      include: [{ model: Affiliation }, { model: Verification }],
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * just a filtered version of the above
 */
router.get("/:userId", isLoggedIn, async (req, res, next) => {
  try {
    let user = await User.findByPk(req.params.userId, {
      attributes: ["username", "firstName", "lastName", "profile"],
      include: [
        { model: Affiliation, attributes: ["house", "status", "verified"] },
      ],
    });
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

router.put(
  "/:userId",
  isAdmin,
  upload.single("profile"),
  async (req, res, next) => {
    try {
      console.log(req.params.userId);
      let oldUser = await User.findByPk(req.params.userId);

      console.log(req.body);

      await oldUser.update({
        ...req.body,
        ...(req.body.profile
          ? {
              profile: { ...oldUser.profile.toJSON(), ...req.body.profile },
            }
          : {}),
      });
    } catch (error) {
      next(error);
    }
  }
);

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
