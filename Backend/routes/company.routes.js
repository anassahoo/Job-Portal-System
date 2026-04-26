const express = require("express");
const router = express.Router();

const companyController = require("../config/controllers/company.controller");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// CREATE COMPANY
router.post("/create", authMiddleware, upload.single("logo"), companyController.createCompany);

// GET ALL COMPANIES
router.get("/", authMiddleware, companyController.getCompanies);

// GET RECRUITERS DIRECTORY
router.get("/recruiters", authMiddleware, companyController.getRecruiters);

// GET MY COMPANY
router.get("/my", authMiddleware, companyController.getMyCompany);

// UPDATE MY COMPANY
router.put("/my", authMiddleware, upload.single("logo"), companyController.updateMyCompany);

// GET SINGLE COMPANY
router.get("/:id", authMiddleware, companyController.getCompanyById);

module.exports = router;