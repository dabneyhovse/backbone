/**
 * Author:	Nick Jasinski
 * Date:		2022-08-19
 *
 * This file serves static files, it really isnt needed
 * but is included in case theres anthing odd that needs
 * to be statically served.
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const { isLoggedIn } = require("./api/middleware");
module.exports = router;

// static file-serving middleware
router.use(express.static(path.join(__dirname, "../..", "public")));

router.use(
  isLoggedIn,
  express.static(path.join(__dirname, "../..", "restricted/login"))
);
