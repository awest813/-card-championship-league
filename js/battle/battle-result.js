/* global window */

(function () {
	function build (system, winner) {
		const battle = window.CCLData.battles[system.state.battleId];
		const victory = winner === 'player';
		const side = system.side (winner);
		const rewards = victory ? battle.rewards.victory : battle.rewards.defeat;
		const storyFlags = victory ? battle.storyFlags.victory : battle.storyFlags.defeat;

		return {
			status: 'completed',
			winner,
			battleId: battle.id,
			opponentId: battle.opponentId,
			pointsEarned: side.points,
			score: {
				playerPoints: system.side ('player').points,
				enemyPoints: system.side ('enemy').points
			},
			rewards: {
				credits: rewards.credits || 0,
				cards: (rewards.cards || []).slice (),
				packs: (rewards.packs || []).slice (),
				items: (rewards.items || []).slice ()
			},
			unlocks: victory ? ['rook_rematch'] : [],
			storyFlags: storyFlags.slice (),
			nextScene: victory ? battle.victoryScene : battle.defeatScene,
			rematchAvailable: Boolean (victory),
			tournamentUpdate: {
				tournamentId: battle.tournamentId,
				roundCleared: battle.roundId,
				nextRoundId: victory ? 'result_branch' : battle.roundId,
				eliminated: !victory,
				champion: false
			},
			affinityChanges: {
				rook: victory ? -1 : 1,
				mira: victory ? 1 : 1
			},
			stats: {
				turns: system.state.turn,
				playerKOs: system.state.stats.playerKOs,
				enemyKOs: system.state.stats.enemyKOs,
				supportsPlayed: system.state.stats.supportsPlayed,
				statusesApplied: system.state.stats.statusesApplied
			},
			launchContext: system.state.launchContext
		};
	}

	window.CCLBattleResult = {
		build
	};
})();
