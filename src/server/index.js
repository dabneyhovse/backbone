/**
 * Author:	Nick Jasinski
 * Date:		2022-08-19
 *
 * Main express appsetup
 *  pg db sync
 *  passport session setup
 *  add auth, api, static routes
 *  send index html
 *  endware for error handling
 */

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const session = require("express-session");
const passport = require("passport");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db");
const sessionStore = new SequelizeStore({ db });
const PORT = process.env.PORT || 8080;
const app = express();
const socketio = require("socket.io");
module.exports = app;

if (process.env.NODE_ENV === "test") {
  after("close the session store", () => sessionStore.stopExpiringSessions());
}

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// passport registration
passport.serializeUser((user, done) => done(null, user.id));
// passport deserialization using oor db
passport.deserializeUser(async (id, done) => {
  try {
    // TODO restrict the data that loads into passport
    const user = await db.models.user.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const createApp = () => {
  // logging middleware
  app.use(morgan("dev"));

  // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // compression middleware
  app.use(compression());

  // session middleware with passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "oof",
      store: sessionStore,
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // auth and api routes

  app.use("/auth", require("./auth"));
  app.use("/api", require("./api"));
  app.use("/", require("./static"));

  /**
   * any remaining requests with an extension (.js, .css, etc.) send 404
   */
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error("Not found");
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // sends index.html
  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../..", "public/index.html"));
  });

  // error handling endware
  app.use((err, req, res, next) => {
    if (!err.fake) {
      console.error(err.stack);
    }
    res.status(err.status || 500).send(err.message || "Internal server error.");
  });
};

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  // TODO create a few extra instances of this to reduce latency, note that this oone server supports most of the web infastructure so...
  const server = app.listen(PORT, () =>
    console.log(`Streaming nonsense on port ${PORT}`)
  );

  // set up socket control
  const io = socketio(server);
  require("./socket")(io);
};

const syncDb = () => db.sync();

async function bootApp() {
  await sessionStore.sync();
  await syncDb();
  await createApp();
  await startListening();
}

// For testing if i ever set it up
if (require.main === module) {
  bootApp();
} else {
  createApp();
}
