# Backbone (PERN)

A modular PERN stack website with OIDC auth and pluggable services.

## Prerequisites

- Node.js >= 18, npm >= 8
- PostgreSQL running locally (default localhost:5432)
- Optional: Service modules if you want all features
  - service-frotator, service-gallery (npm-linked)
  - Local modules in ../Modules: module-keycloak, module-dabney-email, module-middleware

## 1) Environment

Copy `.env.example` to `.env` and fill in:

- POSTGRES_USERNAME, POSTGRES_PASSWORD
- ISSUER_BASE_URL, BASE_URL, CLIENT_ID, SECRET (OIDC)

For local dev, BASE_URL typically `http://localhost:8080`.

## 2) Database

Create the database and user (example with default names):

```sh
createdb DabneyBackbone
# ensure your Postgres user exists and has a password matching .env
```

The app will create its own session table on start.

## 3) Modules (optional but recommended)

Some features expect local modules and services:

- Ensure `../Modules/module-keycloak`, `../Modules/module-dabney-email`, `../Modules/module-middleware` exist (package.json uses file: deps)
- If you have `service-frotator` and `service-gallery`, link them:

```sh
npm run link-services
```

If you don't have these services, comment out their usage in `src/services/index.js` or expect build errors.

## 4) Install deps

```sh
npm install
```

If you get errors about missing `module-*` packages, set up the `../Modules` folder as above or remove those deps.

## 5) Run (dev)

Starts webpack in watch mode and the server with nodemon:

```sh
npm run start-dev
```

- App: http://localhost:8080

## 6) Run (prod-like)

Build once and start the server:

```sh
npm run build
npm start
```

## Notes

- OIDC: If `ISSUER_BASE_URL`, `CLIENT_ID`, and `SECRET` are set, the app enables OIDC via express-openid-connect. If they are not set, the app runs without login for local dev. mTLS is used only when `CLIENT_KEY_PATH` and `CLIENT_CERT_PATH` are also set.
- DB: `src/server/db/db.js` connects to Postgres db `DabneyBackbone` using POSTGRES_USERNAME/POSTGRES_PASSWORD.
- Services: Optional services (e.g., `service-frotator`, `service-gallery`) are auto-detected. If not installed/linked, they’re skipped gracefully.
- Static assets are built to `public/` by webpack and served by Express.

## Extending

- Adding a new Service or general Module? See:
  - `docs/ADDING_SERVICES_AND_MODULES.md`
  - `docs/KEYCLOAK_SETUP.md`
