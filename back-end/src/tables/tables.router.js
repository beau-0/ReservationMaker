/**
 * Defines the router for tables resources.
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router.use(cors());

router.route("/")
    .post(controller.create)
    .get(controller.listTables)
    .all(methodNotAllowed)

router.route("/:table_id/seat")
    .put(controller.seatTable)
    .delete(controller.delete)
    .all(methodNotAllowed) 

module.exports = router;
