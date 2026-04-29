const mailer = require('nodemailer')

const sendEmail = (options) => {
    const transporter = mailer.createTransport({
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        auth : {
            user : process.env.SMTP_USER,
            pass : process.env.SMPTP_PASSWORD
        }
    })

    const emailOptions = {
        from : `Book My Stay Support<support@bookmystay.com>`,
        to : options.email,
        subject : options.subject,
        text : options.message
    }

    transporter.sendMail(emailOptions)
}

module.exports = sendEmail