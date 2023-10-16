const express = require('express')
const cors = require('cors')
const fs = require('fs')
const PaymentServices = require('./internal/services/paymentService')

const middlewares = require('./middlewares')
const router = require('./router')
const config = require('./configs')

const app = express()


app.use(express.json())
app.use(middlewares.logger)
app.use(middlewares.middlewares)
app.use(cors({
    origin: config.env.FRONTEND_URL,
    methods: `POST,GET,PUT,DELETE`
}))

app.post('/deleteOldImgs', async (req, res) => {
    try {
        if (req.body?.password_access !== config.env.DB_PASS) {
            return res.status(401).json({ message: 'Unauthorized, `password_access` invalid' })
        }

        const yearLessThan = new Date().getFullYear() - req.body?.year || config.env.YEARS_HISTORICAL_DATA || 5
        const payments = (await PaymentServices.findAll()).rows
        const path = __dirname + '/uploads/images/slip'

        const findPaymentCreateAtLessThan = payments.filter(payment => {
            const year = new Date(payment.created_at).getFullYear()
            return parseInt(year) <= parseInt(yearLessThan)
        })

        const resultDel = await findPaymentCreateAtLessThan.map(payment => {
            const pathDel = path + '/' + payment.img_evidence.split('/').pop()
            return new Promise((resolve, reject) => {
                fs.unlink(`${pathDel}`, err => {
                    if (err) {
                        console.log(err)
                        return reject(err)
                    }
                    return resolve()
                })
            })
        })

        return res.status(200).json({ 
            message: `delete old imgs success dels.length = ${resultDel.length}` 
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.use('/api', router)
app.use(express.static(__dirname + '/uploads'))

app.get('/', (_, res) => res.send('ITuy API-Gateway') )
app.get('*', (_, res) => res.send('API Endpoint not found or invalid') )


module.exports = app
