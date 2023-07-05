const router = require('express').Router();
const { authenticated, isInRoles } = require('../configs/security');

// Account route
router.use('/account', require('./account'));
// Equipment route
router.use('/equipment', authenticated, isInRoles(['admin']), require('./equipment'));
// Room route
router.use('/room', authenticated, isInRoles(['admin']), require('./room'));
// Booking route
router.use('/booking', authenticated, require('./booking'));

module.exports = router;