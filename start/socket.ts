import Ws from 'App/Services/Ws'
import User from 'App/Models/User'
Ws.boot()

/*
|-------------------------------------------------------
| Socket Routes
|-------------------------------------------------------
*/

Ws.io.on('connection', (socket) => {
  socket.on('join', async (username) => {
    console.log(username)
    const user = await User.findBy('username', username)
    if (user) {
      socket.join(username)
    } else {
      socket.emit('error', 'User not found')
    }
  })
})
