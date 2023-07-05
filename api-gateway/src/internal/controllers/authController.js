const authService = require('./../services/authService')
const clientService = require('./../services/clientService')
const dataRoles = require('./../../data/dict/roles')
const mailService = require('../services/emailServices')
const config = require('../../configs')

const authenSignIn = async (req, res) => {

    try {

        req.validate()

        const body = req.body
        const result = await authService.verifySignIn(body.username, body.password)
        
        if (result === 'not_found_client') {
            return res.status(401).json({
                status: false,
                status_tag: 'error',
                message: 'ไม่พบผู้ใช้ในระบบ',
                data: null
            })
        } else if (result === 'client_pass_invalid') {
            return res.status(401).json({
                status: false,
                status_tag: 'error',
                message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
                data: null
            })
        } else if (result === 'account_not_allow') {
            return res.status(401).json({
                status: false,
                status_tag: 'warning',
                message: 'ไม่สามารถเข้าสู่ระบบได้, โปรดรอการอนุมัติบัญชีภายใน 3-5 วัน',
                data: null
            })
        }
        
        delete result.password
        delete result.salt
        return res.status(201).json({
            status: true,
            status_tag: 'success',
            message: 'เข้าสู่ระบบสำเร็จ',
            data: result
        })

    } catch (err) { res.error(err) }

}


const requestAccount = async (req, res) => {

    try {

        req.validate()
       
        const result = await authService.createRequestAccount(
            req.body.username,
            req.body.section
        )
        if (result === 'username_already') {
            return res.status(200).json({
                status: true,
                status_tag: 'warning',
                message: 'คุณได้ส่งคำขอเปิดใช้งานบัญชีนี้ไปแล้ว, โปรดรอ',
                data: null
            })
        }

        return res.status(201).json({
            status: true,
            status_tag: 'success',
            message: 'ส่งคำขอเปิดใช้งานบัญชีสำเร็จ',
            data: null
        })

    } catch (err) { res.error(err) }

}


const acceptAccount = async (req, res) => {
    try {
        
        req.validate()
       
        const role = req.client.role // data from verify token in session    
        if (!dataRoles.levels.filter(item => 
            item !== dataRoles.roles.guest.level
            && item !== dataRoles.roles.member.level
        ).includes(role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({
                status: false,
                status_tag: 'warning',
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้',
                data: null
            })
        }

        const resultUpdateRole = (await clientService.setRoleAccount(req.body.id, 0)).rows[0] // 0 member
        await clientService.setBranch(req.body.id, req.body.branch || null)
        
        try {
            mailService.sendMail({
                send_to: [resultUpdateRole.email],
                subject: `บัญชีของคุณได้รับการอนุมัติให้เข้าใช้งานระบบแล้ว`,
                html: `
                    <h2>บัญชีของคุณได้รับการอนุมัติให้เข้าใช้งานระบบแล้ว</h2>
                    <br />
                    <h3>ชื่อผู้ใช้และรหัสผ่านของคุณสำหรับเข้าใช้งานระบบ</h5>
                    <p>USER: ${resultUpdateRole.username}</p>
                    <p>PASS: ${resultUpdateRole.username}</p>
                    <br />
                    <h2>สามารถเข้าใช้งานได้ที่ลิ้งนี้: ${config.env.PUBLIC_URL}</h2>
                `
            })
        } catch (err) { console.log(`can't send email in acceptAccount`) }

        
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'อนุมัติผู้ใช้สำเร็จ',
            data: null
        })      
        
    } catch (err) { res.error(err) }

}


const verifyAuth = async (req, res) => {
    try {

        const dataClient = await (await clientService.findById(req.client.id)).rows[0]
        delete dataClient.password
        delete dataClient.salt

        res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'You are verified :)',
            data: dataClient
        })

    } catch (err) { res.error(err) }
}


module.exports = {
    authenSignIn,
    requestAccount,
    acceptAccount,
    verifyAuth
}
