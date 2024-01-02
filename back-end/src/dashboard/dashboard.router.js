/**
 * Defines the router for dashboard resources.
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./dashboard.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router.use(cors());

router.route("/")
    .get(controller.listDashboard)
    .all(methodNotAllowed)

module.exports = router;
