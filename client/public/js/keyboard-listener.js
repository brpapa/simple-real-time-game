export function createKeyboardListener(document) {
  const state = {
    observersFn: [],
    playerId: null,
  }
  function setPlayerId(id) {
    state.playerId = id
  }
  function subscribe(observerFn) {
    state.observersFn.push(observerFn)
  }
  function notifyAll(command) {
    // console.log(`Notifying ${state.observersFn.length} observers`)
    for (const observerFn of state.observersFn) {
      observerFn(command)
    }
  }

  document.addEventListener('keydown', (event) => {
    const acceptedKeys = {
      ArrowUp: 'up',
      w: 'up',
      W: 'up',
      ArrowRight: 'right',
      d: 'right',
      D: 'right',
      ArrowDown: 'down',
      s: 'down',
      S: 'down',
      ArrowLeft: 'left',
      a: 'left',
      A: 'left',
    }
    let toward = acceptedKeys[event.key]

    if (toward) {
      notifyAll({
        id: state.playerId,
        toward,
      })
    }
  })

  return {
    subscribe,
    setPlayerId,
  }
}
