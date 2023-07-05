const db = require('./../../database')
const dbDict = require('./../../database/dictonary')
const tnxDict = require('../../data/dict/transaction')

const tableTnx = dbDict.tableNames.transaction
const tableClient = dbDict.tableNames.client



const findAll = async (page = 1, limit = 5) => {
    const offset = (page - 1) * limit
    const totalCount = await (
        await db.query(`SELECT COUNT(id) AS count FROM ${tableTnx}`)
    ).rows[0].count
    const totalPage = Math.ceil(totalCount / limit)
    
    const dataTnxAll = await (
        await db.query(`
            SELECT 
                *,
                ${tableClient}.fullname AS owner_name,
                ${tableTnx}.id AS tnx_id,
                ${tableTnx}.created_at AS tnx_created_at
            FROM
                ${tableTnx}
            LEFT JOIN
                ${tableClient}
                ON ${tableClient}.id = ${tableTnx}.client_id
            ORDER BY
                ${tableTnx}.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `)
    ).rows

    const totalAmount = await (
        await db.query(`
            SELECT 
                SUM(amount) AS total 
            FROM 
                ${tableTnx}
            WHERE
                status = $1
        `, [
            tnxDict.appove.status
        ])
    ).rows[0].total

    return {
        transactions: dataTnxAll,
        pagination: {
            pageSize: totalPage,
            currentPage: parseInt(page),
            itemPerPage: parseInt(limit),
        },
        totalAmount: parseFloat(totalAmount || '0')
    }
}

const findApproveTnx = async (page = 1, limit = 5) => {

    const offset = (page - 1) * limit
    const totalCount = await (
        await db.query(`SELECT COUNT(id) AS count FROM ${tableTnx} WHERE status = $1`, [
            tnxDict.appove.status
        ])
    ).rows[0].count
    const totalPage = Math.ceil(totalCount / limit)

    const dataTnxAppove = await (
        await db.query(`
            SELECT 
                *,
                ${tableClient}.fullname AS owner_name,
                ${tableTnx}.id AS tnx_id,
                ${tableTnx}.created_at AS tnx_created_at
            FROM
                ${tableTnx}
            LEFT JOIN
                ${tableClient}
                ON ${tableClient}.id = ${tableTnx}.client_id
            WHERE
                ${tableTnx}.status = $1
            ORDER BY
                ${tableTnx}.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `, [
            tnxDict.appove.status
        ])
    ).rows

    const totalAmount = await (
        await db.query(`
            SELECT
                SUM(amount) AS total
            FROM
                ${tableTnx}
            WHERE
                ${tableTnx}.status = $1
        `, [
            tnxDict.appove.status
        ])
    ).rows[0].total

    return {
        transactions: dataTnxAppove,
        pagination: {
            pageSize: totalPage,
            currentPage: parseInt(page),
            itemPerPage: parseInt(limit),
        },
        totalAmount: parseFloat(totalAmount || '0')
    }

}


const createTnx = async (client_id, body) => {

    console.log('client_id', client_id)
    console.log('body', body)

    return await (
        await db.query(`
            INSERT INTO ${tableTnx} (
                client_id,
                title,
                description,
                amount,
                link_evidence
            ) VALUES (
                $1, $2, $3, $4, $5
            ) RETURNING *
        `, [
            client_id,
            body.title,
            body.description || null,
            body.amount,
            body.link_evidence || null
        ])
    ).rows[0]

}


const changeStatusTnx = async (id, status) => {

    if (status === tnxDict.disapproval.status) {
        const tnx = await (
            await db.query(`SELECT * FROM ${tableTnx} WHERE id = $1`, [id])
        ).rows[0]

        return await (
            await db.query(`
                UPDATE 
                    ${tableTnx} 
                SET
                    status = $1,
                    title = $2
                WHERE
                    id = $3
                RETURNING *
            `, [
                status,
                '(ไม่อนุมัติ) ' + tnx.title,
                id
            ])
        ).rows[0]
    }

    return await (
        await db.query(`
            UPDATE 
                ${tableTnx} 
            SET
                status = $1
            WHERE
                id = $2
            RETURNING *
        `, [
            status,
            id
        ])
    ).rows[0]

}


module.exports = {
    findAll,
    findApproveTnx,
    createTnx,
    changeStatusTnx
}