const colors = {
	otherPlayer: '#999',
	currPlayer: '#000'
}

export function renderCanvas(
	currId,
	game,
   context,
   width,
   height,
	requestAnimationFrame
) {
	context.clearRect(0, 0, width, height)

	const { players, fruits } = game.state
	for (let id in fruits) {
		let { x, y, color } = fruits[id]
		context.fillStyle = color
		context.fillRect(x, y, 1, 1)
	}
	for (let id in players) {
		let { x, y } = players[id]
		context.fillStyle = colors.otherPlayer
		context.fillRect(x, y, 1, 1)
	}

	const currPlayer = players[currId]
	if (currPlayer) {
		context.fillStyle = colors.currPlayer
		context.fillRect(currPlayer.x, currPlayer.y, 1, 1)
	}

	requestAnimationFrame(() => {
		renderCanvas(
			currId,
			game,
         context,
         width,
         height,
			requestAnimationFrame
		)
	})
}
