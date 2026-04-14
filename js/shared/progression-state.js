/* global window */

(function () {
	const DEFAULT_STATE = {
		player: {
			name: '',
			callSign: '',
			rank: 'Rookie',
			deck: 'Starter Blaze',
			credits: 0,
			selectedDeckId: 'starter_blaze'
		},
		story: {
			rival: 'Rook',
			mentor: 'Mira',
			currentTournament: 'Harbor City Open',
			round: 'Registration',
			flags: [],
			lastBattleResult: null
		},
		collection: {
			packs: 0,
			ownedCards: [],
			unlocks: [],
			starterDecksUnlocked: ['Starter Blaze', 'Starter Tide']
		},
		tournament: {
			currentTournamentId: 'harbor_city_open',
			currentRoundId: 'registration',
			completedRounds: [],
			wins: 0,
			losses: 0,
			rematchAvailable: false,
			lastBattle: null
		},
		affinity: {
			mira: 0,
			rook: 0
		}
	};
	let cachedState = clone (DEFAULT_STATE);

	function clone (value) {
		return JSON.parse (JSON.stringify (value));
	}

	function mergeState (current, patch) {
		const next = { ...current };

		Object.keys (patch || {}).forEach ((key) => {
			const incoming = patch[key];
			if (incoming && typeof incoming === 'object' && !Array.isArray (incoming)) {
				next[key] = { ...(current[key] || {}), ...incoming };
			} else {
				next[key] = incoming;
			}
		});

		return next;
	}

	function getMonogatari () {
		return window.monogatari && typeof window.monogatari.storage === 'function'
			? window.monogatari
			: null;
	}

	function getState () {
		const engine = getMonogatari ();
		const current = engine ? engine.storage () : {};
		cachedState = mergeState (clone (DEFAULT_STATE), cachedState);
		cachedState = mergeState (cachedState, current || {});
		return clone (cachedState);
	}

	function mergeIntoCurrent (patch) {
		const engine = getMonogatari ();
		cachedState = mergeState (getState (), patch);

		if (!engine) {
			return clone (cachedState);
		}

		try {
			engine.storage (patch);
		} catch (error) {
			// The shared progression cache remains authoritative even if Monogatari declines a partial write.
		}

		return clone (cachedState);
	}

	function getSelectedDeckId () {
		const state = getState ();
		return state.player && state.player.selectedDeckId ? state.player.selectedDeckId : 'starter_blaze';
	}

	function setSelectedDeckId (deckId) {
		const deck = window.CCLData.decks[deckId] || window.CCLData.decks.starter_blaze;
		return mergeIntoCurrent ({
			player: {
				deck: deck.name,
				selectedDeckId: deck.id
			}
		});
	}

	function unique (list) {
		return Array.from (new Set ((list || []).filter (Boolean)));
	}

	function applyBattleResult (result) {
		const current = getState ();
		const currentPlayer = current.player || {};
		const currentCollection = current.collection || {};
		const currentStory = current.story || {};
		const currentTournament = current.tournament || {};
		const currentAffinity = current.affinity || {};
		const rewards = result.rewards || {};
		const unlocks = result.unlocks || [];
		const storyFlags = result.storyFlags || [];
		const tournamentUpdate = result.tournamentUpdate || {};
		const affinityChanges = result.affinityChanges || {};
		const nextAffinity = { ...currentAffinity };

		Object.keys (affinityChanges).forEach ((key) => {
			nextAffinity[key] = (typeof nextAffinity[key] === 'number' ? nextAffinity[key] : 0) + affinityChanges[key];
		});

		return mergeIntoCurrent ({
			player: {
				credits: (typeof currentPlayer.credits === 'number' ? currentPlayer.credits : 0) + (rewards.credits || 0),
				deck: currentPlayer.deck || 'Starter Blaze',
				selectedDeckId: currentPlayer.selectedDeckId || 'starter_blaze'
			},
			collection: {
				packs: (typeof currentCollection.packs === 'number' ? currentCollection.packs : 0) + (rewards.packs ? rewards.packs.length : 0),
				ownedCards: unique ((currentCollection.ownedCards || []).concat (rewards.cards || [])),
				unlocks: unique ((currentCollection.unlocks || []).concat (unlocks || [])),
				starterDecksUnlocked: currentCollection.starterDecksUnlocked || ['Starter Blaze', 'Starter Tide']
			},
			story: {
				...currentStory,
				round: result.nextScene || currentStory.round || 'Registration',
				flags: unique ((currentStory.flags || []).concat (storyFlags)),
				lastBattleResult: clone (result)
			},
			tournament: {
				...currentTournament,
				currentTournamentId: tournamentUpdate.tournamentId || currentTournament.currentTournamentId || 'harbor_city_open',
				currentRoundId: tournamentUpdate.nextRoundId || currentTournament.currentRoundId || 'rook_round',
				completedRounds: unique ((currentTournament.completedRounds || []).concat (tournamentUpdate.roundCleared || [])),
				wins: (typeof currentTournament.wins === 'number' ? currentTournament.wins : 0) + (result.winner === 'player' ? 1 : 0),
				losses: (typeof currentTournament.losses === 'number' ? currentTournament.losses : 0) + (result.winner === 'enemy' ? 1 : 0),
				rematchAvailable: Boolean (result.rematchAvailable),
				lastBattle: clone (result)
			},
			affinity: nextAffinity
		});
	}

	window.CCLProgressionState = {
		clone,
		getState,
		getSelectedDeckId,
		setSelectedDeckId,
		applyBattleResult
	};
})();
