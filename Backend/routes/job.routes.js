const express = require("express");
const router = express.Router();

const jobController = require("../config/controllers/job.controller");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// =====================
// CREATE JOB (WITH LOGO)
// =====================
router.post("/create", authMiddleware, upload.single("image"), jobController.createJob);

// =====================
// ADD SKILL TO JOB
// =====================
router.post("/add-skill", authMiddleware, jobController.addJobSkill);

// =====================
// GET ALL JOBS
// =====================
router.get("/", authMiddleware, jobController.getAllJobs);

// =====================
// GET MY JOBS (RECRUITER)
// =====================
router.get("/my", authMiddleware, jobController.getMyJobs);

// =====================
// UPDATE JOB
// =====================
router.put("/:id", authMiddleware, jobController.updateJob);

// =====================
// GET JOB DETAILS
// =====================
router.get("/:id", authMiddleware, jobController.getJobDetails);

module.exports = router;