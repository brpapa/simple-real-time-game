const app = require('express')()
const server = require('http').createServer(app)
const sockets = require('socket.io')(server)

server.listen(3000, () => {
	console.log('Server is running on http://localhost:3000')
})

const createGame = require('./game')
const game = createGame(20, 20)

/* network */

// todas as vezes q uma funcao de game alteram o state, um evento é emitido para todos os clients
game.subscribe(({ event, data }) => {
   // console.log(`Emitting ${event}`)
   sockets.emit(event, data)
})

sockets.on('connect', (socket) => {
	let { id } = socket
	// console.log(`Client connected: ${id}`)

	socket.emit('setup', game.state)
	game.addPlayer({ id })
	game.startFruitGenerate(2500)

	socket.on('disconnect', () => {
		// console.log(`Client disconnected: ${id}`)
		game.removePlayer({ id })
	})

   socket.on('move-player', (data) => {
		game.movePlayer({ id, ...data })

      // para todos os sockets conectados, com excessão do socket.id
		socket.broadcast.emit('update-player', {
			id,
         newPlayerState: game.state.players[id]
      })
	})
})
