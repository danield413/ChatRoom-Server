require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Conversation = require('./models/conversation');

const app = express();
app.use(cors({
    origin: process.env.URL,
    credentials: true
}))

app.use( express.static('public') );
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.URL
    }
});

const conversation = new Conversation();

//Routes 
app.get('/api/get-messages', (req, res) => {

    const currentMessages = conversation.historial;

    res.json(currentMessages)
})


io.on('connection', (socket) => {
    const {id, name} = socket.handshake.query;
    conversation.connectUser(id, name)
    io.emit('active-users', conversation.usersArray);


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

server.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto: ${process.env.PORT}`);
})