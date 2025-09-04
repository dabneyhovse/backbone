# Keycloak / OIDC Setup

This app uses OpenID Connect via `express-openid-connect`. It’s compatible with Keycloak and other OIDC providers. Follow these steps to enable login and role-based access.

---

## 1) Run or choose a Keycloak instance

- Local (optional):
  - Docker example (choose a port not used by the app):
    ```sh
    docker run -p 8081:8080 \
      -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin \
      quay.io/keycloak/keycloak:latest start-dev
    ```
  - Admin console: http://localhost:8081

## 2) Create a Realm and Client

1) Create a realm (e.g., `dabney`).
2) Create a client for Backbone:
   - Client type: OpenID Connect
   - Client ID: must match your `.env` `CLIENT_ID` (e.g., `backbone`)
   - Client authentication: Off (public client)
   - Flows: Enable Implicit Flow (the app requests `response_type=id_token`)
   - Valid redirect URIs:
     - `http://localhost:8080/callback`
   - Valid post-logout redirect URIs:
     - `http://localhost:8080/auth/postlogout`
   - Web origins:
     - `http://localhost:8080`

> Notes
> - The server uses the default callback route `/callback` from `express-openid-connect`.
> - `BASE_URL` should match where this app is reachable.

## 3) Token signing algorithm (EdDSA / Ed25519)

The server currently sets `idTokenSigningAlg: "EdDSA"`. Configure Keycloak to issue Ed25519-signed tokens.

### A) Add and enable an Ed25519 key

1) Realm Settings → Keys → Providers → Add provider → "ECDSA/EdDSA".
2) Select curve: "Ed25519" and Save.
3) In the Keys list, locate the newly created Ed25519 key:
  - Ensure the key is Enabled (toggle on).
  - Increase its Priority so it’s higher than any RSA keys. Higher numbers win.
  - If needed, click "Make active" (or similar) so it’s used for signing.

### B) Set defaults to EdDSA

1) Realm Settings → Tokens → Default Signature Algorithm → "EdDSA".
2) Client-level override (recommended): Clients → your Backbone client → Advanced Settings →
  - ID Token Signature Algorithm → "EdDSA".
  - (Optional) Access Token Signature Algorithm → "EdDSA".

If both realm and client are set, the client-level setting applies to that client.

### C) Verify JWKS and configuration

1) Open the issuer config: `${ISSUER_BASE_URL}/.well-known/openid-configuration` and find `jwks_uri`.
2) Visit `jwks_uri` and confirm there’s a key with:
  - `kty: "OKP"`, `crv: "Ed25519"`, `alg: "EdDSA"`.
3) Retry login; the app will accept EdDSA-signed ID tokens.

### Alternate: RS256 (not preferred here)

If you cannot enable EdDSA in your Keycloak version, you can switch the app to RS256 by changing or removing `idTokenSigningAlg` in `src/server/index.js`.

## 4) Expose roles in a custom claim `backbone_roles`

Backbone checks claims like `claimIncludes('backbone_roles', 'backbone-admin')` on server routes and in the UI.

Steps in Keycloak:
1) Create realm roles you need (e.g., `backbone-admin`).
2) Client Scopes → Create scope (e.g., `backbone`).
3) In that scope, add a mapper:
   - Mapper type: User Realm Role
   - Token Claim Name: `backbone_roles`
   - Claim JSON Type: String
   - Multivalued: On
   - Add to access token: On
4) Assign the `backbone` client scope to your Backbone client (Default or Optional).
5) Assign roles to users/groups; they will appear in the ID/Access token under `backbone_roles`.

## 5) Configure `.env` (backbone/.env)

Set these values:

```
BASE_URL=http://localhost:8080
ISSUER_BASE_URL=http://localhost:8081/realms/dabney   # your Keycloak realm URL
CLIENT_ID=backbone                                    # your client ID
SECRET=<random-32+ chars>                             # session encryption secret
```

Tips:
- For modern Keycloak, the issuer format is `http(s)://host/realms/<realm>`.
- Generate a secret (used by the app, not by Keycloak) with `openssl rand -base64 32`.

## 6) Optional: mTLS to the IdP

If your IdP requires mutual TLS, `module-keycloak/mTLSAgent` can present client certs. Set both to enable:

```
CLIENT_KEY_PATH=/absolute/path/to/client.key
CLIENT_CERT_PATH=/absolute/path/to/client.crt
```

The server will auto-enable mTLS for OIDC discovery and token calls if both are present.

## 7) Test the flow

1) Start the app in dev:
   ```sh
   npm install
   npm run start-dev
   ```
2) Visit `http://localhost:8080/login`.
3) Log in via Keycloak; you should return to the app as logged-in.
4) Assign yourself `backbone-admin` and verify admin-protected routes work (server checks `backbone_roles`).

## Troubleshooting

- 401/403 but login succeeded:
  - Ensure your user has the expected realm role and that `backbone_roles` is emitted.
  - Verify the client scope with the role mapper is attached to the client.
- Invalid signature / “alg” mismatch:
  - Align Keycloak’s signature algorithm with the app (EdDSA vs RS256).
- Callback/redirect errors:
  - Confirm redirect and post-logout URIs exactly match what’s configured in Keycloak.
