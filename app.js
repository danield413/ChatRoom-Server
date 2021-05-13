const express = require('express');
const cors = require('cors');
const Conversation = require('./models/conversation');

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use( express.static('public') );

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const conversation = new Conversation();

io.on('connection', (socket) => {
    const {id, name} = socket.handshake.query;
    conversation.connectUser(id, name)
    io.emit('active-users', conversation.usersArray)


    socket.on('send-message', (payload) => {
        conversation.postMessageOnDB(payload);
        socket.broadcast.emit('receive-messages', conversation.historial);
        io.emit('created-message', conversation.historial)
    })

    socket.on('disconnect', () => {
        conversation.disconnectUser( id );
        io.emit('active-users', conversation.usersArray);
    });


}) 

server.listen( 5000, () => {
    console.log(`Servidor corriendo en puerto: ${5000}`);
})