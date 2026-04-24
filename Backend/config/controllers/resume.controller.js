const resumeService = require("../../services/resume.service");

exports.uploadResume = (req, res) => {
  resumeService.uploadResume(req, res);
};

exports.getResume = (req, res) => {
  resumeService.getResume(req, res);
};