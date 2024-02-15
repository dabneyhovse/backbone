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
module.exports = router;

// static file-serving middleware
router.use(express.static(path.join(__dirname, "../..", "public")));

// TODO for whatever reason this restricts what normal pages people can access, iim too lazy to look into it rn'

// router.use(
//   isLoggedIn,
//   express.static(path.join(__dirname, "../..", "restricted/login"))
// );
