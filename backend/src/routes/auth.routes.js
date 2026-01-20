const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken); // refresh token public

router.use(auth);

router.get('/me', AuthController.getMe);


module.exports = router;
