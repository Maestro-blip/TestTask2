const express = require('express');
const router = express.Router();
const eventController = require('../controller/event.js')
const authMiddleware = require('../middleware/auth.js')
router.post('/',authMiddleware.checkToken,eventController.create)
router.get('/',eventController.read)
router.get('/:id',eventController.readByID)

router.delete('/:id',authMiddleware.checkToken,eventController.delete)
/*
router.post('/:id/register')
router.get('/:id/participants')
router.get('/registrations/me')
*/



module.exports = router;