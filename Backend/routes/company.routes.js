const express = require("express");
const router = express.Router();

const companyController = require("../config/controllers/company.controller");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// CREATE COMPANY
router.post("/create", authMiddleware, upload.single("logo"), companyController.createCompany);

// GET ALL COMPANIES
router.get("/", authMiddleware, companyController.getCompanies);

// GET MY COMPANY
router.get("/my", authMiddleware, companyController.getMyCompany);

// GET SINGLE COMPANY
router.get("/:id", authMiddleware, companyController.getCompanyById);

module.exports = router;