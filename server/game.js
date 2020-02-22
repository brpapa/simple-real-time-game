module.exports = function createGame(width, height) {
	const state = {
		players: {}, // id: {x, y, score}
		fruits: {}, // id: {x, y, color}
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
		let h = 0

		setInterval(() => {
			addFruit({
				id: Math.floor(Math.random() * width * height ** 2),
				x: Math.floor(Math.random() * width),
				y: Math.floor(Math.random() * height),
				// color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.175)`
				color: `hsla(${h++ % 360}deg, 100%, 70%, 0.5)`
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

	function movePlayer({ id, toward }) {
		// atualiza state do player (x, y e score)

		let { width, height } = state.screen
		const acceptedMoves = {
			up: (player) => {
				player.y = player.y == 0 ? height - 1 : player.y - 1
			},
			right: (player) => {
				player.x = (player.x + 1) % width
			},
			down: (player) => {
				player.y = (player.y + 1) % height
			},
			left: (player) => {
				player.x = player.x == 0 ? width - 1 : player.x - 1
			}
		}

		const player = state.players[id]
		const moveFn = acceptedMoves[toward]

		if (player && moveFn) {
			moveFn(player)

			let qty = countFruitCollision(player)
			player.score += qty
		}
	}

	function countFruitCollision(playerState) {
		let qty = 0

		for (let fruitId in state.fruits) {
			const fruit = state.fruits[fruitId]
			if (fruit.x === playerState.x && fruit.y === playerState.y) {
				removeFruit({ id: fruitId })
				qty++
			}
		}

		return qty
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
