// importing model
const User = require('../models/User');
const LoginDetail = require('../models/LoginDetail');

// importing error handlers
const {
    sendSuccess,
    sendError
} = require('../utils/errorHelper');


// importing status codes
const {
    CONFLICT, NOT_FOUND, BAD_REQUEST, FORBIDDEN
} = require('../utils/statusCodes');


// POST: user login
const userLogin = async (req, res) => {
    // getting request body
    const { email, password, clientMachineInformation } = req.body;

    // check if email is valid
    const user = await User.findOne({ email: email });
    if(!user)
        return sendError(res, 'Invalid email or password', FORBIDDEN);

    // checking if user have login record
    let loginRecord = await LoginDetail.findOne({ userId: user.userId });

    // check if password is valid 
    const isPasswordValid = await user.isValidPassword(password);

    // send error if password is not valid
    if(!isPasswordValid){
        // update failed login record
        if(loginRecord){
            const lastFailedCount = parseInt(loginRecord.lastFailedCount) + 1;
            console.log(lastFailedCount);

            loginRecord = await LoginDetail.findOneAndUpdate(
                { userId: user.userId },
                {
                    lastFailedCount: lastFailedCount,
                    lastFailedLogin: new Date()
                }
            );

        }
        return sendError(res, 'Invalid email or password', FORBIDDEN);
    }

    // if both email and password are valid
    /*
        Update login details of user
    */
    
    // check if user record exists or its first time login
    if(!loginRecord){
        // creating new record
       loginRecord = new LoginDetail({
            userId: user.userId,
            clientMachineInformation: clientMachineInformation
       });

       // save login record
       await loginRecord.save();

       // save this record information in user record
       await User.findOneAndUpdate(
        { userId: user.userId },
        { loginDetails: loginRecord._id }
       );

       console.log('Login record saved!');
    }

    // updating last login 
    loginRecord = await LoginDetail.findOneAndUpdate(
        { userId: user.userId },
        { 
            lastLogin: new Date(),
            lastFailedCount: 0
         }
    )

    // generate auth token 
    // send successful login message and token as header

    const generatedToken = await user.generateAuthToken();

    return sendSuccess(res, 'Login Successful.', generatedToken);
}

// POST: user logout
const userLogout = async (req, res) => {

}

module.exports = {
    userLogin,
    userLogout
}