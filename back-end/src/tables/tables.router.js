/**
 * Defines the router for tables resources.
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router.use(cors());

router.route("/:table_id/seat")
    .put(controller.seatTable)
    .all(methodNotAllowed)

module.exports = router;
