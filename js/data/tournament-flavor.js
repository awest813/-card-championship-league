/* global window */

// Task Group C — Content packs: Mira support v1, Rook lines v1, crowd buzz v1,
// commentator v1. Tagged by category for condition-driven selection in Phase 1.

(function () {
	'use strict';

	const lines = {
		mira: {
			registration_support: [
				{ text: 'You registered clean. That is the first win.', conditions: {} },
				{ text: 'Starter decks have surprised stronger fields than this one.', conditions: {} },
				{ text: 'The bracket does not know you yet. That is an advantage.', conditions: {} },
				{ text: 'Format is straightforward. Three rounds, single elim. Win the first one and everything opens up.', conditions: {} },
				{ text: 'You carry yourself differently today. Lean into that confidence.', conditions: { miraTrustMin: 15 } },
				{ text: 'I saw you practicing late. It shows in your draw posture.', conditions: { miraTrustMin: 10 } },
				{ text: 'The harbor air is good for the nerves. Keep your breathing steady.', conditions: {} }
			],
			bracket_reveal: [
				{ text: 'Rook is seeded for a reason. But seeds get upset.', conditions: {} },
				{ text: 'Your path is set. Now play through it.', conditions: {} },
				{ text: 'The bracket gave you work to do. Good.', conditions: {} },
				{ text: 'Ignore the seedings. Your side is your only business right now.', conditions: {} }
			],
			prematch_support_filler: [
				{ text: 'Quick read: stay ahead of your energy curve. First two turns decide this.', conditions: {} },
				{ text: 'Play your pace. Make them adapt to you.', conditions: {} },
				{ text: 'You can win this round clean. Trust the list.', conditions: {} },
				{ text: 'One match. That is all this is. Win the one in front of you.', conditions: {} }
			],
			prematch_support_rook: [
				{ text: 'You settled in after registration. Good. Play your pace, not his.', conditions: { miraTrustMin: 0 } },
				{ text: 'He plays to tilt. Do not hand it to him before you draw.', conditions: {} },
				{ text: 'This is what the bracket has been building to. You know the plan.', conditions: {} },
				{ text: 'Rook wants the room to feel impossible before the match starts. It is not.', conditions: {} }
			],
			between_round: [
				{ text: 'That was clean. Keep the same focus going into the next.', conditions: {} },
				{ text: 'The field noticed. Do not let that change how you play.', conditions: {} },
				{ text: 'You are through. Now we watch the bracket resolve.', conditions: {} },
				{ text: 'One round down. Stay grounded. Do not start playing to the crowd yet.', conditions: {} },
				{ text: 'The crowd is starting to lean in when you play. Handle that pressure.', conditions: { crowdFavorMin: 10 } },
				{ text: 'Three rounds is a sprint. You just finished the first hundred meters.', conditions: {} },
				{ text: 'You are reading the board faster than last time. Good.', conditions: { miraTrustMin: 20 } }
			],
			post_rook_win: [
				{ text: 'You kept the pressure clean and forced him to answer your pace. That was not luck.', conditions: {} },
				{ text: 'That is what preparation looks like when it connects.', conditions: {} }
			],
			post_rook_loss: [
				{ text: 'You did not freeze, and you did not fold. That matters more than one loss.', conditions: {} },
				{ text: 'Tournament stories are not only built on victories. They are built on who earns the rematch.', conditions: {} }
			]
		},

		rook: {
			pre_event: [
				{ text: 'Hoping you survive long enough to matter.', conditions: {} },
				{ text: 'The bracket does not care how prepared you think you are.', conditions: {} },
				{ text: 'See you in the finals. If you make it.', conditions: {} },
				{ text: 'I heard you were making noise in the practice lobby. Let\'s see it on the clock.', conditions: { tournamentRepMin: 10 } },
				{ text: 'Try not to choke when the lights go up. It ruins the aesthetic.', conditions: { rookHeatMin: 10 } }
			],
			bracket_reveal: [
				{ text: 'Your side of the bracket is weak. Mine is not.', conditions: {} },
				{ text: 'Enjoy round one while it lasts.', conditions: {} },
				{ text: 'I checked the pairings. You have an easy path. I did not plan for an easy path.', conditions: {} }
			],
			prematch_feature: [
				{ text: 'Finally. A match worth showing up for.', conditions: {} },
				{ text: 'I have been waiting for this pairing since registration.', conditions: {} },
				{ text: 'Table Seven. You and me. Try not to disappoint.', conditions: {} },
				{ text: 'Good. Let\'s see what you actually learned.', conditions: {} }
			],
			post_win: [
				{ text: 'Good. That is the first real match I have had all month.', conditions: {} },
				{ text: 'Hah. Next time I come prepared.', conditions: {} },
				{ text: 'Enjoy the trophy. You earned the target on your back.', conditions: { rookHeatMin: 15 } },
				{ text: 'You actually took a set. I might have to stop calling you a rookie.', conditions: { tournamentRepMin: 20 } }
			],
			post_loss: [
				{ text: 'Better than I expected. Next time I come prepared.', conditions: {} },
				{ text: 'Now the bracket knows your name. That cuts both ways.', conditions: {} }
			]
		},

		crowd: [
			'The stream is live. Chat is moving.',
			'Table Seven is the one to watch this round.',
			'Upset energy in the air. Something is about to happen.',
			'Half the room has eyes on the bracket board.',
			'Harbor City always turns up a story in round one.',
			'Rookie division finals are always unpredictable.',
			'That table just went featured. Someone made noise.',
			'The crowd is watching. This is the match they came for.',
			'Word is spreading through the floor. People are moving toward Table Seven.',
			'The stream caster flagged this as a featured match before the round even started.'
		],

		commentator: {
			event_intro: [
				'Duelists, welcome to the Harbor City Open. This is where league reputations begin.',
				'Harbor City Open is live. Brackets are sealed. The field is ready.',
				'Eight entrants. Three rounds. One champion. The Harbor City Open starts now.',
				'Today is where league reputations begin. Harbor City always delivers a story.'
			],
			bracket_reveal: [
				'Pairings are locked. The bracket does not lie.',
				'Let\'s see who drew the difficult side of the board.',
				'Bracket is live. Watch that bottom half — that is where the seed sits.',
				'We have a seeded favorite and a field of eight ready to prove the bracket wrong.',
				'Early upset alerts are pinging in the chat. The fans want blood.'
			],
			lounge_filler: [
				'The lounge is buzzing. Everyone is checking the bracket updates.',
				'Players are swapping notes, but the real strategy stays in the deck boxes.',
				'The air in the lounge is thick with relief and nerves.',
				'Scouts are already moving between the tables. No one is safe from the analysis.',
				'A few early losses are already packing up. The Harbor City Open is ruthless.'
			],
			featured_match: [
				'We have a featured table in Rookie Division: top seed Rook versus new entrant {{player.name}}.',
				'Table Seven is live. This is exactly the kind of pairing the Harbor City Open loves.',
				'The stream is on Table Seven. Rookie versus ladder favorite. This is the match.',
				'Table Seven just got flagged as the featured match. You know what that means.'
			],
			round_result_win: [
				'Upset confirmed. The rookie advances.',
				'Clean win. The field is taking notes.',
				'That is a result the bracket did not expect.',
				'And just like that, the bracket has a story.'
			],
			round_result_loss: [
				'The top seed holds. Rook advances.',
				'Close finish. The rookie pushed the seed harder than expected.',
				'Result stands. Rook moves on.',
				'Rook closes it out. But that was not the easy match the seedings suggested.'
			]
		}
	};

	// Badge display definitions — matches BADGE_DEFS in tournament-data.js
	const BADGE_DISPLAY = {
		seeded:          { label: 'Seeded',         color: '#d97706' },
		rival:           { label: 'Rival',           color: '#dc2626' },
		nemesis:         { label: 'Nemesis',         color: '#7c3aed' },
		mentor_support:  { label: 'Mentor Support',  color: '#2563eb' },
		friend:          { label: 'Friend',          color: '#16a34a' },
		romance_interest:{ label: 'Romance',         color: '#db2777' },
		local_favorite:  { label: 'Local Fave',      color: '#0891b2' },
		crowd_favorite:  { label: 'Crowd Fave',      color: '#ea580c' },
		win_streak:      { label: 'Win Streak',      color: '#059669' },
		upset_alert:     { label: 'Upset Alert',     color: '#b45309' },
		featured_match:  { label: 'Featured Match',  color: '#1d4ed8' },
		elite:           { label: 'Elite',           color: '#6d28d9' },
		finalist:        { label: 'Finalist',        color: '#0f766e' },
		champion:        { label: 'Champion',        color: '#b45309' }
	};

	function pickRandom (pool) {
		if (!pool || !pool.length) { return ''; }
		return pool[Math.floor (Math.random () * pool.length)];
	}

	function pickLine (category, subcategory, context = {}) {
		const cat = lines[category];
		if (!cat) { return ''; }

		const pool = subcategory ? cat[subcategory] : cat;
		if (!Array.isArray (pool)) { return ''; }

		// Filter the pool based on the provided context
		const filtered = pool.filter (function (item) {
			if (typeof item === 'string') { return true; }
			const cond = item.conditions || {};

			// Relationship variables
			if (cond.miraTrustMin !== undefined && (context.miraTrust || 0) < cond.miraTrustMin) { return false; }
			if (cond.rookHeatMin !== undefined && (context.rookHeat || 0) < cond.rookHeatMin) { return false; }
			if (cond.tournamentRepMin !== undefined && (context.tournamentRep || 0) < cond.tournamentRepMin) { return false; }
			if (cond.crowdFavorMin !== undefined && (context.crowdFavor || 0) < cond.crowdFavorMin) { return false; }

			// Event flags
			if (cond.featuredMatch !== undefined && !!context.featuredMatch !== !!cond.featuredMatch) { return false; }

			return true;
		});

		// Fallback to the full pool if filtering leaves us empty (to avoid dead text)
		const finalPool = filtered.length ? filtered : pool;
		const item = pickRandom (finalPool);
		return item ? (typeof item === 'string' ? item : item.text) : '';
	}

	window.CCLTournamentFlavor = {
		lines,
		BADGE_DISPLAY,
		pickRandom,
		pickLine
	};
}) ();
