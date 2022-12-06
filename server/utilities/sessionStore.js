/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* abstract */
class SessionStore {
    findSession(_id) { }

    saveSession(_id, _session) { }

    findAllSessions() { }
}

class InMemorySessionStore extends SessionStore {
    constructor() {
        super();
        this.sessions = new Map();
    }

    findSession(id) {
        return this.sessions.get(id);
    }

    saveSession(id, session) {
        this.sessions.set(id, session);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }
}

export default InMemorySessionStore;