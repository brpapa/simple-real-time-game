export function createKeyboardListener(document) {
	const state = {
		observersFn: [],
		playerId: null
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

	document.addEventListener('keydown', (e) => {
      notifyAll({
         event: 'move-player',
         data: {
            id: state.playerId,
            keyPressed: e.key
         }
		})
	})

	return {
		state,
		subscribe,
		setPlayerId
	}
}
