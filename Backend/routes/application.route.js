const express = require("express");
const router = express.Router();

const controller = require("../config/controllers/application.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/apply", authMiddleware, controller.applyJob);
router.get("/", authMiddleware, controller.getApplications);

module.exports = router;