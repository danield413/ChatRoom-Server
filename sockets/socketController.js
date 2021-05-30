const { Socket } = require("socket.io");
const Conversation = require("../models/conversation");


const conversation = new Conversation();

const socketController = async( socket = new Socket, io) => {

    const {uid, name} = socket.handshake.query;
    if(uid === 'undefined' || name === 'undefined'){
        socket.disconnect();
        return;
    }
    if(conversation.usersArray.includes({ uid, name })){
        socket.disconnect();
        return;
    }

    conversation.connectUser(uid, name);
    io.emit('active-users', conversation.usersArray);
    socket.emit('receive-messages', conversation.historial);

    socket.on('send-message', async (payload) => {
        await conversation.postMessageOnDB(payload);
        socket.broadcast.emit('receive-messages', conversation.historial);
        io.emit('created-message', conversation.historial);
        const stats = await conversation.getCountMessages();
        io.emit('get-stats', stats );
    });

    socket.on('send-private-message', async (payload) => {
        const to = payload[1].uid;
        const message = payload[0];
        const allChatMessages  = await conversation.postMessageOfChatOnDB(message, uid, to);
        io.emit('private-messages', allChatMessages );
        socket.to( to ).emit('private-messages', allChatMessages);
    });

    const allUsers = await conversation.getRegisteredUsers()
    socket.emit('registered-users', allUsers);

    const stats = await conversation.getCountMessages();
    socket.emit('get-stats', stats );

    socket.on('disconnect', () => {
        conversation.disconnectUser( uid );
        io.emit('active-users', conversation.usersArray);
    });

}

module.exports = {
    socketController
};