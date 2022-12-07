// importing schema
import Store from '../schemas/SessionStore.js';

class SessionStore {
    // method to get all sessions
    getAllSession() {
        this.allSessions = Store.find({});
        return this.allSessions;
    }

    // method to get session
    getSession(sessionID) {
        this.session = Store.findOne({ sessionID });
        return this.session;
    }

    // method to set session
    saveSession(sessionID, sessionData) {
        /*
         * When we store new session at the time of disconnection
         * set connected key to false
         * update it   
         */

        this.session = Store.findOne({ sessionID });
        if (!this.session) {
            // new session is created for user
            this.newSession = new Store({
                sessionID,
                ...sessionData
            });

            this.newSession.save()
                .then(() => {
                    console.log('New session is created for the user.');
                })
                .catch(err => {
                    console.log('New session cannot be created for user.');
                    console.error(err);
                })
        }
    }
}

export default SessionStore;
