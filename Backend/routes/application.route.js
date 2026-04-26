const express = require("express");
const router = express.Router();

const controller = require("../config/controllers/application.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/apply", authMiddleware, controller.applyJob);
router.get("/", authMiddleware, controller.getApplications);
router.get("/recruiter", authMiddleware, controller.getRecruiterApplications);
router.put("/:id/status", authMiddleware, controller.updateApplicationStatus);

module.exports = router;
