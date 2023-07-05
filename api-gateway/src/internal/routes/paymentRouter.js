const router = require('express').Router()
const { verifyToken } = require('./../../middlewares/security')
const paymentController = require('../controllers/paymentController')
const { check/*, query, param */} = require('express-validator');
const multer = require('multer');

const epMethod = '/methods'
// Define storage configuration
const storage = multer.diskStorage({
    destination: './src/uploads/images/slip', // Set the destination folder where uploaded files will be stored
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + '.webp';
        cb(null, filename);
    },
});
const upload = multer({ storage });


router.get('/totalAmountBudget', 
    verifyToken,
    paymentController.getTotalAmountBudget
)


router.get('/realBudget',
    verifyToken,
    paymentController.getRealBudget
)


router.get('/',
    verifyToken,
    paymentController.getPayments
)


router.get('/findMyPayment', 
    verifyToken,
    paymentController.findMyPayment
)


router.get('/findByRelationKey/:relation_key',
    verifyToken,
    paymentController.findByRelationKey
)


router.get('/findByClient/:bill_id/:word_search',
    verifyToken,
    paymentController.findPaymentByClient
)


router.get('/detectPaymentByClientId/:client_id',
    verifyToken,
    paymentController.detectPaymentByClientId
)


router.post('/accept/:id',
    verifyToken,
    paymentController.acceptPayment
)


router.post('/reject/:id',
    verifyToken,
    paymentController.rejectPayment
)


// router.post('/uploadProofPayment',
//     verifyToken,
//     paymentController.uploadProofPayment
// )

router.post('/uploadProofPayment', 
    verifyToken,
    upload.single('file'),
    paymentController.uploadProofPayment
)



// Method zone
router.get(`${epMethod}`, 
    verifyToken,
    paymentController.getMethods
)

router.get(`${epMethod}/:id`,
    verifyToken, 
    paymentController.getMethods
)

router.get(`${epMethod}/findMethodActiveByTarget/:target`,
    verifyToken,
    paymentController.findMethodActiveByTarget
)

router.post(`${epMethod}/disabled/:id`,
    verifyToken, 
    paymentController.disabledMethod
)


router.post(`${epMethod}/setPrimary/:id`,
    verifyToken, 
    paymentController.setPrimaryMethod
)


router.post(`${epMethod}`,
    verifyToken,
    check('target')
        .not().isEmpty().withMessage('is required'),
    check('promptpay')
        .not().isEmpty().withMessage('is required'),
    check('method_identity')
        .not().isEmpty().withMessage('is required'),
    paymentController.addMethod
)


module.exports = router;