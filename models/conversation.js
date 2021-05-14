const fs = require('fs');
const { postOnDB, readOfDB } = require('../helpers/dbUtils');


class Conversation {

    historial = [];
    users = [];
    
    constructor() {
        this.readDB();
    }


    async postMessageOnDB( payload ) {
        await postOnDB(payload);
        await this.readDB();
    }

    async readDB() {
        const currentMessages = await readOfDB();
        this.historial = currentMessages;
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