const router = require('express').Router()
const authController = require('./../controllers/authController')
const { verifyToken } = require('./../../middlewares/security')
const { check/*, query, param*/ } = require('express-validator');



router.post('/',
    verifyToken,
    authController.verifyAuth
)


router.post('/signIn',
    check('username').not().isEmpty().withMessage('is required'),
    check('password').not().isEmpty().withMessage('is required'),
    authController.authenSignIn
)


router.post('/changePassword',
    verifyToken,
    check('old_password').not().isEmpty().withMessage('is required'),
    check('new_password').not().isEmpty().withMessage('is required'),
    authController.changePassword
)


router.post('/forceChangePassword',
    verifyToken,
    check('username').not().isEmpty().withMessage('is required'),
    check('new_password').not().isEmpty().withMessage('is required'),
    authController.forceChangePassword
)


router.post('/requestAccount',
    check('username')
        .not().isEmpty().withMessage('is required')
        .isLength({ min: 4, max: 20 }),
    authController.requestAccount
)


router.post('/acceptAccount', verifyToken,
    verifyToken,
    check('id').not().isEmpty().withMessage('is required'),
    authController.acceptAccount
)


module.exports = router;