# Adding Services and Modules

This project supports two kinds of extensibility:

- Services: Feature plugins that can contribute UI (React), API routes (Express), database models (Sequelize), and Redux. They appear in the Services menu and may get their own SPA route.
- Modules: General-purpose libraries used by Backbone (e.g., Keycloak helpers, email). These don’t automatically wire themselves into menus or routes.

Use this guide to create and integrate both.

---

## Services

A service is described by a `Config` object and can optionally export entry points for React, Redux, Express, and Database.

### Minimal contract (required/optional exports)

A service module typically exposes these entry points:

- Required
  - `Config` (CommonJS module): metadata and wiring flags
- Optional
  - `React` (default export): top-level React component mounted at `/your-route/*`
  - `Redux` (default export): a Redux reducer the app can dynamically inject
  - `Express` (default export): an Express Router mounted at `/api/your-route/*`
  - `Database` (default export): a Sequelize instance or object with `sync()`

Your `Config` should include:

- `name`: Display name in Services dropdown
- `description`: Short blurb
- `route`: Base route slug (e.g., `"frotator"`) or `""` for none/external
- `href`: Optional external URL if `routeType === "href"`
- `createRoute`: If Backbone should create a SPA route (true/false)
- `moduleName`: Your npm module name (e.g., `"service-frotator"`)
- `routeType`: `"react-router"` | `"href"`
- `displayInNav`: Show in Services dropdown (true/false)
- `dropdownItemPosition`: `"t" | "m" | "b"` (top/middle/bottom)
- `tooltip`: Short hover text
- `requiredClaims`: Array of Keycloak/IdP claims required to view
- Flags informing Backbone what to import:
  - `importDb`, `importReact`, `importExpress`, `importAdmin`, `importRedux`

Example (abbreviated):

```js
// in your service package: Config.js
module.exports = {
  name: "My Service",
  description: "Does cool stuff.",
  route: "myservice",
  createRoute: true,
  moduleName: "service-myservice",
  routeType: "react-router",
  displayInNav: true,
  dropdownItemPosition: "m",
  tooltip: "My cool service",
  requiredClaims: ["myservice-access"],
  importDb: true,
  importReact: true,
  importExpress: true,
  importRedux: true,
};
```

### Registering your service with Backbone

1) Add your service to the services registry
- Open `src/services/index.js` and add your module’s config:
  ```js
  // ...existing imports
  let serviceConfigs = [
    // built-ins...
    // external service modules
    require("service-myservice/Config"),
  ];
  module.exports = { serviceConfigs };
  ```

2) Client route (if `importReact: true` and `createRoute: true`)
- Open `src/client/routes.js` and lazy-load your React entry + (optionally) Redux reducer:
  ```js
  // SERVICES NOTE
  const MyService = React.lazy(() => import("service-myservice/React"));
  import myServiceReducer from "service-myservice/Redux"; // if provided

  // Inside routes
  <Route
    exact={false}
    path={"/myservice/*"}
    element={
      <LazyAuth
        managerContainer={
          <ManagerContainer reducer={myServiceReducer} serviceKey={"myservice"} />
        }
        requiredClaims={["myservice-access"]}
        userClaims={userClaims}
        lazyElement={<MyService />}
      />
    }
  />
  ```
  - Access control: `LazyAuth` uses `requiredClaims` vs. user claims from OIDC.
  - If your service is purely external (`routeType: "href"`), you don’t need a SPA route; the menu will link directly to `href`.

3) API routes (if `importExpress: true`)
- Backbone automatically mounts your Express router under `/api/<route>/` via `src/server/api/index.js`:
  ```js
  // in your service package: Express.js
  const router = require("express").Router();
  router.get("/status", (req, res) => res.json({ ok: true }));
  module.exports = router;
  ```

4) Database (if `importDb: true`)
- Backbone calls `await require("service-myservice/Database").sync()` on boot (`src/server/index.js`). Export a Sequelize instance or an object that has a `sync()` method.
  ```js
  // in your service package: Database.js
  const { Sequelize, DataTypes } = require("sequelize");
  // Use your own DB connection or import Backbone's (advanced use)
  const db = new Sequelize(process.env.SVC_DB_URL);
  const Widget = db.define("widget", { name: DataTypes.STRING });
  module.exports = db; // has .sync()
  ```

5) Navigation
- The Services dropdown uses your `Config` fields: `name`, `description`, `displayInNav`, `dropdownItemPosition`, and `routeType`+`href` (for external links).

### Packaging your service module

- Name your package (e.g., `service-myservice`), publish to npm or develop locally.
- Local development options:
  - Put it next to Backbone (e.g., `../service-myservice`) and use `npm link`:
    ```sh
    cd ../service-myservice && npm link
    cd - && npm link service-myservice
    ```
  - Or add it as a file dependency in Backbone’s `package.json`:
    ```json
    {
      "dependencies": {
        "service-myservice": "file:../service-myservice"
      }
    }
    ```
- Webpack transpilation note:
  - `webpack.config.js` currently transpiles `service-frotator` and `service-gallery` even though they are in `node_modules`.
  - If your service ships untranspiled JSX/modern syntax, add your module name to the `not: [ /service-frotator/, /service-gallery/, /service-myservice/ ]` list for the Babel loader, or publish transpiled code.

### Auth and claims

- `requiredClaims` in your service `Config` refers to OIDC/Keycloak roles exposed to Backbone.
- Ensure your IdP (e.g., Keycloak) assigns the needed roles and that they appear in the token claim used by the app (`user.data.backbone_roles`).

### Common pitfalls

- Module not found:
  - Ensure your service is installed (`npm install`, `npm link`, or `file:` dep) and the name matches `moduleName`/imports.
- Build failure due to syntax in node_modules:
  - Add your service to the webpack transpile exceptions or publish a transpiled build.
- Missing DB tables:
  - Make sure your `Database` export has `sync()` and env vars are set.

---

## Modules (non-service libraries)

Modules are general utilities used by Backbone (e.g., `module-keycloak`, `module-dabney-email`, `module-middleware`). They don’t register routes or nav items by themselves.

### Adding a module

1) Create your module
- Place it adjacent to the repo (e.g., `../Modules/my-module`) with a proper `package.json` (`name`, `version`, `main`).

2) Install into Backbone
- Add to `package.json` dependencies using a local file path:
  ```json
  {
    "dependencies": {
      "my-module": "file:../Modules/my-module"
    }
  }
  ```
- Then run `npm install` in Backbone.

3) Import and use
- In Backbone code, import normally:
  ```js
  const myUtil = require("my-module");
  // or
  import myUtil from "my-module";
  ```

### Developing locally

- `npm link` is convenient for iterating:
  ```sh
  cd ../Modules/my-module && npm link
  cd - && npm link my-module
  ```

### Examples in this repo

- `module-keycloak`: exposes mTLS agent helpers used by OIDC (`module-keycloak/mTLSAgent`).
- `module-dabney-email`: email utilities.
- `module-middleware`: shared server middleware.

If these directories don’t exist locally, either create them, remove the dependencies/usages, or replace them with published packages.

---

## Environment variables and setup notes

- Backbone needs Postgres credentials (`POSTGRES_USERNAME`, `POSTGRES_PASSWORD`). It connects to the `DabneyBackbone` database on `localhost` by default.
- OIDC config (optional but recommended): `ISSUER_BASE_URL`, `BASE_URL`, `CLIENT_ID`, `SECRET`.
- Services and modules may define additional env vars; document those in your service/module README.

---

## Quick validation checklist

- Service registers in `src/services/index.js`
- If SPA route: lazy import in `src/client/routes.js` and optional dynamic Redux via `ManagerContainer`
- If API: service `Express` export mounts at `/api/<route>/`
- If DB: `Database` export provides `sync()` and connects successfully
- Navigation shows service (if `displayInNav: true`)
- Claims restrict access appropriately
