const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.js')


const authRouter = require('./auth.js');
const eventsRouter = require('./events.js');
const regRouter = require('./reg.js');

router.use('/auth',authRouter);
router.use('/events',eventsRouter)
router.use('/registrations',authMiddleware.checkToken,regRouter)

module.exports = router;