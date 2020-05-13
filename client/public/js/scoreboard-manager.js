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
    tbodyEl.removeChild(document.querySelector('#scoreboard tbody tr'))
  }
  function renderTable() {
    const playerEls = document.querySelectorAll('#scoreboard .player')
    const scoreEls = document.querySelectorAll('#scoreboard .score')

    for (let i = 0; i < playersByScore.length; i++) {
      playerEls[i].innerHTML = playersByScore[i].id.slice(0, 10) + '...'
      scoreEls[i].innerHTML = playersByScore[i].score
    }
  }

  function addPlayer({ id, score }) {
    appendTableRow()
    playersByScore.push({ id, score })

    renderTable()
  }
  function removePlayer({ id }) {
    removeTableRow()
    playersByScore = playersByScore.filter((p) => p.id !== id)

    renderTable()
  }
  function updatePlayer({ id, score }) {
    const player = playersByScore.find((p) => p.id === id)
    player.score = score

    playersByScore = playersByScore.sort((a, b) => b.score - a.score)

    renderTable()
  }

  return {
    addPlayer,
    removePlayer,
    updatePlayer,
  }
}
