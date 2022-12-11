/* eslint-disable class-methods-use-this */
// importing schema 
import Message from "../schemas/Message.js";

class MessageStore {
    getAllUnseenMessages(userID) {
        // get all messages unseen by user
        const allUnseenMessages = Message.find({
            to: userID,
            seen: false
        });

        return allUnseenMessages;
    }

    markMessageSeen(userID) {
        // updating seen attribute of message of all unseen messages by sender
        Message.updateMany({
            to: userID,
            seen: false
        }, {
            $set: { seen: true }
        })
            .then(() => {
                console.log('Updated status.');
            })
            .catch(err => {
                console.error('Cannot update seen status.');
                console.log(err);
            })
    }

    saveMessage(data) {
        // create new message
        this.message = new Message({ ...data });

        this.message.save()
            .then(() => {
                console.log('Message is saved.');
            })
            .catch(err => {
                console.log('Message cannot be saved.');
                console.error(err);
            })
    }
}

export default MessageStore;