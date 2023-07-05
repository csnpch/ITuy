const transactionService = require('../services/transaction')
const tnxDict = require('../../data/dict/transaction')

const getAll = async (req, res) => {
    try {

        req.validate()

        const { page, limit } = req.query

        const result = await transactionService.findAll(page, limit)
        res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: result
        })

    } catch (err) { res.error(err) }
}


const getApproveTnx = async (req, res) => {

    try {

        req.validate()

        const { page, limit } = req.query

        const result = await transactionService.findApproveTnx(page, limit)
        res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: result
        })

    } catch (err) { res.error(err) }

}


const addTnx = async (req, res) => {

    try {

        req.validate()

        const { body } = req

        const result = await transactionService.createTnx(req.client.id, body)
        res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'เพิ่มธุรกรรมสำเร็จ',
            data: result
        })

    } catch (err) { res.error(err) }

}


const acceptTnx = async (req, res) => {

    try {

        req.validate()

        await transactionService.changeStatusTnx(
            req.params.id,
            tnxDict.appove.status,
        )
        res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'อนุมัติงบประมาณสำเร็จ',
            data: null
        })

    } catch (err) { res.error(err) }

}


const rejectTnx = async (req, res) => {

    try {

        req.validate()

        await transactionService.changeStatusTnx(
            req.params.id,
            tnxDict.disapproval.status,
        )
        res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ไม่อนุมัติงบประมาณสำเร็จ',
            data: null
        })

    } catch (err) { res.error(err) }

}


module.exports = {
    getAll,
    getApproveTnx,
    addTnx,
    acceptTnx,
    rejectTnx
}
