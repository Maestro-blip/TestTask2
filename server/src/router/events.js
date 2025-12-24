const express = require('express');
const router = express.Router();


router.post('/')
router.get('/')
router.get('/:id')
router.delete('/:id')

router.post('/:id/register')
router.get('/:id/participants')
router.get('/registrations/me')




module.exports = router;