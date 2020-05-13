export function createGame(scoreboardManager) {
  const state = {
    players: {}, // id: {x, y, score}
    fruits: {}, // id: {x, y, color}
    screen: {
      width: null,
      height: null,
    },
  }

  const observersFn = []
  function subscribe(observerFn) {
    observersFn.push(observerFn)
  }
  function notifyAll(command) {
    for (const observerFn of observersFn) {
      observerFn(command)
    }
  }

  function setState(newState) {
    state = { ...newState } // atribuição por valor
    for (let playerId in state.players) {
      scoreboardManager.addPlayer({
        id: playerId,
        score: state.players[playerId].score,
      })
    }
  }

  function updatePlayer({ id, newPlayerState }) {
    if (newPlayerState.score !== state.players[id].score) {
      scoreboardManager.updatePlayer({
        id,
        score: newPlayerState.score,
      })
    }
    Object.assign(state.players[id], newPlayerState)
  }

  function addPlayer({ id, x, y, score }) {
    state.players[id] = { x, y, score }
    scoreboardManager.addPlayer({
      id,
      score,
    })
  }
  function removePlayer({ id }) {
    delete state.players[id]
    scoreboardManager.removePlayer({ id })
  }
  function addFruit({ id, x, y, color }) {
    state.fruits[id] = { x, y, color }
  }
  function removeFruit({ id }) {
    delete state.fruits[id]
  }

  function moveCurrPlayer({ id, toward }) {
    // atualiza state do player atual e avisa ao server para onde moveu-se

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
      },
    }

    const player = state.players[id]
    const moveFn = acceptedMoves[toward]

    if (player && moveFn) {
      moveFn(player)
      checkForFruitCollision(id)

      notifyAll({
        event: 'move-player',
        data: {
          // por segurança o id não é enviado (usuário pode manipular), pois server já consegue saber pelo socket
          toward,
        },
      })
    }
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId]

    for (let fruitId in state.fruits) {
      const fruit = state.fruits[fruitId]
      if (fruit.x === player.x && fruit.y === player.y) {
        removeFruit({ id: fruitId })
        updatePlayer({
          id: playerId,
          newPlayerState: {
            score: player.score + 1,
          },
        })
      }
    }
  }

  // métodos acessíveis fora do escopo
  return {
    state, // não é alterável diretamente lá fora, apenas por função
    setState,
    addPlayer,
    addFruit,
    updatePlayer,
    removePlayer,
    removeFruit,
    moveCurrPlayer,
    subscribe,
  }
}
