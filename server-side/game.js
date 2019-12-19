module.exports = function createGame(width, height) {
	const state = {
		players: {},
		fruits: {},
		screen: {
			width,
			height
		}
	}

	const observersFn = []
	function subscribe(observerFn) {
		observersFn.push(observerFn)
	}
	function notifyAll(command) {
		// console.log(`Notifying ${observersFn.length} observers`)
		for (const observerFn of observersFn) {
			observerFn(command)
		}
	}

	function addPlayer({ id }) {
		let x = Math.floor(Math.random() * state.screen.width)
		let y = Math.floor(Math.random() * state.screen.height)
		let score = 0

		state.players[id] = { x, y, score }

		notifyAll({
			event: 'add-player',
			data: { id, x, y, score }
		})
	}
	function removePlayer({ id }) {
		delete state.players[id]

		notifyAll({
			event: 'remove-player',
			data: { id }
		})
	}

	function startFruitGenerate(frequency) {
		let { width, height } = state.screen
		setInterval(() => {
			addFruit({
				id: Math.floor(Math.random() * width * height ** 2),
				x: Math.floor(Math.random() * width),
				y: Math.floor(Math.random() * height),
				color: `rgba(${Math.random() * 255}, ${Math.random() *
					255}, 255, 0.125)`
			})
		}, frequency)
	}

	function addFruit({ id, x, y, color }) {
		state.fruits[id] = { x, y, color }

		notifyAll({
			event: 'add-fruit',
			data: { id, x, y, color }
		})
	}
	function removeFruit({ id }) {
		delete state.fruits[id]

		notifyAll({
			event: 'remove-fruit',
			data: { id }
		})
	}

	function updatePlayerScore({ id, newScore }) {
		state.players[id].score = newScore

		notifyAll({
			event: 'update-player-score',
			data: { id, newScore }
		})
	}

	function movePlayer({ id, keyPressed }) {
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

			notifyAll({
				event: 'move-player',
				data: { id, keyPressed }
			})
		}
	}

	function checkForFruitCollision(playerId) {
		const player = state.players[playerId]

      let qty = 0
		for (let fruitId in state.fruits) {
			const fruit = state.fruits[fruitId]
			if (fruit.x === player.x && fruit.y === player.y) {
				removeFruit({ id: fruitId })
				qty++
			}
      }
      if (qty > 0) {
         updatePlayerScore({
            id: playerId,
            newScore: player.score + qty
         })
      }
	}

	// métodos acessíveis fora do escopo
	return {
		startFruitGenerate,
		addPlayer,
		removePlayer,
		movePlayer,
		state, //read-only
		subscribe
	}
}
