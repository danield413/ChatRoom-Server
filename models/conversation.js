const { 
    postOnDB, 
    readOfDB, 
    postOnDBChat, 
    readChatOfDB, 
    moreMessages 
} = require('../helpers/dbUtils');
const User = require('./user');


class Conversation {

    constructor() {
        this.historial = [];
        this.users = [];
        this.chatsHistorial = [];

        this.readDB();
    }

    async readDB() {
        const currentMessages = await readOfDB();
        this.historial = currentMessages;
    }

    async readChatDB(id1, id2) {
        const currentChatMessages = await readChatOfDB(id1, id2);
        return currentChatMessages;
    }

    async postMessageOnDB( payload ) {
        await postOnDB(payload);
        await this.readDB();
    }

    async postMessageOfChatOnDB( payload, id1, id2 ) {
        await postOnDBChat( payload, id1, id2 );
        return this.readChatDB(id1, id2);
    }

    async getCountMessages() {
        const resp = await moreMessages();
        return resp;
    }

    async getRegisteredUsers() {
        const allUsers = await User.find({ role: 'USER' }).sort({ name : 1});
        return allUsers;
    }

    get usersArray() {
        return this.users;
    }

    connectUser( id, name, picture ){
        if(picture) {
            this.users.unshift({ id, name, picture });
        } else {
            this.users.unshift({ id, name, picture: null });
        }
    }

    disconnectUser( id ){
        const current = this.users.findIndex( user => user.id === id);
        this.users.splice(current, 1);
    }

}

module.exports = Conversation;