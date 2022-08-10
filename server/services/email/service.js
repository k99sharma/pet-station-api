// importing modules
const nodemailer = require('nodemailer');

// importing configurations
const {
    EMAIL_ADDRESS,
    EMAIL_PASSWORD
} = require('../../configs/index');

/**
 * Functions to send email.
 * Email can be modified based on provided options.
 * 
 * @param { object } options 
 */
async function emailMain(options) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: EMAIL_ADDRESS, // generated ethereal user
            pass: EMAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Pet Station Org"<petstationOrg@gmail.com>', // sender address
        to: options.mailTo, // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
    });

    console.log(info);
}


// exporting function
module.exports = {
    emailMain
}