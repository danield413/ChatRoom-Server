const express = require('express');
const cors = require('cors');
const { socketController } = require('../sockets/socketController');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.server = require('http').createServer( this.app );
        this.io = require('socket.io')(this.server, {
            cors: {
                origin: 'http://localhost:3000' || 'https://room-chat-dan.herokuapp.com',
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        this.paths = {
            auth: '/api/auth/',
            messages: '/api/messages/',
        }

        //Conectar a la base de datos
        this.db();

        //Middlewares
        this.middlewares();

        //Lectura y parseo del body
        this.app.use( express.json() );

        this.routes();

        this.sockets();
    }

    async db() {
        await dbConnection();
    }

    middlewares() {
        
        //CORS
        this.app.use( cors({
            origin: process.env.URL,
            credentials: true
        }));

        //Directorio público
        this.app.use( express.static('public') );

    }

    routes() {
        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.messages, require('../routes/messages') );

        this.app.get('/*', function(req, res) {
            res.sendFile(path.join(__dirname, '/public/index.html'), function(err) {
                if (err) {
                res.status(500).send(err)
                }
            })
        })
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io))
    }

    listen() {
        
        this.server.listen( this.port, () => {
            console.log('Servidor corriento en puerto', this.port);
        });

    }

}

module.exports = Server;