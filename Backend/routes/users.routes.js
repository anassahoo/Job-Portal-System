const express = require("express");
const router = express.Router();

const userController = require("../config/controllers/user.controller");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// 🔐 Protected Routes
router.get("/me", authMiddleware, userController.getProfile);
router.get("/candidates", authMiddleware, userController.getCandidates);
router.put("/me", authMiddleware, userController.updateProfile);
router.put("/me/account", authMiddleware, userController.updateAccount);
router.post("/upload", authMiddleware, upload.single("image"), userController.uploadProfileImage);

module.exports = router;