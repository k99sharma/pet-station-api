// importing error handlers
const { sendSuccess } = require('../../utils/errorHelper')

// importing service
const { emailMain } = require('../../services/email/service');

// options for email function
const options = {
    mailTo: undefined,
    subject: undefined,
    text: undefined
};

const testMail = (req, res) => {
    options.mailTo = 'kalash.strt@gmail.com';
    options.subject = 'Test Mail';
    options.text = 'Just a test mail';

    emailMain(options);
    return sendSuccess(res, 'Testing...!');
}

module.exports = {
    testMail
}