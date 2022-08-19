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
 * @return { object } { error, msg }
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

    // TODO: wtf to do with rejected requests -> info.rejected

    // if email cannot be sent
    if(info.rejected.length != 0)
        return {
            error: true,
            msg: 'Request not complete.'
        }

    return {
        error: false,
        msg: 'Request complete.'
    }
}

/**
 * Function to send case specific emails.
 * Different Templates are used based on different cases.
 * 
 * case 1: login
 * case 2: logout
 * case 3: email Verification v1.2
 * case 4: password reset v1.2
 * case 5: signup
 * 
 * @params { String, Object } case number, userData
 * @returns { Object } result
 */
async function emailService(caseId, userData){
    const options = {};

    // TODO: need to complete all the cases
    if(caseId === 'login'){
        options.mailTo = userData.email;
        options.subject = 'User logged in.',
        options.text = 'Pet station log in.'
    }
    else if(caseId === 'logout'){
        options.mailTo = userData.email;
        options.subject = 'User logout.';
        options.text = 'Pet Station logout.';
    }
    else if(caseId === 'signup'){
        options.mailTo = userData.email;
        options.subject = 'Pet Station signup';
        options.text = 'Pet Station signup';
    }

    // send email
    const res = await emailMain(options);

    if(res.error)
        return {
            error: true,
            msg: 'Email is not sent.'
        }

    return {
        error: false,
        msg: 'Email is sent.'
    }
}

// exporting function
module.exports = {
    emailMain,
    emailService
}