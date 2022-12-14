const router = require("express").Router();
const { Op, Sequelize } = require("sequelize");
const { User, Affiliation, Verification, Group } = require("../db/models");
const { isAdmin, isLoggedIn, upload } = require("./middleware");
const fs = require("fs");
const imageDataURI = require("image-data-uri");
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
  ["1"]: [
    [Sequelize.col("updatedAt"), "ASC"],
    ["id", "DESC"],
  ],
  ["2"]: [["id", "DESC"]],
  ["3"]: [["id", "ASC"]],
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
const UserGroup = require("../db/models/userGroup");
/**
 *  GET all users (api/users)
 */
router.get("/", isAdmin, async (req, res, next) => {
  try {


    const search = req.query.search ? JSON.parse(req.query.search) : {};
    console.log(verificationStatusMap[search.verification_status])

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
                [Op.iLike]: "%" + fl[i] + "%",
              },
            },
            {
              lastName: {
                [Op.iLike]: "%" + fl[i] + "%",
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
      attributes: [
        "username",
        "firstName",
        "lastName",
        "caltechEmail",
        "personalEmail",
        "id",
      ],
    };
    const util = require("util");

    console.log(
      util.inspect(query, { showHidden: false, depth: null, colors: true })
    );
    let allUsers;
    try {
      allUsers = await User.findAndCountAll(query);
    } catch (error) {
      console.error(error);
    }

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
      include: [
        { model: Affiliation },
        { model: Verification },
        { model: Group },
      ],
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
      const changeGroups = [];
      const changeMember = [];
      const cleaned = Object.keys(req.body).filter((key) => {
        if (key.indexOf("group-check-") == 0) {
          changeGroups.push([key.replace("group-check-", ""), req.body[key]]);
          return false;
        } else if (key.indexOf("verification-key-") == 0) {
          if (key.indexOf("verified") !== -1) {
            house_status_split = key
              .replace("verification-key-", "")
              .replace(".verified", "")
              .split("-");
            changeMember.push([
              key,
              ...house_status_split,
              req.body[key] == "true",
            ]);
          }
          return false;
        }
        // TODO filter the real params
        return true;
      });

      const cleanBody = {};
      cleaned.forEach((key) => {
        cleanBody[key] = req.body[key];
      });

      /**
       * edit dokuwiki groups
       */
      for (let i = 0; i < changeGroups.length; i++) {
        if (changeGroups[i][1] == "true") {
          await UserGroup.findOrCreate({
            where: {
              userId: req.params.userId,
              groupId: changeGroups[i][0],
            },
          });
        } else {
          const toRemove = await UserGroup.findOne({
            where: {
              userId: req.params.userId,
              groupId: changeGroups[i][0],
            },
          });
          if (toRemove) {
            await toRemove.destroy();
          }
        }
      }

      /**
       * update aany membership verifications
       */

      for (let i = 0; i < changeMember.length; i++) {
        const aff = await Affiliation.findOne({
          where: {
            userId: req.params.userId,
            house: changeMember[i][1],
            status: changeMember[i][2],
          },
        });
        if (changeMember[i][3] !== aff.verified) {
          await aff.update({ verified: changeMember[i][3] });
        }
      }

      /**
       * update all params actually stored in the user model
       */
      let oldUser = await User.findByPk(req.params.userId);
      await oldUser.update({
        ...cleanBody,
        ...(req.body.profile
          ? {
              profile: { ...oldUser.profile.toJSON(), ...req.body.profile },
            }
          : {}),
      });
      res.sendStatus(201);
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

      if (
        filtered["profile.photo"] &&
        !filtered["profile.photo"].indexOf("/resources/images/") == 0
      ) {
        const file = `/resources/images/pfp/${req.user.id}.png`;
        // write to the currently used public folder, and the resources folder for the next build
        const image = imageDataURI.decode(filtered["profile.photo"]);

        fs.writeFileSync("." + file, image.dataBuffer);
        fs.writeFileSync("./public" + file, image.dataBuffer);
        filtered["profile.photo"] = file;
      }

      if (filtered.profile) {
        filtered.profile = {
          ...oldUser.profile.toJSON(),
          ...filtered.profile,
        };
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
      where: { id: req.params.userId },
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
      { where: { id: req.params.userId } }
    );
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});
