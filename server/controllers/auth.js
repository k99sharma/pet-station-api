// importing model
const User = require('../models/User');
const LoginDetail = require('../models/LoginDetail');

// importing error handlers
const {
    sendSuccess,
    sendError
} = require('../utils/errorHelper');

// creating redis client
const { getClient } = require('../configs/redisConnection');
const client = getClient();


// importing status codes
const {
    SERVER_ERROR,
    FORBIDDEN
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

    // adding value in redis cache
    await client.set(generatedToken, 'true');
    client.expire(generatedToken, 60*60*24*7);  // setting token expiration

    return sendSuccess(res, 'Login Successful.', generatedToken);
}

// GET: token extend i.e send new token
const extendToken = async (req, res) => {
    const userId = req.user.userId;

    // get user 
    const user = await User.findOne({ userId: userId });

    // generate new token
    const generatedToken = await user.generateAuthToken();

    // adding value in redis cache
    await client.set(generatedToken, 'true');
    client.expire(generatedToken, 60*60*24*7);  // setting token expiration

    return sendSuccess(res, 'Token extended.', generatedToken);
}

// POST: user logout
const userLogout = async (req, res) => {
    const token = req.params.token;

    // delete token from redis
    await client.del(token, (err, res)=>{
        if(err){
            console.log(err);
            return sendError(res, 'Logout failed!', SERVER_ERROR);
        }
    });

    return sendSuccess(res, 'Logout successful.');
}

module.exports = {
    userLogin,
    userLogout,
    extendToken
}