const router = require('express').Router()


router.use('/database', require('./internal/routes/databaseRouter'))
router.use('/auth', require('./internal/routes/authRouter'))
router.use('/client', require('./internal/routes/clientRouter'))
router.use('/collegian', require('./internal/routes/collegianRouter'))
router.use('/payment', require('./internal/routes/paymentRouter'))
router.use('/bill', require('./internal/routes/billRouter'))
router.use('/transaction', require('./internal/routes/transaction'))

module.exports = router;