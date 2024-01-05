/**
 * Defines the router for reservation resources.
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./search.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router.use(cors());

router.route("/")
    .get(controller.search)
    .all(methodNotAllowed)

module.exports = router;
