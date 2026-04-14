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
	},
	// Task Group E — Tournament relationship variables (§6.1)
	relationship: {
		miraTrust:    0,   // 0-100: Mira's confidence in the player's judgment and resilience
		rookHeat:     0,   // 0-100: rivalry intensity, fixation, bracket-centered emotional pressure
		tournamentRep: 0,  // 0-100: how seriously the Harbor City scene takes the player
		crowdFavor:   0    // 0-100: public warmth, spotlight appeal, audience momentum
	},
	tournamentHistory: []
});
