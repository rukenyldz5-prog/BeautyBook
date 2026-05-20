const express = require("express");
const { create, list, update, remove } = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: List current user's appointments
 *   post:
 *     summary: Create appointment
 */
router.get("/", list);
router.post("/", create);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Update appointment
 *   delete:
 *     summary: Delete appointment
 */
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
