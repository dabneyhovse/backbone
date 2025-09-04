/**
 * Author:	Nick Jasinski
 * Date:		2024-09-11
 *
 * Main express appsetup
 *  pg db sync
 *  OIDC setup
 *  add auth, api, static routes
 *  send index html
 *  endware for error handling
 */
// register env vars first
require("dotenv").config();

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const session = require("express-session");
// const passport = require("passport");
const { auth } = require("express-openid-connect");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db");
const sessionStore = new SequelizeStore({ db });
const PORT = process.env.PORT || 8080;
const app = express();
const socketio = require("socket.io");
const { URLSearchParams } = require("url");

module.exports = app;

if (process.env.NODE_ENV === "test") {
  after("close the session store", () => sessionStore.stopExpiringSessions());
}

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

if (process.env.NODE_ENV !== "development") {
  app.set('trust proxy', '127.0.0.1');
}

// passport registration
// passport.serializeUser((user, done) => done(null, user.id));
// // passport deserialization using oor db
// passport.deserializeUser(async (id, done) => {
//   try {
//     // TODO restrict the data that loads into passport
//     const user = await db.models.user.findByPk(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

const createApp = async () => {
  // logging middleware
  app.use(morgan("dev"));

  // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // compression middleware
  app.use(compression());

  // // session middleware with passport
  // app.use(
  //   session({
  //     secret: process.env.SESSION_SECRET || "oof",
  //     store: sessionStore,
  //     resave: false,
  //     saveUninitialized: true,
  //   })
  // );
  // app.use(passport.initialize());
  // app.use(passport.session());

  // // auth and api routes

  // Optionally enable mTLS for the IdP only if cert/key paths are configured
  let httpAgentOption;
  if (process.env.CLIENT_KEY_PATH && process.env.CLIENT_CERT_PATH) {
    try {
      const { default: mTLSAgent } = await import("module-keycloak/mTLSAgent");
      httpAgentOption = { https: mTLSAgent };
      console.log("OIDC mTLS enabled via module-keycloak/mTLSAgent");
    } catch (err) {
      console.warn("Failed to load mTLS agent; proceeding without mTLS:", err.message);
    }
  }

  const hasOidc =
    !!process.env.ISSUER_BASE_URL &&
    !!process.env.CLIENT_ID &&
    !!process.env.SECRET;

  if (hasOidc) {
    app.use(
      auth({
        authRequired: false,
        idpLogout: true,
        attemptSilentLogin: true,
        errorOnRequiredAuth: true,
        clientAuthMethod: "none",
        secret: process.env.SECRET,
        baseURL: process.env.BASE_URL,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        session: {
          store: sessionStore,
        },
        ...(httpAgentOption ? { httpAgent: httpAgentOption } : {}),
        idTokenSigningAlg: "EdDSA",
        authorizationParams: {
          response_type: 'id_token',
          response_mode: 'form_post',
          scope: 'openid profile email',
          client_id: process.env.CLIENT_ID
        },
        routes: {
          // login: false,
          logout: "/logout",
          postLogoutRedirect: "/auth/postlogout"
        }
      })
    );
  } else {
    console.warn(
      "OIDC disabled: missing ISSUER_BASE_URL, CLIENT_ID, or SECRET. Running without login."
    );
  }

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

async function syncServiceDbs() {
  const { serviceConfigs } = require("../services");
  const allServices = serviceConfigs;

  console.log("Syncing service databases...");
  let count = 0;

  for (let i = 0; i < allServices.length; i++) {
    try {
      if (allServices[i].importDb) {
        const dbService = require(`${allServices[i].moduleName}/Database`);
        await dbService.sync();
        console.log(
          `\t[${allServices[i].name}]:\tsynced database "${allServices[i].route}"`
        );

        count++;
      } else {
        console.log(`\t[${allServices[i].name}]:\tdoes not have a database`);
      }
    } catch (error) {
      console.log(
        `\t syncing db for ${allServices[i].name}, ${allServices.route}`
      );
    }
  }
  console.log(`Synced ${count} service database(s)\n`);
}

const syncDb = () => db.sync();

async function bootApp() {
  await sessionStore.sync();
  await syncDb();
  await syncServiceDbs();
  await createApp();
  await startListening();
}

// For testing if i ever set it up
if (require.main === module) {
  bootApp();
} else {
  createApp();
}
