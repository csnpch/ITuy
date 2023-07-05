const paymentService = require('./../services/paymentService')
const dataRoles = require('./../../data/dict/roles')
const paymentDict = require('./../../data/dict/payment')
const paymentMethodDict = require('./../../data/dict/payment_method')
const config = require('../../configs')
const ClientServices = require('../services/clientService')
const mailService = require('./../services/emailServices')

const findByRelationKey = async (req, res) => {

    try {

        req.validate()
        // Verify access role
        if ([
            dataRoles.roles.guest.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }

        const result = await paymentService.findByRelationKey(req.params.relation_key)
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: result.rows
        })



    } catch (err) { res.error(err) }

}


const getTotalAmountBudget = async (req, res) => {

    try {

        req.validate()
        // Verify access role
        if ([
            dataRoles.roles.guest.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }

        const totalAmount = await paymentService.getTotalAmountBudget()
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: parseFloat(totalAmount || '0')
        })

    } catch (err) { res.error(err) }

}


const getRealBudget = async (req, res) => {

    try {

        req.validate()
        // Verify access role
        if ([
            dataRoles.roles.guest.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }

        const totalAmount = await paymentService.getRealBudget()
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: parseFloat(totalAmount || '0')
        })

    } catch (err) { res.error(err) }

}


const uploadProofPayment = async (req, res) => {

    try {

        req.validate()
        // Verify access role
        if ([
            dataRoles.roles.guest.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }

        await paymentService.uploadSlip(req.file, req.body)
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ส่งหลักฐานการชำระเงินสำเร็จ',
            data: null
        })
            

    } catch (err) { res.error(err) }

}


const findMyPayment = async (req, res) => {

    try {

        req.validate()
        // Verify access role
        if ([
            dataRoles.roles.guest.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }

        
        const list_my_payment = await paymentService.findMyPayment(req.client.id)
        const sum_my_budget = await paymentService.sumMyBudget(req.client.id)

        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: {
                items: list_my_payment.rows,
                sum: parseFloat(sum_my_budget || '0.0')
            }
        })
        

    } catch (err) { res.error(err) }

}


const getPayments = async (req, res) => {

    try {
        
        req.validate()
        // Verify access role
        if ([
            dataRoles.roles.guest.level,
            dataRoles.roles.member.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }

    
        const result = await (await paymentService.findAll()).rows
        
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: result
        })
    
    } catch (err) { res.error(err) }

}


const findMethodActiveByTarget = async (req, res) => {

    try {

        req.validate()
        // Verify access role
        if ([
            dataRoles.roles.guest.level,
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }

        const result = await (await paymentService.findMethodByTarget(
            req.params.target, 
            paymentMethodDict.primary.status
        )).rows[0]
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: result
        })
    
    } catch (err) { res.error(err) }

}


const findPaymentByClient = async (req, res) => {
    
    try {

        req.validate()

        // Verify access role
        if ([
            dataRoles.roles.guest.level,
            dataRoles.roles.member.level,
            dataRoles.roles.CEOs.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }

        const result = await (
            await paymentService.findPaymentByClientUsernameOrFullnameWithBillID(
                req.params.bill_id,
                req.params.word_search || '',
            )
        ).rows[0]


        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: result
        })

    } catch (err) { res.error(err) }

}


const detectPaymentByClientId = async (req, res) => {

    try {

        req.validate()

        // Verify access role
        if ([
            dataRoles.roles.guest.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }

        const result = await paymentService.findAndDetectPaymentByClientId(
            req.params.client_id
        )

        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ตรวจหารายการชำระเงินสำเร็จ',
            data: result
        })

    } catch (err) { res.error(err) }

}



const acceptPayment = async (req, res) => {

    try {

        req.validate()

        // Verify access role
        if ([
            dataRoles.roles.guest.level,
            dataRoles.roles.member.level,
            dataRoles.roles.CEOs.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }

        await paymentService.updateStatus(
            req.params.id, 
            paymentDict.paid.status
        )

        try {
            const client_id = (await paymentService.findById(req.params.id)).rows[0].client_id
            const client_email = await (await ClientServices.findById(client_id)).rows[0].email
            mailService.sendMail({
                send_to: [client_email],
                subject: `ตรวจสอบการชำระเงินเรียบร้อย #ผ่านชำระ`,
                html: `
                    <h4>สามารถดูรายละเอียดได้ที่แอพพลิเคชั่น ITuy</h4>
                    <h4>สามารถเข้าใช้งานได้ที่ลิ้งนี้: ${config.env.PUBLIC_URL}</h4>
                `
            })
        } catch (err) { console.log(`can't send email in acceptPayment`) }

        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ตรวจสอบการชำระเงินเรียบร้อย #ผ่านชำระ',
            data: null
        })

    } catch (err) { res.error(err) }

}


const rejectPayment = async (req, res) => {
    
    try {

        req.validate()

        // Verify access role
        if ([
            dataRoles.roles.guest.level,
            dataRoles.roles.member.level,
            dataRoles.roles.CEOs.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }
        
        await paymentService.updateStatus(
            req.params.id, 
            paymentDict.callback.status
        )

        
        try {
            const client_id = (await paymentService.findById(req.params.id)).rows[0].client_id
            const client_email = await (await ClientServices.findById(client_id)).rows[0].email
            mailService.sendMail({
                send_to: [client_email],
                subject: `ส่งกลับการชำระเงินเรียบร้อย #ไม่ผ่านชำระ`,
                html: `
                    <h4>โปรดตรวจสอบรายละเอียดได้ที่แอพพลิเคชั่น ITuy</h4>
                    <h4>สามารถเข้าใช้งานได้ที่ลิ้งนี้: ${config.env.PUBLIC_URL}</h4>
                `
            })
        } catch (err) { console.log(`can't send email in rejectPayment`) }

        
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ส่งกลับการชำระเงินเรียบร้อย #ไม่ผ่านชำระ',
            data: null
        })

    } catch (err) { res.error(err) }

}


// Payment method zone
const getMethods = async (req, res) => {

    try {

        // Verify access role
        if ([
            dataRoles.roles.guest.level,
            dataRoles.roles.member.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }


        const result = req.params.id 
            ? await (await paymentService.findMethodById(req.params.id)).rows[0]
            : await (await paymentService.findMethodAll()).rows
        
        if (!result) {
            return res.status(200).json({
                status: false,
                status_tag: 'error',
                message: 'ไม่พบข้อมูลช่องทางชำระเงิน',
                data: result
            })
        }

        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: result
        })


    } catch (err) { res.error(err) }

}


const addMethod = async (req, res) => {

    try {

        req.validate()

        // Verify access role
        if ([
            dataRoles.roles.guest.level,
            dataRoles.roles.member.level,
            dataRoles.roles.CEOs.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }


        const added_id = await (
            await paymentService.createMethod(
                req.client.id,
                req.body
            )
        ).rows[0].id

        const data_method = await (await paymentService.findMethodById(added_id)).rows[0]


        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'เพิ่มช่องทางชำระเงินสำเร็จ',
            data: data_method
        })

    } catch (err) { res.error(err) }

}


const disabledMethod = async (req, res) => {

    try {
        
        // Verify access role
        if ([
            dataRoles.roles.guest.level,
            dataRoles.roles.member.level,
            dataRoles.roles.CEOs.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }


        const result = await paymentService.updateStatusMethod(
            req.params.id, 
            paymentMethodDict.disable.status
        )
        
        if (result === 'not_found_method') {
            return res.status(401).json({
                status: false,
                status_tag: 'error',
                message: 'ไม่พบช่องทางชำระเงินที่ต้องการให้เป็นช่องทางหลัก',
                data: null
            })
        } else if (result === 'cant_disabled_primary_method') {
            return res.status(409).json({ // or status 422 Unprocessable 
                status: false,
                status_tag: 'success',
                message: 'ไม่สามารถปิดใช้งานช่องทางชำระเงินหลักได้',
                data: null
            })    
        }

        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ปิดใช้งานช่องทางชำระเงินสำเร็จ',
            data: null
        })

    } catch (err) { res.error(err) }

}


const setPrimaryMethod = async (req, res) => {

    try {
        
        // Verify access role
        if ([
            dataRoles.roles.guest.level,
            dataRoles.roles.member.level,
            dataRoles.roles.CEOs.level
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }


        const result = await paymentService.updateStatusMethod(
            req.params.id, 
            paymentMethodDict.primary.status
        )
        
        if (result === 'not_found_method') {
            return res.status(401).json({
                status: false,
                status_tag: 'error',
                message: 'ไม่พบช่องทางชำระเงินที่ต้องการให้เป็นช่องทางหลัก',
                data: null
            })
        }

        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ตั้งเป็นช่องทางชำระหลักสำเร็จ',
            data: null
        })

    } catch (err) { res.error(err) }

}


module.exports = {
    getTotalAmountBudget,
    getRealBudget,
    uploadProofPayment,
    getPayments,
    findPaymentByClient,
    findMyPayment,
    findByRelationKey,
    detectPaymentByClientId,
    acceptPayment,
    rejectPayment,
    // Payment method zone
    getMethods,
    findMethodActiveByTarget,
    addMethod,
    disabledMethod,
    setPrimaryMethod
}
