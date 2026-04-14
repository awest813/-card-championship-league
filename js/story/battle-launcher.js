/* global window */

(function () {
	function buildLaunchContext (battleId, overrides = {}) {
		const battle = window.CCLData.battles[battleId];
		const selectedDeckId = overrides.playerDeckId || window.CCLProgressionState.getSelectedDeckId ();

		return {
			battleId: battle.id,
			playerDeckId: selectedDeckId,
			enemyDeckId: overrides.enemyDeckId || battle.enemyDeckId,
			tournamentId: overrides.tournamentId || battle.tournamentId,
			roundId: overrides.roundId || battle.roundId,
			statusTargetId: overrides.statusTargetId || null,
			opponentId: battle.opponentId,
			storyContext: {
				mentor: 'mira',
				rival: battle.opponentId,
				...(overrides.storyContext || {})
			}
		};
	}

	async function startBattleScene (context) {
		if (!window.CardBattleBridge || !window.CardBattleBridge.system) {
			throw new Error ('Battle bridge is not ready yet.');
		}

		return window.CardBattleBridge.startBattle (context.battleId, {
			statusTargetId: context.statusTargetId || null,
			launchContext: context
		});
	}

	window.CCLStoryBattleLauncher = {
		buildLaunchContext,
		startBattleScene
	};
})();
