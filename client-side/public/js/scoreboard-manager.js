export function createScoreboardManager(document) {
	let playersByScore = [] // {id, score}
	const tbodyEl = document.querySelector('#scoreboard tbody')

	function appendTableRow() {
		let trEl = document.createElement('tr')
		let tdPlayer = document.createElement('td')
		tdPlayer.className = 'player'
		let tdScore = document.createElement('td')
		tdScore.className = 'score'
		trEl.appendChild(tdPlayer)
		trEl.appendChild(tdScore)

		tbodyEl.appendChild(trEl)
	}
	function removeTableRow() {
		tbodyEl.removeChild(tbodyEl.firstChild())
	}

	function addPlayer({ id, score }) {
		appendTableRow()
		playersByScore.push({ id, score })
	}
	function removePlayer({ id }) {
		removeTableRow()
		playersByScore = playersByScore.filter((p) => p.id !== id)
	}
	function updatePlayer({ id, score }) {
		const player = playersByScore.find((p) => p.id === id)
		player.score = score

		playersByScore = playersByScore.sort((a, b) => b.score - a.score)
	}

   return {
      playersByScore,
		addPlayer,
		removePlayer,
		updatePlayer
	}
}
