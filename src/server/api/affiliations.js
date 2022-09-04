const router = require("express").Router();
const { User, Affiliation } = require("../db/models");
const { isLoggedIn, isAdmin } = require("./middleware");
module.exports = router;

/**
 * get affiliations for the current user
 */
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const out = await Affiliation.findAll({
      where: {
        userId: req.user.id,
      },
      attributes: ["house", "status", "verified"],
    });
    res.status(200).json(out);
  } catch (error) {
    next(error);
  }
});

/**
 * get user affiliations based on id
 */
router.get("/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const out = await Affiliation.findAll({
      where: {
        userId: req.params.userId,
      },
    });
    res.status(200).json(out);
  } catch (error) {
    next(error);
  }
});

/**
 * edit affiliations for the current user
 */
router.put("/", isLoggedIn, async (req, res, next) => {
  try {
    let toEdit = req.body.affiliations;
    const out = [];
    const ids = [];

    const allAff = await Affiliation.findAll({
      where: {
        userId: req.user.id,
      },
    });
    for (let i = 0; i < toEdit.length; i++) {
      let aff = await Affiliation.findOrCreate({
        where: {
          userId: req.user.id,
          house: toEdit[i].house,
          status: toEdit[i].status,
        },
      });

      aff = aff[0];
      out.push(aff);
      ids.push(aff.id);
    }
    for (let i = 0; i < allAff.length; i++) {
      const aff = allAff[i];
      if (ids.indexOf(aff.id) == -1) {
        await aff.destroy();
      }
    }
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

/**
 * edit affiliations of a given user, admin only
 */
router.put("/:userId", isAdmin, async (req, res, next) => {
  try {
    let toEdit = req.body.affiliations;
    const out = [];
    const ids = [];

    const allAff = await Affiliation.findAll({
      where: {
        userId: req.params.userId,
      },
    });
    for (let i = 0; i < toEdit.length; i++) {
      let aff = await Affiliation.findOrCreate({
        where: {
          userId: req.params.userId,
          house: toEdit[i].house,
          status: toEdit[i].status,
        },
      });

      aff = aff[0];
      out.push(aff);
      ids.push(aff.id);
    }
    for (let i = 0; i < allAff.length; i++) {
      const aff = allAff[i];
      if (ids.indexOf(aff.id) == -1) {
        await aff.destroy();
      }
    }
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});
