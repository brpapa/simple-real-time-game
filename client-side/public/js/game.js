export function createGame(document) {
	const state = {
		players: {},
		fruits: {},
		screen: {
			width: null,
			height: null
		}
	}

	function setState(newState) {
		Object.assign(state, newState)
	}

	function addPlayer({ id, x, y, score }) {
		state.players[id] = { x, y, score }
	}
	function removePlayer({ id }) {
		delete state.players[id]
	}
	function addFruit({ id, x, y, color }) {
		state.fruits[id] = { x, y, color }
	}
	function removeFruit({ id }) {
		delete state.fruits[id]
   }
   function updatePlayerScore({ id, newScore }) {
      state.players[id].score = newScore
   }

	function movePlayer(command) {
		let {
			data: { id, keyPressed }
		} = command

		let { width, height } = state.screen
		function up(player) {
			player.y = player.y == 0 ? height - 1 : player.y - 1
		}
		function right(player) {
			player.x = (player.x + 1) % width
		}
		function down(player) {
			player.y = (player.y + 1) % height
		}
		function left(player) {
			player.x = player.x == 0 ? width - 1 : player.x - 1
		}

		const acceptedMoves = {
			ArrowUp: up,
			w: up,
			W: up,
			ArrowRight: right,
			d: right,
			D: right,
			ArrowDown: down,
			s: down,
			S: down,
			ArrowLeft: left,
			a: left,
			A: left
		}

		const player = state.players[id]
		const moveFn = acceptedMoves[keyPressed]

		if (player && moveFn) {
			moveFn(player)
			checkForFruitCollision(id)
		}
	}

	function checkForFruitCollision(playerId) {
		const player = state.players[playerId]

		for (let fruitId in state.fruits) {
			const fruit = state.fruits[fruitId]
			if (fruit.x === player.x && fruit.y === player.y)
				removeFruit({ id: fruitId })
		}
	}

	// métodos acessíveis fora do escopo
	return {
		state, // não é alterável diretamente lá fora, apenas por função
		setState,
		addPlayer,
      addFruit,
      updatePlayerScore,
		removePlayer,
		removeFruit,
		movePlayer
	}
}
