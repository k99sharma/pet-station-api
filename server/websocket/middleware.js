/* eslint-disable no-param-reassign */

// importing helper functions
import { generateSameID } from '../utilities/helper.js';


// importing session store
import SessionStore from './sessionStore.js';

// socket middleware
export default function socketMiddleware(io) {
    const sessionStore = new SessionStore();

    io.sessionStore = sessionStore;

    // user session middleware
    io.use(async (socket, next) => {
        const { sessionID, username } = socket.handshake.query;

        // if session ID is present
        if (sessionID) {
            // getting session
            const sessionData = await sessionStore.getSession(sessionID);

            if (sessionData) {
                // session data
                socket.username = sessionData.username;
                socket.userID = sessionData.userID;
                socket.sessionID = sessionID;
            } else {
                console.log('Unable to access session data.');
            }

            return next();
        }

        // if there is no session
        const newSessionID = generateSameID(username);
        const newUserID = generateSameID(username);

        // adding attributes to socket
        socket.sessionID = newSessionID;
        socket.userID = newUserID;
        socket.username = username;

        return next();
    });
}