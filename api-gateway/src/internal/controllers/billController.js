const billService = require('./../services/billService')
const paymentService = require('./../services/paymentService')
const dataRoles = require('././../../data/dict/roles')
const bill_status = require('./../../data/dict/bill')


const getBills = async (req, res) => {

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

        const { 
            page = 1, 
            limit = 5, 
            yearStd = null,
            sectionStd = null
        } = req.query;

        const result = req.params.id 
            ? await (await billService.findById(
                req.params.id,
                yearStd === 'all' ? null : yearStd,
                sectionStd === 'all' ? null : sectionStd
            ))
            : await (await billService.findAll(
                page, 
                limit, 
                yearStd === 'all' ? null : yearStd,
                sectionStd === 'all' ? null : sectionStd
            ))

        if (!result) {
            return res.status(200).json({
                status: false,
                status_tag: 'error',
                message: 'ไม่พบข้อมูลข้อมูลบิลเรียกเก็บเงิน',
                data: null,
                pagination: null
            })
        }
        
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: result.bills || result,
            pagination: result.pagination || null
        })
    
    } catch (err) { res.error(err) }

}


const getBillsByTarget = async (req, res) => {

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

        
        const result = await (await billService.findBillByTarget(req.params.target))
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: result
        })

    } catch (err) { res.error(err) }

}


const addBill = async (req, res) => {

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

        const bill = await (
            await billService.addBill(req.client.id, req.body)
        ).rows[0]
        
        const result = await (
            await billService.findById(bill.id)
        )

        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'สร้างใบเรียกเก็บเงินสำเร็จ',
            data: result
        })

    } catch (err) { res.error(err) }

}


const closeBill = async (req, res) => {

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

        const { id } = req.params
        const result = await (
            await billService.changeStatusBill(id, bill_status.close.status)
        ).rows[0]

        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ปิดบิลสำเร็จ',
            data: result
        })

    } catch (err) { res.error(err) }

}


const cancelBill = async (req, res) => {
    
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

        const { id } = req.params
        const result = await billService.changeStatusBill(id, bill_status.cancel.status)

        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ยกเลิกบิลสำเร็จ',
            data: result
        })

    } catch (err) { res.error(err) }

}


const approveBill = async (req, res) => {
    
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

        
        const { id } = req.params
        const result = await (
            await billService.changeStatusBill(id, bill_status.appove.status)
        ).rows[0]

        
        // If work it ok, but if not work we have service detect bill on client get in website
        try {
            const bill = await billService.findById(id)
            const targetBill = JSON.parse(bill.target.replaceAll("{", '[').replaceAll("}", ']')) || []
            targetBill.forEach(target => {
                try {
                    paymentService.addPaymentToClientByTarget(bill.id, target)
                } catch (_) { }
            });

        } catch (_) { }


        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'อนุมัติบิลสำเร็จ',
            data: result
        })


    } catch (err) { res.error(err) }

}



module.exports = {
    getBills,
    getBillsByTarget,
    addBill,
    closeBill,
    cancelBill,
    approveBill
}
