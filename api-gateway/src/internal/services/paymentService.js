const db = require('./../../database')
const dbDict = require('./../../database/dictonary')
const paymentMethodDict = require('./../../data/dict/payment_method')

const paymentDict = require('./../../data/dict/payment')
const billDict = require('./../../data/dict/bill')
const tnxDict = require('./../../data/dict/transaction')
const uploadDict = require('./../../data/dict/upload')

const clientService = require('./clientService')
const billService = require('./billService')
const mailService = require('./emailServices')
const config = require('../../configs')

const tableBill = dbDict.tableNames.bill
const tablePayment = dbDict.tableNames.payment
const tablePaymentMethod = dbDict.tableNames.payment_method
const tableClient = dbDict.tableNames.client
const tableTnx = dbDict.tableNames.transaction


const uploadSlip = async (file, body) => {

    const checkHaveOldSlipThenDelete = async (payment_id) => {
        try {
            const payment = await (await findById(payment_id)).rows[0]
            const fs = require('fs')
            const path = require('path')
            const pathFile = `${payment.img_evidence}`
            // const pathFile = path.join(__dirname, `${uploadDict.slip}${payment.img_evidence}`)
            console.log('pathFileUpload', pathFile)
            fs.unlink(pathFile, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        } catch (_) { }
    }


    let paymentIDs = JSON.parse(body.paymentIDs)
    if (typeof paymentIDs === 'string') {
        paymentIDs = [paymentIDs]
    }

    // update status payment to paid and add file name to img_evidence if paymentIDs length > 1 random relation key and add to relation_key in table
    if (paymentIDs.length > 1) {
        const relation_key = Date.now() + '-' + Math.round(Math.random() * 1E9)
        paymentIDs.forEach(async (payment_id) => {
            await checkHaveOldSlipThenDelete(payment_id)
            await db.query(`
                UPDATE
                    ${tablePayment}
                SET
                    status = $1,
                    img_evidence = $2,
                    relation_key = $3,
                    updated_at = NOW()
                WHERE
                    id = $4
            `, [
                paymentDict.hold_check.status,
                `${uploadDict.slip.path}${file.filename}`,
                relation_key,
                payment_id
            ])
        })
    } else {
        await checkHaveOldSlipThenDelete(paymentIDs[0])
        await db.query(`
            UPDATE 
                ${tablePayment} 
            SET 
                status = $1, 
                img_evidence = $2,
                updated_at = NOW()
            WHERE 
                id = $3
        `, [
            paymentDict.hold_check.status,
            `${uploadDict.slip.path}${file.filename}`,
            paymentIDs[0]
        ])
    }

}


const getRealBudget = async () => {

    const totalPaymentsPaid = await getTotalAmountBudget()
    const totalTnxPaid = await (
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

    return totalPaymentsPaid - totalTnxPaid

}


const getTotalAmountBudget = async () => {

    return (
        await db.query(`
            SELECT
                SUM(${tableBill}.amount) AS total_amount
            FROM
                ${tablePayment}
            LEFT JOIN
                ${tableBill} ON
                ${tablePayment}.bill_id = ${tableBill}.id
            WHERE
                ${tablePayment}.status = $1
        `, [
            paymentDict.paid.status
        ])
    ).rows[0].total_amount || 0

}


const findByImgEvidence = async (img_evidence) => {
    return await db.query(`SELECT * FROM ${tablePayment} WHERE img_evidence = $1`, [img_evidence])
}


const findAll = async () => {
    return await db.query(`SELECT * FROM ${tablePayment} ORDER BY updated_at ASC`)
}


const findById = async (id) => {
    return await db.query(`SELECT * FROM ${tablePayment} WHERE id = $1`, [id])
}


const findByRelationKey = async (relation_key) => {
    return await db.query(`
        SELECT 
            *,
            ${tablePayment}.id AS payment_id,
            ${tableBill}.id AS bill_id,
            ${tablePayment}.status AS status_payment,
            ${tableBill}.status AS status_bill
        FROM 
            ${tablePayment} 
        LEFT JOIN
            ${tableBill} ON
            ${tablePayment}.bill_id = ${tableBill}.id
        WHERE 
            relation_key = $1
        `, [
        relation_key
    ])
}


const paymentFindRelationByBillId = async (bill_id, yearStd = null, sectionStd = null) => {
    
    const paid = await countPaymentStatus(bill_id, paymentDict.paid.status, yearStd, sectionStd)
    const hold = await countPaymentStatus(bill_id, paymentDict.hold.status, yearStd, sectionStd)
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
        callback: {
            data: callback.rows,
            count: callback.rowCount
        },
        totalCount: paid.rowCount + hold.rowCount + callback.rowCount 
    }
}


const findPaymentByClientId = async (client_id, exceptStatus = []) => {

    const dataPayment = await db.query(`
        SELECT
            *
        FROM
            ${tablePayment}
        LEFT JOIN
            ${tableBill} ON
            ${tableBill}.id = ${tablePayment}.bill_id
        WHERE
            ${tablePayment}.client_id = $1
    `, [
        client_id
    ])

    if (exceptStatus.length > 0) {
        return {
            ...dataPayment,
            rows: dataPayment.rows.filter(payment => !exceptStatus.includes(payment.status))
        }
    }

    return dataPayment

}



const sumMyBudget= async (client_id) => {

    const dataPayment = await db.query(`
        SELECT
            SUM(${tableBill}.amount) AS total_amount
        FROM
            ${tablePayment}
        LEFT JOIN
            ${tableBill} ON
            ${tablePayment}.bill_id = ${tableBill}.id
        WHERE
            ${tablePayment}.client_id = $1
            AND ${tablePayment}.status = $2
    `, [
        client_id,
        paymentDict.paid.status
    ])

    return dataPayment.rows[0].total_amount || 0

}


const findMyPayment = async (client_id, exceptStatus = []) => {

    const dataPayment = await db.query(`
        SELECT
            *,
            ${tablePayment}.created_at AS created_at_payment,
            ${tablePayment}.updated_at AS updated_at_payment,
            ${tablePayment}.status AS status_payment,
            ${tableBill}.status AS status_bill,
            ${tablePayment}.id AS payment_id
        FROM
            ${tablePayment}
        LEFT JOIN
            ${tableBill} ON
            ${tablePayment}.bill_id = ${tableBill}.id
        WHERE
            ${tablePayment}.client_id = $1
            AND ${tableBill}.status = $2
    `, [
        client_id,
        billDict.appove.status
    ])

    if (exceptStatus.length > 0) {
        return {
            ...dataPayment,
            rows: dataPayment.rows.filter(payment => !exceptStatus.includes(payment.status))
        }
    }

    return dataPayment

}


const findPaymentByClientIdAndBillId = async (client_id, bill_id, exceptStatus = []) => {
    
    const dataPayment = await db.query(`
        SELECT
            *
        FROM
            ${tablePayment}
        WHERE
            client_id = $1
            AND bill_id = $2
    `, [
        client_id,
        bill_id
    ])

    if (exceptStatus.length > 0) {
        return {
            ...dataPayment,
            rows: dataPayment.rows.filter(payment => !exceptStatus.includes(payment.status))
        }
    }

    return dataPayment

}


const addPayment = async (client_id, bill_id) => {
    // check payment already exist
    const payment = await (await findPaymentByClientIdAndBillId(client_id, bill_id)).rows[0]
    if (payment) return payment

    return db.query(`
        INSERT INTO
            ${tablePayment}
            (client_id, bill_id)
        VALUES
            ($1, $2)
        RETURNING *
    `, [
        client_id, 
        bill_id
    ])
}


const findAndDetectPaymentByClientId = async (client_id) => {

    const client = await (await clientService.findById(client_id)).rows[0]
    if (!client || !client.username || client.username.length < 3) return null

    // find from target
    const list_bill = await billService.findBillByTarget(
        client.username.substring(0, 2),
        [
            billDict.cancel.status,
            billDict.hold.status,
            billDict.close.status
        ]
    )
    
    // if client not have bill in target add payment bill to client
    list_bill.forEach(async (bill) => {
        const payments = await findPaymentByClientIdAndBillId(
            client_id, 
            bill.id,
            [
                paymentDict.paid.status,
            ]
        )
        if (payments.rowCount === 0) {
            await addPayment(client_id, bill.id)  
        }
    })

    return (await findPaymentByClientId(client_id)).rows

}


const updateStatus = async (id, status) => {

    const payment = await (await findById(id)).rows[0]
    const relationPayment = await (await findByRelationKey(payment.relation_key)).rows

    if (relationPayment.length > 0) {
        relationPayment.forEach(async (item) => {
            await db.query(`UPDATE ${tablePayment} SET status = $1 WHERE id = $2`, [status, item.payment_id])
        })
        return
    }

    return await db.query(`
        UPDATE
            ${tablePayment}
        SET
            status = $2
        WHERE
            id = $1
        RETURNING *
    `, [id, status])
}


const addPaymentToClientByTarget = async (bill_id, target) => {

    const listClient = await( await clientService.findClientByTarget(target) ).rows

    listClient.forEach((client) => {

        try {
            db.query(`
                INSERT INTO
                    ${tablePayment}
                    (client_id, bill_id)
                VALUES
                    ($1, $2)
            `, [
                client.id, 
                bill_id
            ])
            // คุณได้รับบิลใหม่
            mailService.sendMail({
                send_to: [client.email],
                subject: `คุณได้รับบิลใหม่`,
                html: `
                    <h4>โปรดตรวจสอบรายการชำระเงินในแอพพลิเคชั่น ITuy</h4>
                    <h5>สามารถเข้าใช้งานได้ที่ลิ้งนี้: ${config.env.PUBLIC_URL}</h5>
                `
            })
        } catch (_) { }

    })

}

// Payment Method zone
const findMethodAll = async () => {
    return await db.query(`
        SELECT 
            ${tablePaymentMethod}.*, 
            ${tableClient}.fullname AS owner_name 
        FROM 
            ${tablePaymentMethod}
        LEFT JOIN 
            ${tableClient} 
            ON ${tablePaymentMethod}.client_id = ${tableClient}.id
        ORDER BY 
            ${tablePaymentMethod}.updated_at DESC
    `)
}


const findMethodById = async (id) => {
    return await db.query(`
        SELECT 
            ${tablePaymentMethod}.*, 
            ${tableClient}.fullname AS owner_name 
        FROM 
            ${tablePaymentMethod}
        LEFT JOIN 
            ${tableClient} 
            ON ${tablePaymentMethod}.client_id = ${tableClient}.id
        WHERE 
            ${tablePaymentMethod}.id = $1
    `, [id])
}


const findMethodByTarget = async (target, status) => {
    return await db.query(`
        SELECT
            ${tablePaymentMethod}.*,
            ${tableClient}.fullname AS owner_name,
            ${tableClient}.role AS owner_role
        FROM
            ${tablePaymentMethod}
        LEFT JOIN
            ${tableClient} ON
            ${tablePaymentMethod}.client_id = ${tableClient}.id
        WHERE
            target = $1
            AND status = $2
    `, [target, status])
}


const createMethod = async (client_id, body) => {

    const countPrimaryMethodInTarget = await (
        await db.query(`
            SELECT 
                id 
            FROM
                ${tablePaymentMethod}
            WHERE
                target = $1 AND status = $2
        `, [ 
            body.target, 
            paymentMethodDict.primary.status 
        ])
    ).rowCount
    
    let statusInsert = countPrimaryMethodInTarget > 0 
        ? paymentMethodDict.active.status
        : paymentMethodDict.primary.status

    return await db.query(`
        INSERT INTO 
            ${tablePaymentMethod}
            (client_id, target, method_identity, reserve_identity, promptpay, status)
        VALUES
            ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `, [
        client_id,
        body.target,
        body.method_identity,
        body.reserve_identity || null,
        body.promptpay,
        statusInsert
    ])
}


const updateStatusMethod = async (id, status) => {
    const findMethod = await (
        await db.query(`
            SELECT 
                target
            FROM 
                ${tablePaymentMethod}
            WHERE
                id = $1
        `, [id])
    ).rows[0]

    
    if (!findMethod) {
        return 'not_found_method'
    }


    if (status === 1) {
        await db.query(`
            UPDATE ${tablePaymentMethod}
            SET 
                status = $1,
                updated_at = 'NOW()'
            WHERE 
                status != $2 AND target = $3
        `, [
            null, 
            paymentMethodDict.disable.status, 
            findMethod.target
        ])
    }

    if (status === -1) {
        const currentMethod = await (
            await db.query(`
                SELECT 
                    status
                FROM 
                    ${tablePaymentMethod}
                WHERE
                    id = $1
            `, [ id ])
        ).rows[0]
            
        if (currentMethod) {
            if (currentMethod.status === 1) {
                return 'cant_disabled_primary_method'
            }
        }
        
    }

    return await db.query(`
        UPDATE 
            ${tablePaymentMethod}
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
const findPaymentByClientUsernameOrFullnameWithBillID = async (bill_id, word) => {
    return await db.query(`
        SELECT
            ${tableClient}.*,
            ${tableBill}.*,
            ${tablePayment}.*,
            null as password
        FROM
            ${tablePayment}
        LEFT JOIN
            ${tableBill} ON
            ${tableBill}.id = $1
        LEFT JOIN
            ${tableClient} ON
            ${tableClient}.id = ${tablePayment}.client_id
        WHERE
            ${tableClient}.username LIKE $2
            OR ${tableClient}.fullname LIKE $2
    `, [
        bill_id,
        `%${word}%`
    ])
}


// If fix this function, please fix function countPaymentStatus in paymentService too.
const countPaymentStatus = async (bill_id, status, yearStd = null, sectionStd = null) => {
    const tmpQueryVar2 = (status === null ? 'IS NULL' : '= $2')
    const listValue = (status === null ? [bill_id] : [bill_id, status])

    const commandConditionYearStd = (!yearStd ? `` : `AND LEFT(${tableClient}.username, 2) = '${yearStd}'`)
    const commandConditionSectionStd = (!sectionStd ? `` : `AND ${tableClient}.section = '${sectionStd}'`)

    return await db.query(`
        SELECT
            *,
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




module.exports = {
    findAll,
    findById,
    findByRelationKey,
    findPaymentByClientId,
    findMyPayment,
    findByImgEvidence,
    getTotalAmountBudget,
    getRealBudget,
    sumMyBudget,
    findPaymentByClientUsernameOrFullnameWithBillID,
    updateStatus,
    findAndDetectPaymentByClientId,
    addPaymentToClientByTarget,
    paymentFindRelationByBillId,
    uploadSlip,
    // Payment Method zone
    findMethodAll,
    findMethodById,
    findMethodByTarget,
    createMethod,
    updateStatusMethod
}