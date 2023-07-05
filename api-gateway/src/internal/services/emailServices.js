require('dotenv').config()
const nodemailer = require('nodemailer')
const config = require('../../configs')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    }
})


// let mailOptions = 
const createMailOptions = (to, subject, html = ``) => {
    return {
        from: process.env.MAIL_USERNAME,
        to: to,
        subject: subject,
        html: html
    }
}


const sendMail = ({
    subject = '', 
    html = '', 
    send_to = []
}) => {
    
    send_to.forEach((to) => {
    
        try {
            const mailOptions = createMailOptions(to, subject, html)
            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Email sent: ' + data.response)
                }
            })
        } catch (err) {
            console.log(err)
        }
        
    })

}






module.exports = {
    sendMail,
}