const authService = require("../../services/auth.service");

exports.signup = (req, res) => {
  authService.signup(req, res);
};

exports.login = (req, res) => {
  authService.login(req, res);
};