const companyService = require("../../services/company.service");

exports.createCompany = (req, res) => {
  companyService.createCompany(req, res);
};

exports.getCompanies = (req, res) => {
  companyService.getCompanies(req, res);
};

exports.getRecruiters = (req, res) => {
  companyService.getRecruiters(req, res);
};

exports.getCompanyById = (req, res) => {
  companyService.getCompanyById(req, res);
};

exports.getMyCompany = (req, res) => {
  companyService.getMyCompany(req, res);
};

exports.updateMyCompany = (req, res) => {
  companyService.updateMyCompany(req, res);
};