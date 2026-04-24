const service = require("../../services/application.service");

exports.applyJob = (req, res) => {
  service.applyJob(req, res);
};

exports.getApplications = (req, res) => {
  service.getApplications(req, res);
};