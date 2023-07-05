const mysql = require('mysql');
const config = require('./index');
const address = {
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'meeting_room_db',
    charset: 'utf8'
};

// Is Production
if (config.isProduction) {
    address.host = 'mysql';
    address.database = 'meeting_room_prod';
}

const connection = mysql.createConnection(address);

module.exports = connection;