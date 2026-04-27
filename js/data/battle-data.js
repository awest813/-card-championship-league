/* global window */

(function () {
	const battlers = {
		flarecub_001: {
			id: 'flarecub_001',
			type: 'battler',
			name: 'Flarecub',
			element: 'fire',
			hp: 70,
			retreatCost: 1,
			attacks: [
				{ id: 'ember_tap', name: 'Ember Tap', cost: { fire: 1 }, baseDamage: 20 },
				{ id: 'tail_burst', name: 'Tail Burst', cost: { fire: 1, colorless: 1 }, baseDamage: 40 }
			]
		},
		voltrix_002: {
			id: 'voltrix_002',
			type: 'battler',
			name: 'Voltrix',
			element: 'electric',
			hp: 60,
			retreatCost: 1,
			attacks: [
				{ id: 'spark_ping', name: 'Spark Ping', cost: { electric: 1 }, baseDamage: 20 },
				{ id: 'storm_break', name: 'Storm Break', cost: { electric: 2 }, baseDamage: 50 }
			]
		},
		bronzepup_003: {
			id: 'bronzepup_003',
			type: 'battler',
			name: 'Bronzepup',
			element: 'metal',
			hp: 80,
			retreatCost: 2,
			attacks: [
				{ id: 'iron_nudge', name: 'Iron Nudge', cost: { metal: 1 }, baseDamage: 20 },
				{ id: 'plate_crash', name: 'Plate Crash', cost: { metal: 1, colorless: 2 }, baseDamage: 50 }
			]
		},
		kindlefox_004: {
			id: 'kindlefox_004',
			type: 'battler',
			name: 'Kindlefox',
			element: 'fire',
			hp: 90,
			retreatCost: 2,
			attacks: [
				{ id: 'glow_claw', name: 'Glow Claw', cost: { fire: 1, colorless: 1 }, baseDamage: 30 },
				{ id: 'blaze_arc', name: 'Blaze Arc', cost: { fire: 2, colorless: 1 }, baseDamage: 60 }
			]
		},
		mistfin_005: {
			id: 'mistfin_005',
			type: 'battler',
			name: 'Mistfin',
			element: 'water',
			hp: 70,
			retreatCost: 1,
			attacks: [
				{ id: 'ripple_jab', name: 'Ripple Jab', cost: { water: 1 }, baseDamage: 20 },
				{ id: 'current_lash', name: 'Current Lash', cost: { water: 1, colorless: 1 }, baseDamage: 40 }
			]
		},
		galehound_006: {
			id: 'galehound_006',
			type: 'battler',
			name: 'Galehound',
			element: 'wind',
			hp: 80,
			retreatCost: 1,
			attacks: [
				{ id: 'rush_peck', name: 'Rush Peck', cost: { wind: 1 }, baseDamage: 20 },
				{ id: 'crosswind', name: 'Crosswind', cost: { wind: 2 }, baseDamage: 50 }
			]
		},
		reefdrake_007: {
			id: 'reefdrake_007',
			type: 'battler',
			name: 'Reefdrake',
			element: 'water',
			hp: 90,
			retreatCost: 2,
			attacks: [
				{ id: 'deep_bite', name: 'Deep Bite', cost: { water: 1, colorless: 1 }, baseDamage: 30 },
				{ id: 'tidal_crash', name: 'Tidal Crash', cost: { water: 2, colorless: 1 }, baseDamage: 60 }
			]
		},
		skyviper_008: {
			id: 'skyviper_008',
			type: 'battler',
			name: 'Skyviper',
			element: 'wind',
			hp: 70,
			retreatCost: 0,
			attacks: [
				{ id: 'needle_dive', name: 'Needle Dive', cost: { wind: 1 }, baseDamage: 20 },
				{ id: 'razor_loop', name: 'Razor Loop', cost: { wind: 1, colorless: 1 }, baseDamage: 40 }
			]
		},
		thunderpup_009: {
			id: 'thunderpup_009',
			type: 'battler',
			name: 'Thunderpup',
			element: 'electric',
			hp: 80,
			retreatCost: 1,
			attacks: [
				{ id: 'charge_bite', name: 'Charge Bite', cost: { electric: 1 }, baseDamage: 20 },
				{ id: 'rail_snap', name: 'Rail Snap', cost: { electric: 1, colorless: 1 }, baseDamage: 50 }
			]
		},
		cinderstag_010: {
			id: 'cinderstag_010',
			type: 'battler',
			name: 'Cinderstag',
			element: 'fire',
			hp: 100,
			retreatCost: 2,
			attacks: [
				{ id: 'coal_ram', name: 'Coal Ram', cost: { fire: 1, colorless: 1 }, baseDamage: 30 },
				{ id: 'crown_inferno', name: 'Crown Inferno', cost: { fire: 2, colorless: 1 }, baseDamage: 70 }
			]
		},
		ironclad_011: {
			id: 'ironclad_011',
			type: 'battler',
			name: 'Ironclad',
			element: 'metal',
			hp: 120,
			retreatCost: 3,
			attacks: [
				{ id: 'heavy_slam', name: 'Heavy Slam', cost: { metal: 2, colorless: 1 }, baseDamage: 50 },
				{ id: 'fortify', name: 'Fortify', cost: { metal: 1 }, baseDamage: 10 }
			]
		},
		skystream_012: {
			id: 'skystream_012',
			type: 'battler',
			name: 'Skystream',
			element: 'wind',
			hp: 60,
			retreatCost: 0,
			attacks: [
				{ id: 'gust_blade', name: 'Gust Blade', cost: { wind: 1 }, baseDamage: 30 },
				{ id: 'aerial_loop', name: 'Aerial Loop', cost: { wind: 1, colorless: 1 }, baseDamage: 40 }
			]
		},
		voltspike_013: {
			id: 'voltspike_013',
			type: 'battler',
			name: 'Voltspike',
			element: 'electric',
			hp: 80,
			retreatCost: 1,
			attacks: [
				{ id: 'needle_charge', name: 'Needle Charge', cost: { electric: 1 }, baseDamage: 30 },
				{ id: 'static_burst', name: 'Static Burst', cost: { electric: 2 }, baseDamage: 60 }
			]
		}
	};

	const supports = {
		blaze_playbook_101: {
			id: 'blaze_playbook_101',
			type: 'support',
			name: 'Blaze Playbook',
			element: 'fire',
			target: 'none',
			effect: { kind: 'draw', amount: 2 },
			rulesText: 'Draw 2 cards.'
		},
		field_medic_102: {
			id: 'field_medic_102',
			type: 'support',
			name: 'Field Medic',
			element: 'alloy',
			target: 'ally_any',
			effect: { kind: 'heal', amount: 30 },
			rulesText: 'Heal 30 from one of your battlers.'
		},
		guard_shift_103: {
			id: 'guard_shift_103',
			type: 'support',
			name: 'Guard Shift',
			element: 'tide',
			target: 'ally_any',
			effect: { kind: 'status', statusId: 'guarded' },
			rulesText: 'Give one of your battlers Guarded.'
		},
		relay_whistle_104: {
			id: 'relay_whistle_104',
			type: 'support',
			name: 'Relay Whistle',
			element: 'tide',
			target: 'ally_bench',
			effect: { kind: 'swap' },
			rulesText: 'Swap your active battler with a benched battler.'
		},
		static_jam_105: {
			id: 'static_jam_105',
			type: 'support',
			name: 'Static Jam',
			element: 'veil',
			target: 'enemy_active',
			effect: { kind: 'status', statusId: 'stun' },
			rulesText: 'Stun the opposing active battler.'
		},
		burn_line_106: {
			id: 'burn_line_106',
			type: 'support',
			name: 'Burn Line',
			element: 'fire',
			target: 'enemy_active',
			effect: { kind: 'status', statusId: 'burn' },
			rulesText: 'Burn the opposing active battler.'
		},
		tempo_script_107: {
			id: 'tempo_script_107',
			type: 'support',
			name: 'Tempo Script',
			element: 'current',
			target: 'ally_any',
			effect: { kind: 'buff', attackBonus: 20, expires: 'turn_end' },
			rulesText: 'One of your battlers gets +20 damage this turn.'
		},
		system_shock_105: {
			id: 'system_shock_105',
			type: 'support',
			name: 'System Shock',
			element: 'electric',
			target: 'enemy_active',
			effect: { kind: 'status', statusId: 'stun' },
			rulesText: 'Stun the enemy active battler.'
		},
		adrenaline_shot_106: {
			id: 'adrenaline_shot_106',
			type: 'support',
			name: 'Adrenaline Shot',
			element: 'alloy',
			target: 'ally_any',
			effect: { kind: 'buff', attackBonus: 20 },
			rulesText: 'Selected battler deals +20 damage this turn.'
		}
	};

	const cards = { ...battlers, ...supports };

	const statuses = {
		burn: {
			id: 'burn',
			label: 'Burn',
			description: 'Takes 10 damage at the end of each turn.',
			chipClass: 'ccl-status-burn',
			durationPhase: 'turn_end',
			defaultTurns: 3,
			blockedActions: []
		},
		stun: {
			id: 'stun',
			label: 'Stun',
			description: 'Cannot attack or retreat while stunned.',
			chipClass: 'ccl-status-stun',
			durationPhase: 'turn_end',
			defaultTurns: 1,
			blockedActions: ['attack', 'retreat']
		},
		guarded: {
			id: 'guarded',
			label: 'Guarded',
			description: 'Reduces the next incoming attack by 20 damage.',
			chipClass: 'ccl-status-guarded',
			durationPhase: 'turn_end',
			defaultTurns: 1,
			blockedActions: []
		}
	};

	const decks = {
		starter_blaze: {
			id: 'starter_blaze',
			name: 'Starter Blaze',
			identity: 'pressure',
			energyTypes: ['fire', 'electric'],
			cards: [
				'flarecub_001', 'flarecub_001', 'flarecub_001',
				'kindlefox_004', 'kindlefox_004', 'kindlefox_004',
				'thunderpup_009', 'thunderpup_009', 'thunderpup_009',
				'voltrix_002', 'voltrix_002', 'voltrix_002',
				'cinderstag_010', 'cinderstag_010',
				'bronzepup_003', 'bronzepup_003',
				'blaze_playbook_101', 'burn_line_106', 'tempo_script_107', 'field_medic_102'
			]
		},
		starter_tide: {
			id: 'starter_tide',
			name: 'Starter Tide',
			identity: 'control',
			energyTypes: ['water', 'wind'],
			cards: [
				'mistfin_005', 'mistfin_005', 'mistfin_005',
				'galehound_006', 'galehound_006', 'galehound_006',
				'skyviper_008', 'skyviper_008', 'skyviper_008',
				'reefdrake_007', 'reefdrake_007', 'reefdrake_007',
				'bronzepup_003', 'bronzepup_003',
				'mistfin_005', 'galehound_006',
				'guard_shift_103', 'relay_whistle_104', 'field_medic_102', 'tempo_script_107'
			]
		},
		rook_storm_rush: {
			id: 'rook_storm_rush',
			name: 'Rook Storm Rush',
			identity: 'tempo_disruption',
			energyTypes: ['wind', 'water'],
			cards: [
				'galehound_006', 'galehound_006', 'galehound_006',
				'skyviper_008', 'skyviper_008', 'skyviper_008',
				'mistfin_005', 'mistfin_005', 'mistfin_005',
				'reefdrake_007', 'reefdrake_007', 'reefdrake_007',
				'galehound_006', 'skyviper_008', 'mistfin_005', 'reefdrake_007',
				'static_jam_105', 'tempo_script_107', 'guard_shift_103', 'blaze_playbook_101'
			]
		},
		starter_storm: {
			id: 'starter_storm',
			name: 'Starter Storm',
			description: 'A hybrid Electric/Wind deck focused on speed and disruption.',
			energyTypes: ['electric', 'wind'],
			cards: [
				'voltspike_013', 'voltspike_013', 'voltspike_013', 'voltspike_013',
				'skystream_012', 'skystream_012', 'skystream_012', 'skystream_012',
				'voltrix_002', 'voltrix_002', 'voltrix_002', 'voltrix_002',
				'galehound_006', 'galehound_006',
				'system_shock_105', 'system_shock_105', 'system_shock_105', 'system_shock_105',
				'adrenaline_shot_106', 'adrenaline_shot_106',
				'blaze_playbook_101', 'blaze_playbook_101', 'blaze_playbook_101', 'blaze_playbook_101'
			]
		}
	};

	const rivals = {
		rook: {
			id: 'rook',
			name: 'Rook',
			deckId: 'rook_storm_rush',
			intro: 'Rook plays a tempo list built to steal initiative and keep you reacting.',
			affinityKey: 'rook'
		}
	};

	const tournaments = {
		harbor_city_open: {
			id: 'harbor_city_open',
			name: 'Harbor City Open',
			rounds: [
				{ id: 'registration', nextRoundId: 'early_match' },
				{ id: 'early_match', nextRoundId: 'intermediate_match' },
				{ id: 'intermediate_match', nextRoundId: 'rook_round' },
				{ id: 'rook_round', nextRoundId: 'result_branch' }
			]
		}
	};

	const battles = {
		harbor_city_rook: {
			id: 'harbor_city_rook',
			label: 'Harbor City Open - Table Seven',
			opponentId: 'rook',
			playerDeckId: 'starter_blaze',
			enemyDeckId: 'rook_storm_rush',
			tournamentId: 'harbor_city_open',
			roundId: 'rook_round',
			victoryScene: 'RoundOneVictory',
			defeatScene: 'RoundOneDefeat',
			rewards: {
				victory: {
					credits: 100,
					cards: ['galehound_006'],
					packs: ['harbor_city_reward_pack'],
					items: []
				},
				defeat: {
					credits: 25,
					cards: [],
					packs: [],
					items: []
				}
			},
			storyFlags: {
				victory: ['beat_rook_round1'],
				defeat: ['lost_to_rook_round1']
			}
		},
		harbor_city_filler: {
			id: 'harbor_city_filler',
			label: 'Harbor City Open - Qualifier',
			opponentId: 'rook', // Will be overridden by engine
			playerDeckId: 'starter_blaze',
			enemyDeckId: 'starter_tide',
			tournamentId: 'harbor_city_open',
			roundId: 'early_match',
			rewards: {
				victory: { credits: 20, cards: [], packs: [], items: [] },
				defeat:  { credits: 5,  cards: [], packs: [], items: [] }
			}
		}
	};

	window.CCLData = {
		cards,
		battlers,
		supports,
		statuses,
		decks,
		rivals,
		tournaments,
		battles
	};
})();
