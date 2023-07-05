const { Pool, Client } = require('pg')
const config = require('./../configs')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_ituy',
    password: 'csnp332211',
    port: 5432
})
pool.query('SELECT NOW()').then(() => console.log('Database Connected'))


module.exports = pool