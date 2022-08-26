const router = require("express").Router();
const { Verification } = require("../db/models");
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
      req.login(user, (err) => (err ? next(err) : res.json(user)));
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

    user = await User.create({
      username,
      personalEmail,
      caltechEmail,
      password,
    });

    req.login(user, (err) => (err ? next(err) : res.status(200).json(user)));
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

router.get("/me", (req, res) => {
  res.json(req.user);
});
