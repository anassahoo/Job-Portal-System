const express = require("express");
const router = express.Router();

const skillController = require("../config/controllers/skill.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, skillController.addSkill);
router.get("/my", authMiddleware, skillController.getMySkills);
router.delete("/remove", authMiddleware, skillController.removeSkill);
router.post("/create", authMiddleware, skillController.createSkill);

module.exports = router;