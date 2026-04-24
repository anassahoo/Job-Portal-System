const jobService = require("../../services/job.service");

exports.createJob = (req, res) => {
  jobService.createJob(req, res);
};

exports.addJobSkill = (req, res) => {
  jobService.addJobSkill(req, res);
};

exports.getAllJobs = (req, res) => {
  jobService.getAllJobs(req, res);
};

exports.getJobDetails = (req, res) => {
  jobService.getJobDetails(req, res);
};