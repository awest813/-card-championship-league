'use strict';
/* global Monogatari */
/* global monogatari */
/* global CCLBattleSystem */

const { $_ready } = Monogatari;

/**
 * CardBattleBridge
 * The interface between the narrative (Monogatari / TournamentEngine)
 * and the CCLBattleSystem instance.
 **/
window.CardBattleBridge = {
	system: null,
	lastResult: null,

	/**
	 * startBattle
	 * Launches a tactical duel overlay.
	 **/
	async startBattle (battleIdOrContext, options = {}) {
		if (!this.system) {
			throw new Error ('Battle system is not ready yet.');
		}

		const context = typeof battleIdOrContext === 'string'
			? {
				battleId: battleIdOrContext,
				playerDeckId: options.playerDeckId || window.CCLProgressionState.getSelectedDeckId (),
				enemyDeckId: options.enemyDeckId,
				tournamentId: options.tournamentId,
				roundId: options.roundId,
				storyContext: options.storyContext || {}
			}
			: battleIdOrContext;

		const result = await this.system.start ({
			battleId: context.battleId,
			statusTargetId: options.statusTargetId || context.statusTargetId || null,
			playerDeckId: context.playerDeckId || window.CCLProgressionState.getSelectedDeckId (),
			launchContext: context
		});

		this.lastResult = result;
		return result;
	}
};

/**
 * Global Event Listeners
 **/
document.addEventListener ('click', (event) => {
	const tournamentButton = event.target.closest ('[data-ccl-t-start-event]');

	if (tournamentButton) {
		event.preventDefault ();
		tournamentButton.disabled = true;
		const originalText = tournamentButton.textContent;
		tournamentButton.textContent = 'Loading…';

		const eventId = tournamentButton.getAttribute ('data-ccl-t-start-event');
		window.CCLTournamentEngine.runEvent (eventId).then (() => {
			tournamentButton.disabled = false;
			tournamentButton.textContent = originalText;
		});
	}
});

/**
 * Initialization
 **/
$_ready (() => {
	monogatari.init ('#monogatari').then (() => {
		// Initialize the battle system after the engine is ready
		window.CardBattleBridge.system = new CCLBattleSystem ();

		// Global listener for raw battle completion events (for analytics or state sync)
		window.addEventListener ('ccl:battle-complete', (event) => {
			window.CardBattleBridge.lastResult = event.detail;
		});
	});
});
