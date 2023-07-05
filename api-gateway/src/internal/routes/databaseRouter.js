const router = require('express').Router()
const databaseController = require('../controllers/databaseController')
// const { check/*, query, param*/ } = require('express-validator');


router.get('/clear',
    databaseController.clearDatabase
)

module.exports = router;