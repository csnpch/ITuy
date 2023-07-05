const db = require('./../../database')
const dbDict = require('./../../database/dictonary')
const config = require('./../../configs')



const clearDatabase = async () => {
    for (const tableName in dbDict.tableNames) {
        await db.query(`
            DELETE FROM ${dbDict.tableNames[tableName]}
            WHERE created_at < NOW() - INTERVAL '${config.env.YEARS_HISTORICAL_DATA} years'
        `)
    }
    return true;
}



module.exports = {
    clearDatabase,
}