// importing modules
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'petstationorg@gmail.com', // generated ethereal user
            pass: 'fbjjjsldawxwpwwz', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Pet Station Org"<petstationOrg@gmail.com>', // sender address
        to: "kalash.strt@gmail.com", // list of receivers
        subject: "Test ✔", // Subject line
        text: "Welcome to pet station", // plain text body
    });

    console.log("Message sent: %s", info.messageId);
}


module.exports = {
    main
}