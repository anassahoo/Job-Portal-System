const userService = require("../../services/user.service");

exports.getProfile = (req, res) => {
  userService.getProfile(req, res);
};

exports.updateProfile = (req, res) => {
  userService.updateProfile(req, res);
};

exports.updateAccount = (req, res) => {
  userService.updateAccount(req, res);
};

exports.uploadProfileImage = (req, res) => {
  userService.uploadProfileImage(req, res);
};