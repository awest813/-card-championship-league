/* global window */

(function () {
	function chooseAction (system, sideId) {
		const actions = system.listAIOptions (sideId);

		if (!actions.length) {
			return { type: 'end-turn', reason: 'No legal actions' };
		}

		let best = actions[0];

		actions.forEach ((action) => {
			if (action.score > best.score) {
				best = action;
			}
		});

		return best;
	}

	window.CCLBattleAI = {
		chooseAction
	};
})();
