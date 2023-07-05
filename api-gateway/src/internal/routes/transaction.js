const router = require('express').Router()
const tnxController = require('./../controllers/transaction')
const { verifyToken } = require('./../../middlewares/security')
const { check/*, query, param*/ } = require('express-validator');


router.get('/',
    verifyToken,
    tnxController.getAll
)

router.get('/approve',
    verifyToken,
    tnxController.getApproveTnx
)


router.post('/',
    verifyToken,
    check('title').isString(),
    check('link_evidence').isString(),
    check('amount').isNumeric(),
    tnxController.addTnx
)


router.get('/approve/:id',
    verifyToken,
    tnxController.acceptTnx
)


router.get('/reject/:id',
    verifyToken,
    tnxController.rejectTnx
)


module.exports = router;