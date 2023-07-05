const app = require('express')()
const func = require('./../utils/helpers/functions')
const { validationResult } = require('express-validator')

const logger = (req, res, next) => {

    if (req.method === 'OPTIONS') {
        return next()
    }
    const now = new Date()
    const timestamp = '| ' 
        + func.addZeroFrontValue(now.getHours().toString(), 2) 
        + ':' + func.addZeroFrontValue(now.getMinutes().toString(), 2)
        + ':' + func.addZeroFrontValue(now.getMilliseconds().toString().slice(0, 2), 2)
    console.log(`${timestamp} | ${res.statusCode} | ${req.method} | ${req.headers.host}${req.url}`)
    next()

}

const middlewares = (req, res, next) => {
    req.validate = function () {

        const errors = validationResult(req).array()
        if (errors.length == 0) return
        let errMsg = ''
        for (let err of errors) {
            errMsg += `${err.param} ${err.msg}, `
        }
        throw new Error(errMsg.slice(0, errMsg.length - 2))

    }
    res.error = function (err, status = 400) {

        let errMsg = err.msg || err.message || 'ERROR?'
        if (errMsg.includes(`relation`)) {
            status = 502
            errMsg = "เกิดข้อผิดพลาด, ไม่สามารถติดต่อกับฐานข้อมูลได้"
        }
        console.log("ERROR : ", err.msg || err.message)
        
        res.status(status).json({ 
            status: false,
            message: errMsg,
            data: null
        })

    }
    next()
}



module.exports = {
    logger,
    middlewares
}