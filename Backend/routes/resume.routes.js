const express = require("express");
const router = express.Router();

const resumeController = require("../config/controllers/resume.controller");
const authMiddleware = require("../middleware/authMiddleware");
const resumeUpload = require("../middleware/resumeUpload");

// upload resume
router.post("/upload", authMiddleware, resumeUpload.single("resume"), resumeController.uploadResume);

// get my resume
router.get("/me", authMiddleware, resumeController.getResume);

module.exports = router;