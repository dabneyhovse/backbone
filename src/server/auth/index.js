const router = require("express").Router();
const { Verification, Affiliation } = require("../db/models");
const User = require("../db/models/user");
module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).send("Wrong username and/or password");
    } else if (!user.correctPassword(req.body.password)) {
      res.status(401).send("Wrong username and/or password");
    } else {
      const authLevel = await calculateAuthLevel(user);
      req.login(user, (err) =>
        err ? next(err) : res.json({ ...user.toJSON(), authLevel })
      );
    }
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, personalEmail, caltechEmail, password } = req.body;

    let user = await User.findOne({
      where: {
        caltechEmail,
      },
    });

    if (user) {
      res
        .status(403)
        .send("An account already exists with this Caltech Email.");
      return;
    }

    user = await User.findOne({
      where: {
        username,
      },
    });

    if (user) {
      res.status(403).send(`The username "${username}" is already taken.`);
      return;
    }
    console.log("personal", personalEmail);
    console.log("caltech", caltechEmail);
    user = await User.create({
      username,
      personalEmail,
      caltechEmail,
      password,
    });

    req.login(user, (err) =>
      err ? next(err) : res.status(200).json({ ...user.toJSON(), authLevel: 1 })
    );
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

router.post("/logout", (req, res) => {
  try {
    req.logout(() => {
      req.session.destroy();
      res.redirect("/");
    });
  } catch (error) {
    next(err);
  }
});

router.post("/verify", async (req, res) => {
  try {
    let ver = await Verification.findOne({ where: { hash: req.body.hash } });
    if (ver) {
      console.log(ver);
      email = ver.email;
      emailType = ver.emailType;
      await ver.destroy();
      res.status(200).json({ email, emailType });
    } else res.sendStatus(202);
  } catch (error) {
    next(err);
  }
});

/**
 *  requiredAuth values:
 *    0.5 => need to verify
 *    0 => no login required                      (or 1/2/3/4 reqs)
 *    1 => login required (non darbs can access)  (or 2/3/4 reqs)
 *    2 => login & socialDarb required            (or 3/4 reqs)
 *    3 => login & fullDarb required              (or 4 reqs)
 *    4 => admin status required
 */

/**
 *
 * @param {session user} user
 * @returns auth level of the user, see above chart
 *          yes i made this go from 0 to 3 (excepting 4)
 *          in order on purpose
 */
async function calculateAuthLevel(user) {
  if (!user) {
    return 0;
  } else {
    if (user.isAdmin) {
      return 4;
    }
    // test verification emails
    const ver = await Verification.findAll({ where: { userId: user.id } });
    if (ver.length > 0) {
      return 0.5;
    }
    const affiliation = await Affiliation.findOne({
      where: { house: "dabney", userId: user.id },
    });
    if (affiliation == null) {
      return 1;
    }
    if (affiliation.status == "social") {
      return 2;
    }
    if (affiliation.status == "full") {
      return 3;
    }
  }
}

/**
 * returns the currently logged in user
 */
router.get("/me", async (req, res) => {
  const authLevel = await calculateAuthLevel(req.user);
  res.json({ ...(req.user ? req.user.toJSON() : {}), authLevel });
});
