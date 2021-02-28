const express = require("express")
const app = express()
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, getRoomUsers, userLeave} = require("./utils/users")
// SET STATIC FOLDERR

const server = http.createServer(app)

const io = socketio(server)
app.use(express.static(path.join(__dirname, 'public')))

const PORT = 3000 || process.env.PORT
const botName = "ChatCord Bot"
io.on("connection", (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room)
      socket.join(user.room)
    
      //Welcome current usser
      socket.emit('message', formatMessage(botName, "Welcome to chat!!"))

      // Broadcast when a user connects
      socket
        .broadcast
        .to(user.room)
      .emit('message', formatMessage(botName, `A ${username} has joined the chat`)); //Notifica todo mundo exceto o usario conectado
    
      // Send users and room info
      io.to(user.room).emit('roomUsers', { 
        room: user.room,
        users: getRoomUsers(user.room)
      })
  })

  // Runs when client disconecct

  socket.on('disconnect', () => {
    const user = userLeave(socket.id)
    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `A ${user.username} has left the chat...`))
        // Send users and room info
        io.to(user.room).emit('roomUsers', { 
          room: user.room,
          users: getRoomUsers(user.room)
        })
    }
  })

  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message',formatMessage(user.username, msg))
  })

})

server.listen(PORT, () => {
  console.log("SERVER WORKS ::: ", PORT )
})