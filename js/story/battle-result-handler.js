/* global window */

(function () {
	function continueStory (result) {
		if (!result || !result.nextScene) {
			return false;
		}

		const engine = window.monogatari;

		try {
			if (engine && typeof engine.run === 'function') {
				engine.run (`jump ${result.nextScene}`);
				return true;
			}

			if (engine && typeof engine.jump === 'function') {
				engine.jump (result.nextScene);
				return true;
			}
		} catch (error) {
			return false;
		}

		return false;
	}

	function applyAndContinue (result) {
		window.CCLProgressionState.applyBattleResult (result);
		return continueStory (result);
	}

	window.CCLBattleResultHandler = {
		continueStory,
		applyAndContinue
	};
})();
