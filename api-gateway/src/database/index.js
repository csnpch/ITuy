const { Pool, Client } = require('pg')
const config = require('./../configs')

const pool = new Pool({
    user: config.env.DB_USER,
    host: config.env.DB_HOST,
    database: config.env.DB_NAME,
    password: config.env.DB_PASS,
    port: config.env.DB_PORT,
})
pool.query('SELECT NOW()').then(() => console.log('Database Connected'))


module.exports = pool