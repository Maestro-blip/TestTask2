const express = require('express');
const router = express.Router();
const reqController = require('../controller/registration.js')

router.post('/',reqController.createReg)
router.get('/',reqController.readReg)


module.exports = router;