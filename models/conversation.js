const fs = require('fs');
const { postOnDB, readOfDB, postOnDBChat, readChatOfDB, moreMessages } = require('../helpers/dbUtils');


class Conversation {

    historial = [];
    users = [];
    chatsHistorial = [];
    
    constructor() {
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

    get usersArray() {
        return this.users;
    }

    connectUser( id, name ){
        this.users.unshift({ id, name});
    }

    disconnectUser( id ){
        const current = this.users.findIndex( user => user.id === id);
        this.users.splice(current, 1);
    }

}

module.exports = Conversation;