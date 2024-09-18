const mTLSAgent = require("./mTLSAgent");
const { Axios } = require("axios");

const keycloak = Axios.create({
    baseURL: process.env.ISSUER_BASE_URL,
    httpsAgent: mTLSAgent,
})

module.exports = keycloak;