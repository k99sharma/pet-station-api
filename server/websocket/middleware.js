/* eslint-disable no-param-reassign */

// importing redis client
import { getRedisClient } from '../configs/redisConnection.js';

// importing helper functions
import { generateRandomID } from '../utilities/helper.js';

// socket middleware
export default function socketMiddleware(io) {
    const redisClient = getRedisClient();   // redis client

    // user session middleware
    io.use(async (socket, next) => {
        const { sessionID, username } = socket.handshake.query;

        // if session ID is present
        if (sessionID) {
            // getting session
            const sessionData = await redisClient.get(sessionID);

            if (sessionData) {
                const parseData = JSON.parse(sessionData);     // parsing data

                // session data
                socket.username = parseData.username;
                socket.userID = parseData.userID;
                socket.sessionID = sessionID;

            } else {
                console.log('Unable to access session data.');
            }

            return next();
        }

        // if there is no session
        const newSessionID = generateRandomID();
        const newUserID = generateRandomID();

        // adding attributes to socket
        socket.sessionID = newSessionID;
        socket.userID = newUserID;
        socket.username = username;

        return next();
    });
}