const express = require("express");
const router = express.Router();

const companyController = require("../config/controllers/company.controller");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE COMPANY
router.post("/create", authMiddleware, companyController.createCompany);

// GET ALL COMPANIES
router.get("/", authMiddleware, companyController.getCompanies);

// GET SINGLE COMPANY
router.get("/:id", authMiddleware, companyController.getCompanyById);

module.exports = router;