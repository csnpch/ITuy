const db = require('./../../database')
const securify = require('./../../middlewares/security')
const dbDict = require('./../../database/dictonary')

const tableName = dbDict.tableNames.client


const findAll = async (page, limit, yearStd, sectionStd) => {

    const offset = (page - 1) * limit
    const totalCount = await (
        await db.query(`SELECT COUNT(id) AS count FROM ${tableName}`)
    ).rows[0].count
    const totalPage = Math.ceil(totalCount / limit)

    if (!yearStd && !sectionStd) {
        const dataClient = await db.query(`
            SELECT 
                *,
                null AS password
            FROM 
                ${tableName}
            ORDER BY id ASC
            LIMIT ${limit} OFFSET ${offset}
        `)
        
        return {
            clients: dataClient.rows,
            pagination: {
                pageSize: totalPage,
                currentPage: parseInt(page),
                itemPerPage: parseInt(limit),
            },
            countItem: dataClient.rowCount
        }
    }

    if (!sectionStd && yearStd) {
        const dataClient = await db.query(`
            SELECT 
                *,
                null AS password
            FROM 
                client
            WHERE
                SUBSTRING(username, 0, 3) = $1
            ORDER BY id ASC
            LIMIT ${limit} OFFSET ${offset}
        `, [
            yearStd
        ])
        
        return {
            clients: dataClient.rows,
            pagination: {
                pageSize: totalPage,
                currentPage: parseInt(page),
                itemPerPage: parseInt(limit),
            },
            countItem: dataClient.rowCount
        }   

    } else if (yearStd && sectionStd) {
        const dataClient = await db.query(`
            SELECT 
                *,
                null AS password
            FROM 
                client
            WHERE
                SUBSTRING(username, 0, 3) = $1
                AND section = $2
            ORDER BY id ASC
            LIMIT ${limit} OFFSET ${offset}
        `, [
            yearStd,
            sectionStd
        ])
        
        return {
            clients: dataClient.rows,
            pagination: {
                pageSize: totalPage,
                currentPage: parseInt(page),
                itemPerPage: parseInt(limit),
            },
            countItem: dataClient.rowCount
        }

    } else if (!yearStd && sectionStd) {
        const dataClient = await db.query(`
            SELECT 
                *,
                null AS password
            FROM 
                client
            WHERE
                section = $1
            ORDER BY id ASC
            LIMIT ${limit} OFFSET ${offset}
        `, [
            sectionStd
        ])
        
        return {
            clients: dataClient.rows,
            pagination: {
                pageSize: totalPage,
                currentPage: parseInt(page),
                itemPerPage: parseInt(limit),
            },
            countItem: dataClient.rowCount
        }

    }

}


const findById = async (id) => {
    return await db.query(`SELECT * FROM ${tableName} WHERE id=$1 LIMIT 1`, [id])
}


const findByKey = async (key, value) => {
    return await db.query(`SELECT * FROM ${tableName} WHERE ${key}=$1 LIMIT 1`, [value])
}


const findClientByTarget = async (target) => {
    // db.query target is 2 letter front of username
    return await db.query(`
        SELECT 
            *
        FROM 
            ${tableName} 
        WHERE 
            LEFT(username, 2) = $1
    `, [
        target
    ])

}


const createClient = async (body) => {

    let client = await (await findByKey('username', body.username)).rows[0]
    if (client) {
        throw new Error("Username already exits")
    }
    
    const { password_encrypt, salt } = await securify.passwordCreate(body.password)
    return await db.query(`
        INSERT INTO 
            ${tableName} 
            (username, password, salt, fullname, branch, role) 
        VALUES 
            ($1, $2, $3, $4, $5, $6)
    `, [
        body.username, password_encrypt, salt, body.fullname, body.branch, body.role
    ])

}


const setRoleAccount = async (id, role) => {
    return await db.query(`UPDATE ${tableName} SET role = $1 WHERE id = $2 RETURNING *`, [role, id])
}


const setStartedInfo = async (id, nickname, fullname) => {
    
    await db.query(`
        UPDATE ${tableName} 
        SET 
            nickname = $1,
            fullname = $2  
        WHERE 
            id = $3`
        , [
            nickname, fullname, id
        ]
    )
    
    const client = await (await findById(id)).rows[0]
    delete client.salt
    delete client.password

    return client

}


const setBranch = async (id, branch) => {
    return await db.query(`UPDATE ${tableName} SET branch = $1 WHERE id = $2`, [branch, id])
}


module.exports = {
    findAll,
    findById,
    findByKey,
    findClientByTarget,
    createClient,
    setRoleAccount,
    setStartedInfo,
    setBranch
}