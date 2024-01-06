/**
 * Defines the router for reservation resources.
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router.use(cors());

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)

router.route("/new")
    .post(controller.create)
    .all(methodNotAllowed)

router.route("/:reservation_id")       
    .get(controller.read)
    .put(controller.edit)
    .all(methodNotAllowed)

router.route("/:reservation_id/status")
    .put(controller.updateReservationStatus);

module.exports = router;
