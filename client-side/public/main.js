import { createGame } from './js/game.js'
import { createKeyboardListener } from './js/keyboard-listener.js'
import { createScoreboardManager } from './js/scoreboard-manager.js'
import { renderCanvas } from './js/render.js'

const scoreboardManager = createScoreboardManager(document)
const game = createGame(scoreboardManager)
const keyboardListener = createKeyboardListener(document)

function setScreen({ width, height }, id) {
   const screenEl = document.querySelector('#screen')
	screenEl.setAttribute('width', width)
   screenEl.setAttribute('height', height)
   
   const context = screenEl.getContext('2d')
	renderCanvas(
      id,
		game,
      context,
      width,
      height,
		requestAnimationFrame
	)
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

		keyboardListener.setPlayerId(id)
		keyboardListener.subscribe(game.moveCurrPlayer)

		game.setState(state)

		game.subscribe(({ event, data }) => {
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
	'add-fruit': (data) => {
		game.addFruit(data)
	},
	'remove-fruit': (data) => {
		game.removeFruit(data)
	},
	'update-player': (data) => {
		// console.log('Updating other player:', data)
		game.updatePlayer(data)
	}
}

for (event in handlersFn) {
	// console.log(`Receiving ${event}`)
	socket.on(event, handlersFn[event])
}
