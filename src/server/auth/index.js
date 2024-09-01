const router = require("express").Router();
const { Verification, Affiliation } = require("../db/models");
const User = require("../db/models/user");
const sendEmail = require("module-dabney-email");
const crypto = require("crypto");

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

    /**
     * email is valid, check if it is in use already
     */
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

    /**
     * check personal email for usage
     */
    user = await User.findOne({
      where: {
        personalEmail,
      },
    });

    if (user) {
      res
        .status(403)
        .send("An account already exists with this Personal Email.");
      return;
    }

    /**
     * check username for useage
     */
    user = await User.findOne({
      where: {
        username,
      },
    });

    if (user) {
      res.status(403).send(`The username "${username}" is already taken.`);
      return;
    }

    /**
     * create user after passing checks
     */
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

router.post("/verify", async (req, res, next) => {
  try {
    let ver = await Verification.findOne({ where: { hash: req.body.hash } });
    if (ver) {
      email = ver.email;
      emailType = ver.emailType;

      // if we are verifying a telegram id
      if (emailType == "telegram") {
        // gotta be logged in to link telegram
        if (!req.user) {
          res.sendStatus(403);
          return;
        }

        // email maps to telegram userid in this case lol
        // TODO generalize the verification names
        telegram_id = ver.email;

        const user = await User.findByPk(req.user.id);
        user.telegram_id = telegram_id;
        await user.save();
        await ver.destroy();

        res.sendStatus(201);
        return;
      } else if (emailType == "password") {
        // if we're doing a password reset
        const user = await User.findByPk(ver.userId);

        hash = crypto
          .createHmac("sha256", process.env.HASH_SECRET)
          .update(`${Math.random()}`)
          .digest("hex");
        await user.update({ password: hash });

        // TODO handle email errors
        await sendEmail(
          ver.email,
          "Dabney Hovse Password Reset",
          `Hello, ${user.username} your new password is ${hash}`
        );

        await ver.destroy();
        res.sendStatus(201);
        return;
      }
      await ver.destroy();
      res.status(200).json({ email, emailType });
    } else {
      err = new Error("Verification code not found.");
      err.status = 500;
      throw err;
    }

    res.sendStatus(202);
  } catch (error) {
    next(error);
  }
});

router.post("/password-reset", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { personalEmail: req.body.personalEmail },
    });
    if (user) {
      // catch old password resets
      let ver = await Verification.findOne({
        where: {
          emailType: "password",
          userId: user.id,
          email: req.body.personalEmail,
        },
      });
      if (ver) {
        await ver.destroy();
      }

      // create a new one, emails are sent in the create hook
      ver = await Verification.create({
        emailType: "password",
        userId: user.id,
        email: req.body.personalEmail,
      });
      res.sendStatus(200);
      return;
    } else {
      throw new Error("The provided personal email was not found.");
    }
  } catch (error) {
    next(error);
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
    const full = await Affiliation.findOne({
      where: {
        house: "dabney",
        userId: user.id,
        status: "full",
        verified: true,
      },
    });
    const social = await Affiliation.findOne({
      where: {
        house: "dabney",
        userId: user.id,
        status: "social",
        verified: true,
      },
    });

    if (social == null && full == null) {
      return 1;
    }
    if (social !== null && full == null) {
      return 2;
    }
    if (full !== null) {
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
