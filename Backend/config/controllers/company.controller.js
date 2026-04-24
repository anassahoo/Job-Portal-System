const companyService = require("../../services/company.service");

exports.createCompany = (req, res) => {
  companyService.createCompany(req, res);
};

exports.getCompanies = (req, res) => {
  companyService.getCompanies(req, res);
};

exports.getCompanyById = (req, res) => {
  companyService.getCompanyById(req, res);
};