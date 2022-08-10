// importing error handlers
const { sendSuccess } = require('../../utils/errorHelper')

// importing service
const { main } = require('../../services/email/service');

const testMail = (req, res) => {
    main();
    return sendSuccess(res, 'Testing...!');
}

module.exports = {
    testMail
}