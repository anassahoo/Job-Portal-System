const skillService = require("../../services/skill.service");

exports.addSkill = (req, res) => {
  skillService.addSkill(req, res);
};

exports.getMySkills = (req, res) => {
  skillService.getMySkills(req, res);
};

exports.removeSkill = (req, res) => {
  skillService.removeSkill(req, res);
};

exports.createSkill = (req, res) => {
  skillService.createSkill(req, res);
};

exports.getAllSkills = (req, res) => {
  skillService.getAllSkills(req, res);
};