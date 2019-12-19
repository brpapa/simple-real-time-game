const colors = {
	enemy: '#21233B',
	you: '#010'
}

export function renderScreen(screenEl, game, requestAnimationFrame, currId) {
   const context = screenEl.getContext('2d')
	context.clearRect(0, 0, screenEl.width, screenEl.height)

	const { players, fruits } = game.state
	for (let id in fruits) {
		let { x, y, color } = fruits[id]
		context.fillStyle = color
		context.fillRect(x, y, 1, 1)
	}
	for (let id in players) {
		let { x, y } = players[id]
		context.fillStyle = colors.enemy
		context.fillRect(x, y, 1, 1)
	}

	const currPlayer = players[currId]
	if (currPlayer) {
		context.fillStyle = colors.you
		context.fillRect(currPlayer.x, currPlayer.y, 1, 1)
	}

	requestAnimationFrame(() => {
		renderScreen(screenEl, game, requestAnimationFrame, currId)
	})
}
