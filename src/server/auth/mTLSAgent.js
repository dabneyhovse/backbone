const { Agent } = require("https");
const { readFileSync } = require("fs");

const mTLSAgent = new Agent({
  key: readFileSync(process.env.CLIENT_KEY_PATH, "utf8"),
  cert: readFileSync(process.env.CLIENT_CERT_PATH, "utf8"),
});

module.exports = mTLSAgent;