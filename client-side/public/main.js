import { createGame } from './js/game.js'
import { createKeyboardListener } from './js/keyboard-listener.js'
import { renderScreen } from './js/render.js'

const game = createGame(document)
const keyboardListener = createKeyboardListener(document)

function setScreen({ width, height }, id) {
	const screenEl = document.querySelector('#screen')
	screenEl.setAttribute('width', width)
	screenEl.setAttribute('height', height)
	renderScreen(screenEl, game, requestAnimationFrame, id)
}

/* network */

const socket = io('http://localhost:3000')

const handlersFn = {
	connect: () => {
		// console.log('Connected to the server:', socket.id)
	},
	reconnect: () => {
		// se a conexao cai e o socket se reconectar (sem recarregar a página), setup é re-executado e observers são duplicados
	},
	setup: (state) => {
		let { id } = socket
		setScreen(state.screen, id)

		game.setState(state)
		keyboardListener.setPlayerId(id)

		keyboardListener.subscribe(game.movePlayer)
		keyboardListener.subscribe(({ event, data }) => {
			delete data.id // segurança: usuário pode enviar outro id, mas o server já consegue saber pelo socket

			// console.log('Emitting move-player:', data)
			socket.emit(event, data)
		})
	},
	'add-player': (data) => {
      game.addPlayer(data)
	},
	'remove-player': (data) => {
		game.removePlayer(data)
	},
	'move-player': (data) => {
		if (data.id !== socket.id) {
			game.movePlayer({ data })
		}
	},
	'add-fruit': (data) => {
		game.addFruit(data)
	},
	'remove-fruit': (data) => {
		game.removeFruit(data)
   },
   'update-player-score': (data) => {
      game.updatePlayerScore(data)
   }
}

for (event in handlersFn) {
	// console.log(`Receiving ${event}`)
	socket.on(event, handlersFn[event])
}
