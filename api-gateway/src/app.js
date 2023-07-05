const express = require('express')
const cors = require('cors')

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
app.use('/api', router)
app.use(express.static(__dirname + '/uploads'))

app.get('/', (_, res) => res.send('ITuy API-Gateway') )
app.get('*', (_, res) => res.send('API Endpoint not found or invalid') )


module.exports = app
