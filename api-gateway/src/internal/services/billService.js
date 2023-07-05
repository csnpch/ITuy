const bill = require('../../data/dict/bill')
const db = require('./../../database')
const dbDict = require('./../../database/dictonary')
const paymentDict = require('./../../data/dict/payment')

const tableBill = dbDict.tableNames.bill 
const tableClient = dbDict.tableNames.client
const tablePayment = dbDict.tableNames.payment


const findAll = async (page = 1, limit = 5, yearStd = null, sectionStd = null) => {
    const offset = (page - 1) * limit
    const totalCount = await (
        await db.query(`SELECT COUNT(id) AS count FROM ${tableBill}`)
    ).rows[0].count
    const totalPage = Math.ceil(totalCount / limit)
    
    const dataBill = await (
        await db.query(`
            SELECT 
                ${tableBill}.*, 
                ${tableClient}.fullname AS owner_name
            FROM 
                ${tableBill}
            LEFT JOIN 
                ${tableClient} 
                ON ${tableBill}.client_id = ${tableClient}.id
            LEFT JOIN
                ${tablePayment}
                ON ${tableBill}.id = ${tablePayment}.bill_id
            GROUP BY
                ${tableBill}.id, ${tableClient}.fullname
            ORDER BY
                ${tableBill}.status DESC,
                ${tableBill}.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `)
    ).rows

    for (let i = 0; i < dataBill.length; i++) {
        const relation = await billFindRelationByBillId(dataBill[i].id, yearStd, sectionStd)
        dataBill[i].recipient = relation
    }

    return {
        bills: dataBill,
        pagination: {
            pageSize: totalPage,
            currentPage: parseInt(page),
            itemPerPage: parseInt(limit),
        }
    }
}


const findById = async (id, yearStd = null, sectionStd = null) => {
    const dataBill = await (
        await db.query(`
            SELECT 
                ${tableBill}.*, 
                ${tableClient}.fullname AS owner_name
            FROM 
                ${tableBill}
            LEFT JOIN 
                ${tableClient} 
                ON ${tableBill}.client_id = ${tableClient}.id
            LEFT JOIN
                ${tablePayment}
                ON ${tableBill}.id = ${tablePayment}.bill_id
            WHERE
                ${tableBill}.id = $1
            GROUP BY
                ${tableBill}.id, ${tableClient}.fullname
            ORDER BY
                ${tableBill}.status DESC,
                ${tableBill}.created_at DESC
        `, [id])
    ).rows[0]

    const relation = await billFindRelationByBillId(dataBill.id, yearStd, sectionStd)
    dataBill.recipient = relation

    return dataBill
}


const findBillByTarget = async (target, exceptStatus = []) => {

    // wrap target in an array if it's not already an array
    if (!Array.isArray(target)) {
        target = [target];
    }

    // target of bill is varchar array i need where target = $1
    
    const dataBill =  await (
        await db.query(`
            SELECT
                *
            FROM
                ${tableBill}
            WHERE
                $1 = ANY(string_to_array(target, ','))
        `, [
            target
        ])
    ).rows

    if (exceptStatus.length > 0) {
        return dataBill.filter(bill => !exceptStatus.includes(bill.status))
    }

    return dataBill

}


const addBill = async (client_id, body) => {
    return await db.query(`
        INSERT INTO
            ${tableBill}
            (client_id, target, title, description, amount, deadline)
        VALUES
            ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `, [
        client_id,
        body.target, 
        body.title, 
        body.description || null, 
        body.amount, 
        body.deadline
    ])
}


const changeStatusBill = async (id, status) => {

    if (status === bill.cancel.status) {
        const currentBill = await findById(id)
        if (currentBill.status === bill.hold.status) {
            return await db.query(`
                UPDATE 
                    ${tableBill}
                SET 
                    title = $1,
                    status = $2,
                    updated_at = 'NOW()'
                WHERE 
                    id = $3
            `, [
                `(ไม่อนุมัติ) ${currentBill.title}`, 
                bill.cancel.status, 
                id
            ])
        }
    }

    return await db.query(`
        UPDATE 
            ${tableBill}
        SET 
            status = $1,
            updated_at = 'NOW()'
        WHERE 
            id = $2
    `, [
        status, id
    ])

}

// Duplicate zone
// If fix this function, please fix function countPaymentStatus in paymentService too.
const countPaymentStatus = async (bill_id, status, yearStd = null, sectionStd = null) => {
    const tmpQueryVar2 = (status === null ? 'IS NULL' : '= $2')
    const listValue = (status === null ? [bill_id] : [bill_id, status])

    const commandConditionYearStd = (!yearStd ? `` : `AND LEFT(${tableClient}.username, 2) = '${yearStd}'`)
    const commandConditionSectionStd = (!sectionStd ? `` : `AND ${tableClient}.section = '${sectionStd}'`)

    return await db.query(`
        SELECT
            *,
            ${tablePayment}.updated_at as updated_at_payment, 
            null as password
        FROM
            ${tableClient}
        LEFT JOIN
            ${tablePayment} ON
            ${tablePayment}.client_id = ${tableClient}.id 
            ${commandConditionYearStd}
            ${commandConditionSectionStd}
        WHERE
            ${tablePayment}.client_id = ${tableClient}.id 
            AND ${tablePayment}.bill_id = $1 
            AND ${tablePayment}.status ${tmpQueryVar2}
    `, listValue)
}


// If fix this function, please fix function paymentFindRelationByBillId in paymentService too.
const billFindRelationByBillId = async (bill_id, yearStd = null, sectionStd = null) => {
    
    const paid = await countPaymentStatus(bill_id, paymentDict.paid.status, yearStd, sectionStd)
    const hold = await countPaymentStatus(bill_id, paymentDict.hold.status, yearStd, sectionStd)
    const hold_check = await countPaymentStatus(bill_id, paymentDict.hold_check.status, yearStd, sectionStd)
    const callback = await countPaymentStatus(bill_id, paymentDict.callback.status, yearStd, sectionStd)

    return {
        paid: {
            data: paid.rows,
            count: paid.rowCount
        },
        hold: {
            data: hold.rows,
            count: hold.rowCount
        },
        hold_check: {
            data: hold_check.rows,
            count: hold_check.rowCount
        },
        callback: {
            data: callback.rows,
            count: callback.rowCount
        },
        totalCount: paid.rowCount + hold.rowCount + callback.rowCount 
    }
}



module.exports = {
    findAll,
    findById,
    findBillByTarget,
    addBill,
    changeStatusBill
}