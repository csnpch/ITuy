const router = require('express').Router()
const { verifyToken } = require('./../../middlewares/security')
const billController = require('../controllers/billController')
const { check/*, query, param */} = require('express-validator');


router.get('/',
    verifyToken,
    billController.getBills
)


router.get(`/:id`, 
    verifyToken,
    billController.getBills
)


router.get('/target/:target',
    verifyToken,
    billController.getBillsByTarget
)



router.post('/',
    verifyToken,
    check('target')
        .not().isEmpty().withMessage('is required'),
    check('title')
        .not().isEmpty().withMessage('is required'),
    check('amount')
        .not().isEmpty().withMessage('is required'),
    check('deadline')
        .not().isEmpty().withMessage('is required'),
    billController.addBill
)


router.get('/closeBill/:id',
    verifyToken,
    billController.closeBill
)


router.get('/cancelBill/:id',
    verifyToken,
    billController.cancelBill
)


router.get('/approveBill/:id',
    verifyToken,
    billController.approveBill
)


module.exports = router;