const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const socket = io()

// Get username and room from url;
const { username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
  outputMessage(message)
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.emit('joinRoom', { username, room })

// Get room and users

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users)
})

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value 

  // Emit message to server
  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus()
})


function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message')
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text"> 
      ${message.text}
    </p>
  `
  document.querySelector('.chat-messages').appendChild(div)
}


function outputRoomName(room) {
  console.log("ROM", room)
  roomName.innerText = room
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}