/* global window */

// Task Group A — Schema lock: tournament event, entrant, runtime state, bracket, filler schemas.
// Task Group D — Filler entrant pools, generator, history tag support.

(function () {
	'use strict';

	// ─── Tournament Event Definitions ─────────────────────────────────────────────
	// Implements TournamentEvent schema from Phase 0 blueprint §8.1

	const EVENTS = {
		harbor_city_open: {
			id: 'harbor_city_open',
			name: 'Harbor City Open',
			tier: 'city_open',
			district: 'Harbor District',
			venue: 'Harbor City Convention Center',
			logoThemeKey: 'harbor_gold',
			tagline: 'Where League Reputations Begin',
			organizer: 'Harbor City Card Association',
			sponsor: 'Tide & Tower Collectibles',
			roundCount: 3,
			entrantCount: 8,
			rewardTableId: 'harbor_city_open_rewards',
			notableEntrantIds: ['rook'],
			bracketRules: {
				format: 'single_elimination',
				simulatedNonPlayerMatches: true
			},
			flavorPackKey: 'harbor_city_open',
			replayable: false,
			storyGated: true,
			// Three player-facing rounds in order
			rounds: [
				{ id: 'early_match',          label: 'Round of 8',    roundNumber: 1 },
				{ id: 'intermediate_match',   label: 'Semifinals',    roundNumber: 2 },
				{ id: 'rook_round',           label: 'Finals',        roundNumber: 3 }
			],
			rewards: {
				victory: { credits: 100, cards: ['galehound_006'], packs: ['harbor_city_reward_pack'], items: [] },
				defeat:  { credits: 25,  cards: [],                packs: [],                          items: [] }
			},
			victoryScene: 'RoundOneVictory',
			defeatScene:  'RoundOneDefeat'
		}
	};

	// ─── Authored Entrant Definitions ─────────────────────────────────────────────
	// Implements TournamentEntrant schema (entrantType: "authored") from §8.2

	const AUTHORED_ENTRANTS = {
		rook: {
			id: 'rook',
			entrantType: 'authored',
			name: 'Rook',
			portraitKey: 'rook_portrait',
			district: 'Midtown',
			deckArchetype: 'Tempo Disruption',
			deckId: 'rook_storm_rush',
			roleTags: ['rival', 'nemesis'],
			relationshipTags: ['romance_interest'],
			rivalryTags: ['high'],
			bioText: 'Top seed in the junior ladder. Plays a tempo list built to steal initiative and keep you reacting.',
			introLinePool: [
				'Finally. A match worth showing up for.',
				'Table Seven. You and me. Try not to disappoint.',
				'I have been waiting for this pairing since registration.',
				'Good. Let\'s see what you actually learned.'
			],
			badgeTags: ['seeded', 'rival', 'nemesis', 'win_streak'],
			seeded: true,
			elite: true,
			crowdFavorite: false,
			battleId: 'harbor_city_rook',
			isFeaturedMatch: true
		}
	};

	// ─── Filler Entrant Pool ──────────────────────────────────────────────────────
	// Implements TournamentEntrant schema (entrantType: "filler") from §8.2
	// Harbor City Open uses 6 filler slots in the 8-entrant bracket.

	const FILLER_POOL = [
		{
			id: 'filler_kai_marsh',
			entrantType: 'filler',
			name: 'Kai Marsh',
			portraitKey: 'filler_a',
			district: 'Dockside',
			deckArchetype: 'Aggro Specialist',
			deckId: 'starter_blaze',
			roleTags: ['local_favorite'],
			relationshipTags: [],
			rivalryTags: [],
			bioText: 'Dockside regular. Plays fast aggro and relies on early pressure to snowball wins.',
			introLinePool: [
				'Good luck. You will need it.',
				'Let\'s keep this clean.',
				'I came to win rounds, not make friends.'
			],
			badgeTags: ['local_favorite'],
			seeded: false,
			elite: false,
			crowdFavorite: false,
			generatorSource: 'harbor_city_filler_pool_v1',
			historyTags: []
		},
		{
			id: 'filler_ven_cole',
			entrantType: 'filler',
			name: 'Ven Cole',
			portraitKey: 'filler_b',
			district: 'Harbor North',
			deckArchetype: 'Hybrid Tempo',
			deckId: 'starter_storm',
			roleTags: [],
			relationshipTags: [],
			rivalryTags: [],
			bioText: 'Harbor North club player. Patient control style that stalls until a single late-game swing.',
			introLinePool: [
				'Take your time. I certainly will.',
				'Speed is overrated in this format.',
				'I have been to four Harbor City Opens. This one is mine.'
			],
			badgeTags: [],
			seeded: false,
			elite: false,
			crowdFavorite: false,
			generatorSource: 'harbor_city_filler_pool_v1',
			historyTags: []
		},
		{
			id: 'filler_sable_ryn',
			entrantType: 'filler',
			name: 'Sable Ryn',
			portraitKey: 'filler_c',
			district: 'East Marina',
			deckArchetype: 'Combo Specialist',
			deckId: 'starter_blaze',
			roleTags: ['crowd_favorite'],
			relationshipTags: [],
			rivalryTags: [],
			bioText: 'East Marina crowd favorite. Combo-oriented list that looks chaotic until it suddenly closes games.',
			introLinePool: [
				'The combo has to hit eventually. Why not today.',
				'The crowd always roots for the flashy play.',
				'I came here to win stylishly.'
			],
			badgeTags: ['crowd_favorite'],
			seeded: false,
			elite: false,
			crowdFavorite: true,
			generatorSource: 'harbor_city_filler_pool_v1',
			historyTags: []
		},
		{
			id: 'filler_silas_thorne',
			entrantType: 'filler',
			name: 'Silas Thorne',
			portraitKey: 'filler_d',
			district: 'Old Harbor',
			deckArchetype: 'Hybrid Tempo',
			deckId: 'starter_storm',
			roleTags: ['crowd_favorite'],
			relationshipTags: [],
			rivalryTags: [],
			bioText: 'Port Loop grinder. Heavy defensive list designed to outlast aggro and punish overextension.',
			introLinePool: [
				'I am not here to rush. I am here to outlast.',
				'Patience is a strategy.',
				'Your aggro will break before my wall does.'
			],
			badgeTags: [],
			seeded: false,
			elite: false,
			crowdFavorite: false,
			generatorSource: 'harbor_city_filler_pool_v1',
			historyTags: []
		},
		{
			id: 'filler_nora_pike',
			entrantType: 'filler',
			name: 'Nora Pike',
			portraitKey: 'filler_e',
			district: 'Tidefront',
			deckArchetype: 'Trickster',
			deckId: 'starter_tide',
			roleTags: [],
			relationshipTags: [],
			rivalryTags: [],
			bioText: 'Tidefront wildcard. Disruption-heavy list that tilts opponents through misdirection.',
			introLinePool: [
				'You will not see it coming.',
				'The board never looks the way you expect with me.',
				'Disruption is my language.'
			],
			badgeTags: ['upset_alert'],
			seeded: false,
			elite: false,
			crowdFavorite: false,
			generatorSource: 'harbor_city_filler_pool_v1',
			historyTags: []
		},
		{
			id: 'filler_cord_baine',
			entrantType: 'filler',
			name: 'Cord Baine',
			portraitKey: 'filler_f',
			district: 'Central Loop',
			deckArchetype: 'Aggro Specialist',
			deckId: 'starter_blaze',
			roleTags: ['local_favorite'],
			relationshipTags: [],
			rivalryTags: [],
			bioText: 'Central Loop regular. Fast aggro with minimal support, relying on raw speed to close rounds.',
			introLinePool: [
				'First two turns is all I need.',
				'I do not need a late game plan.',
				'Quick and clean. That is the whole strategy.'
			],
			badgeTags: ['local_favorite'],
			seeded: false,
			elite: false,
			crowdFavorite: false,
			generatorSource: 'harbor_city_filler_pool_v1',
			historyTags: []
		}
	];

	// ─── Filler Entrant Generator ──────────────────────────────────────────────────
	// Implements filler entrant generation input/output schema from §12 Task Group D.
	// Phase 0: selects from named pool with shuffle. Phase 1 will add generative fallback.

	function selectFillerForEvent (count, historyTags) {
		// historyTags: string[] — previously-seen filler ids to deprioritize (Phase 1 feature)
		const seenIds = new Set (historyTags || []);
		const fresh = FILLER_POOL.filter (f => !seenIds.has (f.id));
		const stale = FILLER_POOL.filter (f => seenIds.has (f.id));

		// Shuffle fresh first, then stale as fallback
		const ordered = shuffle (fresh).concat (shuffle (stale));
		return ordered.slice (0, count);
	}

	function shuffle (arr) {
		const copy = arr.slice ();
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor (Math.random () * (i + 1));
			const tmp = copy[i];
			copy[i] = copy[j];
			copy[j] = tmp;
		}
		return copy;
	}

	// ─── Bracket Builder ──────────────────────────────────────────────────────────
	// Implements BracketState schema from §8.4.
	// 8-player single elim: player is slot 0, Rook is slot 7.
	// Player path: slot 0 vs slot 1 → vs slot 2/3 winner → vs slot 7 (Rook).

	function buildBracket (eventId, playerName, selectedFiller) {
		const slots = [
			{ slotId: 0, entrantId: 'player',               name: playerName,              isPlayer: true  },
			{ slotId: 1, entrantId: selectedFiller[0].id,   name: selectedFiller[0].name,  filler: selectedFiller[0] },
			{ slotId: 2, entrantId: selectedFiller[1].id,   name: selectedFiller[1].name,  filler: selectedFiller[1] },
			{ slotId: 3, entrantId: selectedFiller[2].id,   name: selectedFiller[2].name,  filler: selectedFiller[2] },
			{ slotId: 4, entrantId: selectedFiller[3].id,   name: selectedFiller[3].name,  filler: selectedFiller[3] },
			{ slotId: 5, entrantId: selectedFiller[4].id,   name: selectedFiller[4].name,  filler: selectedFiller[4] },
			{ slotId: 6, entrantId: selectedFiller[5].id,   name: selectedFiller[5].name,  filler: selectedFiller[5] },
			{ slotId: 7, entrantId: 'rook',                 name: 'Rook',                  authored: AUTHORED_ENTRANTS.rook }
		];

		// Player path through the 3 rounds
		const playerPath = [
			{ roundId: 'early_match',        opponentSlot: 1, opponent: selectedFiller[0]        },
			{ roundId: 'intermediate_match', opponentSlot: 3, opponent: selectedFiller[2]        },
			{ roundId: 'rook_round',         opponentSlot: 7, opponent: AUTHORED_ENTRANTS.rook   }
		];

		// Simulated non-player matches for bracket verisimilitude
		const simulatedMatches = [
			{ roundId: 'early_match',        winnerId: selectedFiller[2].id, loserId: selectedFiller[1].id },
			{ roundId: 'early_match',        winnerId: selectedFiller[3].id, loserId: selectedFiller[4].id },
			{ roundId: 'early_match',        winnerId: 'rook',               loserId: selectedFiller[5].id },
			{ roundId: 'intermediate_match', winnerId: selectedFiller[3].id, loserId: selectedFiller[2].id },
			{ roundId: 'intermediate_match', winnerId: 'rook',               loserId: selectedFiller[3].id }
		];

		// Runtime state (TournamentRuntimeState §8.3 + BracketState §8.4)
		return {
			eventId,
			slots,
			playerPath,
			simulatedMatches,
			currentPairings: [],
			resolvedMatches: [],
			notableCollisions: ['rook'],
			upsetNotes: []
		};
	}

	// ─── Tournament History Schema ─────────────────────────────────────────────────
	// Implements tournament history entry for the shared progression state archive.

	function buildHistoryEntry (eventId, playerName, placement, wins, losses, rewards, champion) {
		return {
			eventId,
			playerName,
			placement,
			wins,
			losses,
			rewards,
			champion,
			timestamp: Date.now ()
		};
	}

	window.CCLTournamentData = {
		EVENTS,
		AUTHORED_ENTRANTS,
		FILLER_POOL,
		buildBracket,
		buildHistoryEntry,
		selectFillerForEvent
	};
}) ();
