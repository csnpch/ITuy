const config = require('../../configs')
const db = require('./../../database')
const dbDict = require('./../../database/dictonary')

const tableSection = dbDict.tableNames.section_dict 
const tableClient = dbDict.tableNames.client 


const findAllSection = async () => {
    return await db.query(`SELECT * FROM ${tableSection} ORDER BY sec_name ASC`)
}


const findYearStd = async () => {

    const dataYearStd = await (await db.query(`
        SELECT 
            DISTINCT SUBSTRING(username, 0, 3)::int AS year 
        FROM 
            client 
        WHERE 
            SUBSTRING(username, 0, 3)::int > (
                SUBSTRING(
                    (
                        EXTRACT('Year' FROM CURRENT_DATE) + 543 
                    )::text , 3, 5
                )::int - ${config.env.YEARS_HISTORICAL_DATA}
            )
        ORDER BY year ASC;
    `)).rows

    let listYearStd = []
    dataYearStd.forEach((item) => {
        listYearStd.push(item.year)
    })
    
    return listYearStd

}



module.exports = {
    findAllSection,
    findYearStd
}