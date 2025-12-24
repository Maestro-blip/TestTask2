const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.js')
const validation = require('../middleware/validation.js')

router.post('/register',validation.validDate,authController.register);
router.post('/login',validation.validDate,authController.login);

module.exports = router;