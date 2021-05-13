const fs = require('fs');


class Conversation {

    historial = [];
    dbPath= './database/data.json';
    users = [];
    
    constructor() {
        this.readDB();
    }


    postMessageOnDB( payload ) {
        this.readDB();
        this.historial.push( payload );
        this.saveDB();
    }

    saveDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify( payload ));
    }

    readDB() {
        if( !fs.existsSync(this.dbPath) ) return;

        const info = fs.readFileSync(this.dbPath, {
            encoding: 'utf-8'
        });
        const data = JSON.parse(info);
        this.historial = data.historial;
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