/* global monogatari */

// Persistent Storage Variable
monogatari.storage ({
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
});
