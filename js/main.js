'use strict';
/* global Monogatari */
/* global monogatari */
/* global CCLBattleSystem */

const { $_ready } = Monogatari;

window.CardBattleBridge = {
	system: null,
	lastResult: null,
	promptObserver: null,
	getDeckName (deckId) {
		return window.CCLData.decks[deckId] ? window.CCLData.decks[deckId].name : window.CCLData.decks.starter_blaze.name;
	},
	getPreferredDeckId () {
		return window.CCLProgressionState.getSelectedDeckId ();
	},
	setPreferredDeckId (deckId) {
		const nextDeckId = window.CCLData.decks[deckId] ? deckId : 'starter_blaze';
		window.CCLProgressionState.setSelectedDeckId (nextDeckId);
		this.renderDeckStatus ();
		return nextDeckId;
	},
	renderDeckStatus () {
		const deckId = this.getPreferredDeckId ();
		const deckName = this.getDeckName (deckId);
		const state = window.CCLProgressionState.getState ();
		const story = state.story || {};
		const tournament = state.tournament || {};
		const status = document.getElementById ('ccl-selected-deck-status');
		const launchStatus = document.getElementById ('ccl-battle-launch-status');

		document.querySelectorAll ('[data-ccl-deck-id]').forEach ((button) => {
			const active = button.getAttribute ('data-ccl-deck-id') === deckId;
			button.classList.toggle ('ccl-deck-choice-active', active);
			button.setAttribute ('aria-pressed', active ? 'true' : 'false');
		});

		if (status) {
			status.textContent = `Selected deck: ${deckName}`;
		}

		if (launchStatus && launchStatus.textContent === 'Battle not started yet.') {
			const roundLabel = tournament.currentRoundId || story.round || 'rook_round';
			launchStatus.textContent = `${deckName} is ready for ${roundLabel}.`;
		}
	},
	installPromptObserver () {
		if (this.promptObserver) {
			return;
		}

		this.promptObserver = new MutationObserver (() => {
			if (document.getElementById ('ccl-selected-deck-status')) {
				this.renderDeckStatus ();
			}
		});

		this.promptObserver.observe (document.body, {
			childList: true,
			subtree: true
		});
	},
	async startBattle (battleIdOrContext, options = {}) {
		if (!this.system) {
			throw new Error ('Battle system is not ready yet.');
		}

		const context = typeof battleIdOrContext === 'string'
			? {
				battleId: battleIdOrContext,
				playerDeckId: options.playerDeckId || this.getPreferredDeckId (),
				enemyDeckId: options.enemyDeckId,
				tournamentId: options.tournamentId,
				roundId: options.roundId,
				storyContext: options.storyContext || {}
			}
			: battleIdOrContext;

		const result = await this.system.start ({
			battleId: context.battleId,
			statusTargetId: options.statusTargetId || context.statusTargetId || null,
			playerDeckId: context.playerDeckId || this.getPreferredDeckId (),
			launchContext: context
		});

		this.lastResult = result;
		return result;
	},
	getLastResultText () {
		if (!this.lastResult) {
			return 'No duel result recorded yet.';
		}

		return this.lastResult.winner === 'player'
			? `You won ${this.lastResult.score.playerPoints} to ${this.lastResult.score.enemyPoints}.`
			: `Rook won ${this.lastResult.score.enemyPoints} to ${this.lastResult.score.playerPoints}.`;
	}
};

window.selectBattleDeck = function (deckId) {
	const nextDeckId = window.CardBattleBridge.setPreferredDeckId (deckId);
	const launchStatus = document.getElementById ('ccl-battle-launch-status');

	if (launchStatus) {
		launchStatus.textContent = `${window.CardBattleBridge.getDeckName (nextDeckId)} selected. Mira nods from behind the rail while Rook waits at Table Seven.`;
	}
};

window.startHarborCityRookBattle = function () {
	const status = document.getElementById ('ccl-battle-launch-status');
	const context = window.CCLStoryBattleLauncher.buildLaunchContext ('harbor_city_rook', {
		playerDeckId: window.CardBattleBridge.getPreferredDeckId (),
		storyContext: {
			mentor: 'mira',
			rival: 'rook'
		},
		statusTargetId: 'ccl-battle-launch-status'
	});

	if (status) {
		status.textContent = 'Launching duel...';
	}

	window.CCLStoryBattleLauncher.startBattleScene (context).then ((result) => {
		if (result) {
			window.CCLBattleResultHandler.applyAndContinue (result);
		}
	}).catch ((error) => {
		if (status) {
			status.textContent = `Battle failed to start: ${error.message}`;
		}
	});
};

document.addEventListener ('click', (event) => {
	const deckButton       = event.target.closest ('[data-ccl-select-deck]');
	const battleButton     = event.target.closest ('[data-ccl-start-battle]');
	const tournamentButton = event.target.closest ('[data-ccl-t-start-event]');

	if (deckButton) {
		event.preventDefault ();
		window.selectBattleDeck (deckButton.getAttribute ('data-ccl-select-deck'));
	}

	if (battleButton) {
		event.preventDefault ();
		window.startHarborCityRookBattle ();
	}

	if (tournamentButton) {
		event.preventDefault ();
		tournamentButton.disabled = true;
		tournamentButton.textContent = 'Loading…';
		const eventId = tournamentButton.getAttribute ('data-ccl-t-start-event');
		window.CCLTournamentEngine.runEvent (eventId);
	}
});

$_ready (() => {
	monogatari.init ('#monogatari').then (() => {
		window.CardBattleBridge.system = new CCLBattleSystem ();
		window.CardBattleBridge.installPromptObserver ();
		window.CardBattleBridge.renderDeckStatus ();

		window.addEventListener ('ccl:battle-complete', (event) => {
			const result = event.detail;
			const status = document.getElementById ('ccl-battle-launch-status');

			window.CardBattleBridge.lastResult = result;
			if (status) {
				status.textContent = result.winner === 'player'
					? 'Round One complete: you defeated Rook and advanced the Harbor City Open route.'
					: 'Round One complete: Rook took the feature match and the rematch route is now live.';
			}
		});
	});
});
