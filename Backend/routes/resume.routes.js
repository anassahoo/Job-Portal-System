const express = require("express");
const router = express.Router();

const resumeController = require("../config/controllers/resume.controller");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// upload resume
router.post("/upload", authMiddleware, upload.single("resume"), resumeController.uploadResume);

// get my resume
router.get("/me", authMiddleware, resumeController.getResume);

module.exports = router;