const { Socket } = require("socket.io");
const Conversation = require("../models/conversation");


const conversation = new Conversation();

const socketController = async( socket = new Socket, io) => {

    const {uid, name} = socket.handshake.query;
    socket.join(uid);
    
    conversation.connectUser(uid, name);
    io.emit('active-users', conversation.usersArray);


    socket.on('send-message', async (payload) => {
        await conversation.postMessageOnDB(payload);
        socket.broadcast.emit('receive-messages', conversation.historial);
        io.emit('created-message', conversation.historial);
    });

    socket.on('send-private-message', async (payload) => {
        const to = payload[1].uid;
        const message = payload[0];
        const allChatMessages  = await conversation.postMessageOfChatOnDB(message, uid, to);
        socket.emit('private-messages', allChatMessages );
        socket.to( to ).emit('private-messages', allChatMessages);
    });

    socket.on('disconnect', () => {
        conversation.disconnectUser( uid );
        io.emit('active-users', conversation.usersArray);
    });
    
}

module.exports = {
    socketController
};