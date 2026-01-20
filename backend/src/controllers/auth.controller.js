// src/controllers/auth.controller.js
const authService = require('../services/auth.services');

exports.login = async (req, res, next) => {
  try {
    const { login, motDePasse } = req.body;
    const result = await authService.login(login, motDePasse);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};
