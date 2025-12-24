const express = require('express');
const router = express.Router();

const authRouter = require('./auth.js');
const eventsRouter = require('./events.js');

router.use('/auth',authRouter);
router.use('/events',eventsRouter)

module.exports = router;