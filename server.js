const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.static(__dirname + '/public'));
const socket = require('socket.io');

const server = require('http').createServer(app)
const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000/api/v1/videoCall',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
})

const store = {}

try {
    io.on('connection', (socket) => {
        // console.log(socket.id);

        socket.on('join-room', (roomId, user) => {

            console.log('joined', { roomId, user })
            socket.join(roomId)

            store[socket.id] = user
            const room = Array.from(io.sockets.adapter.rooms).find(value => value[0] === roomId)
            // console.log(room)
            if (room) {
                const userOtherInRoom = Array.from(room[1]).filter(socketId => socketId !== socket.id)

                if (userOtherInRoom === 0) socket.emit('other-user', userOtherInRoom, null)
                else socket.emit('other-user', userOtherInRoom, store[userOtherInRoom])
            }

            // socket.broadcast.to(roomId).emit('user-connected', userOtherInRoom, store[socket.id])

            socket.on('disconnect', () => {
                socket.broadcast.to(roomId).emit('user-disconnected', socket.id)
                delete store[socket.id]
            })
        })

        socket.on('sending signal', payload => {
            console.log(store[socket.id])
            io.to(payload.friendId).emit('user joined', { signal: payload.signal, callerId: payload.myId, callerInfo: store[socket.id] })
        })

        socket.on('returning signal', payload => {
            io.to(payload.friendId).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
        })
    });
} catch (error) {

}





const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config();

const morgan = require('morgan')
app.use(morgan('combined'))

const database = require('./database')
database.connectDB()

const routes = require('./routes')
routes(app)

server.listen(process.env.PORT)