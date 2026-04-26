const service = require("../../services/application.service");

exports.applyJob = (req, res) => {
  service.applyJob(req, res);
};

exports.getApplications = (req, res) => {
  service.getApplications(req, res);
};

exports.getRecruiterApplications = (req, res) => {
  service.getRecruiterApplications(req, res);
};

exports.updateApplicationStatus = (req, res) => {
  service.updateApplicationStatus(req, res);
};