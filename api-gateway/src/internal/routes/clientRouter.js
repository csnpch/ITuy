const router = require('express').Router()
const clientController = require('./../controllers/clientController')
const { verifyToken } = require('./../../middlewares/security')
const { check, param/*, query*/ } = require('express-validator');


router.get('/', 
    verifyToken, 
    clientController.getClients
)


router.get('/:id',
    verifyToken, 
    clientController.getClients
)


router.get('/target/:target',
    verifyToken,
    clientController.getByTarget
)


router.post('/', 
    check('username')
        .not().isEmpty().withMessage('is required')
        .isLength({ min: 4, max: 20 }),
    check('password')
        .not().isEmpty().withMessage('is required')
        .isLength({ min: 8 }),
    check('fullname')
        .not().isEmpty().withMessage('is required')
        .isLength({ min: 8 }),
    check('branch')
        .not().isEmpty().withMessage('is required'),
    clientController.createClient
)


router.post('/addStartedInfo',
    verifyToken, 
    check('nickname')
        .not().isEmpty().withMessage('is required'),
    check('fullname')
        .not().isEmpty().withMessage('is required'),
    clientController.addStartedInfo
)


module.exports = router;