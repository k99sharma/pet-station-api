// importing schema
import Store from '../schemas/SessionStore.js';

class SessionStore {
    getAllSession() {
        this.allSession = Store.find({});
        return this.allSession;
    }

    // method to get session details
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
        Store.findOne({ sessionID })
            .then((session) => {
                console.log(session);
                if (!session) {
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
            })
            .catch(err => {
                console.log('Cannot access session.');
                console.error(err);
            })
    }
}

export default SessionStore;

