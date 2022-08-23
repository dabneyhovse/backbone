const router = require("express").Router();
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

    req.login(user, (err) => (err ? next(err) : res.json(user)));

    res.status(200).send({
      id: user.id,
      username,
      personalEmail,
      caltechEmail,
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect("/");
  });
});

router.get("/verify", (req, res) => {
  // if (user) {
  //   await user.update({ password});
  // } else {
  //   res.status(404).send("Please check your verification code.");
  //   return;
  // }
});

router.get("/me", (req, res) => {
  console.log(req.user);
  res.json(req.user);
});
