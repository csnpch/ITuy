const router = require('express').Router()
const collegianController = require('./../controllers/collegianController')
// const { verifyToken } = require('./../../middlewares/security')
// const { check/*, query, param*/ } = require('express-validator');


router.get('/yearStd',
    collegianController.getYearStd
)

router.get('/section',
    collegianController.getSection
)


module.exports = router;