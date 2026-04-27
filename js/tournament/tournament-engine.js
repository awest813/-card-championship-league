/* global window */

// Task Group B — Harbor City Open flow: event splash, registration, bracket reveal,
// match cards, between-round lounge, result screens, battle handoff, story return.

(function () {
	'use strict';

	// ─── Internal state ───────────────────────────────────────────────────────────

	let _overlay   = null;
	let _state     = null;
	let _resolveRun = null;

	// ─── DOM helpers ──────────────────────────────────────────────────────────────

	function getOverlay () {
		if (!_overlay) {
			_overlay = document.createElement ('div');
			_overlay.id = 'ccl-tournament-overlay';
			document.body.appendChild (_overlay);
			_overlay.addEventListener ('click', handleOverlayClick);
		}
		return _overlay;
	}

	function showOverlay () {
		const ov = getOverlay ();
		ov.classList.add ('ccl-t-active');
		document.body.classList.add ('tournament-open');
	}

	function hideOverlay () {
		if (_overlay) {
			_overlay.classList.remove ('ccl-t-active');
			_overlay.innerHTML = '';
		}
		document.body.classList.remove ('tournament-open');
	}

	function setScreen (html) {
		const ov = getOverlay ();
		ov.innerHTML = html;
	}

	// ─── Click delegation ─────────────────────────────────────────────────────────

	function handleOverlayClick (event) {
		const btn = event.target.closest ('[data-ccl-t-action]');
		if (!btn || btn.disabled) { return; }
		event.preventDefault ();
		btn.disabled = true;
		const action = btn.getAttribute ('data-ccl-t-action');
		const param  = btn.getAttribute ('data-ccl-t-param') || '';
		dispatchAction (action, param);
	}

	function dispatchAction (action, param) {
		switch (action) {
			case 'register':             showRegistration ();         break;
			case 'confirm_registration': showBracketReveal ();        break;
			case 'begin_round':          beginRound ();               break;
			case 'quick_win':            handleQuickWin ();           break;
			case 'continue_result':      showBetweenRoundLounge ();   break;
			case 'continue_lounge':      continueFromLounge ();       break;
			case 'launch_battle':        launchBattle ();             break;
			case 'close_summary':        closeSummary ();             break;
		}
	}

	// ─── Flavor helpers ───────────────────────────────────────────────────────────

	function pickRandom (arr) {
		if (!arr || !arr.length) { return ''; }
		return arr[Math.floor (Math.random () * arr.length)];
	}

	function getFlavorContext (extra = {}) {
		const progression = window.CCLProgressionState.getState ();
		const rel = progression.relationship || {};
		return Object.assign ({
			miraTrust:     rel.miraTrust     || 0,
			rookHeat:      rel.rookHeat      || 0,
			tournamentRep: rel.tournamentRep || 0,
			crowdFavor:    rel.crowdFavor    || 0
		}, extra);
	}

	function miraLine (key, extra = {}) {
		return window.CCLTournamentFlavor.pickLine ('mira', key, getFlavorContext (extra));
	}

	function rookLine (key, extra = {}) {
		return window.CCLTournamentFlavor.pickLine ('rook', key, getFlavorContext (extra));
	}

	function commentatorLine (key, extra = {}) {
		return window.CCLTournamentFlavor.pickLine ('commentator', key, getFlavorContext (extra));
	}

	function crowdLine () {
		return pickRandom (window.CCLTournamentFlavor.lines.crowd || []);
	}

	function playerName () {
		const state = window.CCLProgressionState.getState ();
		return (state.player && state.player.name) || 'Duelist';
	}

	function deckName () {
		const deckId = window.CCLProgressionState.getSelectedDeckId ();
		const data = window.CCLData.decks[deckId];
		return data ? data.name : 'Starter Blaze';
	}

	// ─── Badge renderer ───────────────────────────────────────────────────────────

	function renderBadges (tags) {
		const defs = window.CCLTournamentFlavor.BADGE_DISPLAY;
		return (tags || []).map (function (tag) {
			const def = defs[tag];
			if (!def) { return ''; }
			return '<span class="ccl-t-badge" style="--badge-color:' + def.color + '">' + def.label + '</span>';
		}).join ('');
	}

	// ─── Tier label formatter ─────────────────────────────────────────────────────

	function formatTier (tier) {
		const map = {
			local_open:           'Local Open',
			district_cup:         'District Cup',
			city_open:            'City Open',
			invitational:         'Invitational',
			qualifier:            'Championship Qualifier',
			final_championship:   'Final Championship'
		};
		return map[tier] || tier;
	}

	// ─── Line block HTML ──────────────────────────────────────────────────────────

	function lineBlock (speaker, text, mod) {
		if (!text) { return ''; }
		const speakerTag = speaker ? '<span class="ccl-t-speaker">' + speaker + '</span>' : '';
		return '<div class="ccl-t-line-block ccl-t-line-block--' + (mod || 'crowd') + '">' + speakerTag + '&#8220;' + text + '&#8221;</div>';
	}

	// ─── Screen: Event Splash ─────────────────────────────────────────────────────

	function showEventSplash () {
		_state.screen = 'splash';
		const ev   = _state.event;
		const cLine = commentatorLine ('event_intro');

		setScreen (
			'<div class="ccl-t-screen ccl-t-screen--splash">' +
				'<div class="ccl-t-splash-inner">' +
					'<div class="ccl-t-tier-badge">' + formatTier (ev.tier) + '</div>' +
					'<div class="ccl-t-event-wordmark">CCL</div>' +
					'<h1 class="ccl-t-event-name">' + ev.name + '</h1>' +
					'<div class="ccl-t-event-venue">' + ev.venue + ' &middot; ' + ev.district + '</div>' +
					'<p class="ccl-t-event-tagline">' + ev.tagline + '</p>' +
					'<div class="ccl-t-event-meta-row">' +
						'<span>' + ev.entrantCount + ' Entrants</span>' +
						'<span class="ccl-t-sep">&middot;</span>' +
						'<span>' + ev.roundCount + ' Rounds</span>' +
						'<span class="ccl-t-sep">&middot;</span>' +
						'<span>Presented by ' + ev.organizer + '</span>' +
					'</div>' +
					lineBlock ('Caster Vale', cLine, 'commentator') +
					'<button class="ccl-t-cta" data-ccl-t-action="register">Register</button>' +
				'</div>' +
			'</div>'
		);
	}

	// ─── Screen: Registration ─────────────────────────────────────────────────────

	function showRegistration () {
		_state.screen = 'registration';
		const ev    = _state.event;
		const mLine = miraLine ('registration_support');
		const deckN = deckName ();
		const pName = playerName ();
		const prize = ev.rewards && ev.rewards.victory ? ev.rewards.victory.credits + ' Credits' : 'TBD';

		setScreen (
			'<div class="ccl-t-screen ccl-t-screen--registration">' +
				'<div class="ccl-t-reg-inner">' +
					'<div class="ccl-t-screen-kicker">Event Registration</div>' +
					'<h2 class="ccl-t-screen-title">' + ev.name + '</h2>' +
					'<div class="ccl-t-reg-grid">' +
						'<div class="ccl-t-reg-block"><div class="ccl-t-reg-label">Player</div><div class="ccl-t-reg-value">' + pName + '</div></div>' +
						'<div class="ccl-t-reg-block"><div class="ccl-t-reg-label">Deck</div><div class="ccl-t-reg-value">' + deckN + '</div></div>' +
						'<div class="ccl-t-reg-block"><div class="ccl-t-reg-label">Format</div><div class="ccl-t-reg-value">Single Elimination</div></div>' +
						'<div class="ccl-t-reg-block"><div class="ccl-t-reg-label">Entrants</div><div class="ccl-t-reg-value">' + ev.entrantCount + '</div></div>' +
						'<div class="ccl-t-reg-block"><div class="ccl-t-reg-label">Rounds</div><div class="ccl-t-reg-value">' + ev.roundCount + '</div></div>' +
						'<div class="ccl-t-reg-block"><div class="ccl-t-reg-label">Top Prize</div><div class="ccl-t-reg-value">' + prize + '</div></div>' +
					'</div>' +
					lineBlock ('Mira', mLine, 'mira') +
					'<button class="ccl-t-cta" data-ccl-t-action="confirm_registration">Confirm Registration</button>' +
				'</div>' +
			'</div>'
		);
	}

	// ─── Screen: Bracket Reveal ───────────────────────────────────────────────────

	function showBracketReveal () {
		_state.screen = 'bracket_reveal';
		const bracket = _state.bracket;
		const cLine   = commentatorLine ('bracket_reveal');
		const rLine   = rookLine ('bracket_reveal');
		const mLine   = miraLine ('bracket_reveal');
		const crowd   = crowdLine ();

		function slotHTML (slot) {
			const isPlayer = slot.isPlayer;
			const isRook   = slot.entrantId === 'rook';
			const inPath   = bracket.playerPath.some (function (p) { return p.opponentSlot === slot.slotId; });
			const tags     = [];
			if (isPlayer) { tags.push ('<span class="ccl-t-slot-you">YOU</span>'); }
			if (isRook)   { tags.push ('<span class="ccl-t-slot-seed">Seeded</span>'); tags.push ('<span class="ccl-t-slot-rival">Rival</span>'); }
			const cls = [
				'ccl-t-bracket-slot',
				isPlayer ? 'ccl-t-bracket-slot--player' : '',
				isRook   ? 'ccl-t-bracket-slot--rival'  : '',
				inPath   ? 'ccl-t-bracket-slot--path'   : ''
			].filter (Boolean).join (' ');

			return '<div class="' + cls + '">' +
				'<span class="ccl-t-slot-name">' + slot.name + '</span>' +
				(tags.length ? '<span class="ccl-t-slot-tags">' + tags.join ('') + '</span>' : '') +
			'</div>';
		}

		const leftSlots  = bracket.slots.slice (0, 4).map (slotHTML).join ('');
		const rightSlots = bracket.slots.slice (4, 8).map (slotHTML).join ('');

		setScreen (
			'<div class="ccl-t-screen ccl-t-screen--bracket">' +
				'<div class="ccl-t-bracket-inner">' +
					'<div class="ccl-t-screen-kicker">Bracket Reveal</div>' +
					'<h2 class="ccl-t-screen-title">' + _state.event.name + '</h2>' +
					lineBlock ('Caster Vale', cLine, 'commentator') +
					'<div class="ccl-t-bracket-grid">' +
						'<div class="ccl-t-bracket-half">' +
							'<div class="ccl-t-bracket-half-label">Your Side</div>' +
							leftSlots +
						'</div>' +
						'<div class="ccl-t-bracket-divider"></div>' +
						'<div class="ccl-t-bracket-half">' +
							'<div class="ccl-t-bracket-half-label">Opposite Side</div>' +
							rightSlots +
						'</div>' +
					'</div>' +
					lineBlock ('Rook', rLine, 'rook') +
					lineBlock ('Mira', mLine, 'mira') +
					(crowd ? '<div class="ccl-t-line-block ccl-t-line-block--crowd">' + crowd + '</div>' : '') +
					'<button class="ccl-t-cta" data-ccl-t-action="begin_round">Begin Round 1</button>' +
				'</div>' +
			'</div>'
		);
	}

	// ─── Screen: Match Card ───────────────────────────────────────────────────────

	function showMatchCard (roundPathEntry) {
		_state.screen        = 'match_card';
		_state.currentRound  = roundPathEntry;

		const opponent    = roundPathEntry.opponent;
		const opData      = opponent.authored || opponent;           // authored entrant or filler object
		const isFinal     = roundPathEntry.roundId === 'rook_round';
		const isFeature   = opData.isFeaturedMatch || isFinal;

		const roundDef    = _state.event.rounds.find (function (r) { return r.id === roundPathEntry.roundId; }) || {};
		const roundLabel  = roundDef.label || roundPathEntry.roundId;

		const mKey        = isFinal ? 'prematch_support_rook' : 'prematch_support_filler';
		const mLine       = miraLine (mKey);
		const cKey        = isFeature ? 'featured_match' : '';
		const cLine       = cKey ? commentatorLine (cKey, { featuredMatch: isFeature }).replace ('{{player.name}}', playerName ()) : '';
		const opLine      = pickRandom (opData.introLinePool || ['']);

		const pName = playerName ();
		const dName = deckName ();

		const buttonContainer = isFinal
			? '<button class="ccl-t-cta ccl-t-cta--featured" data-ccl-t-action="launch_battle">Start Feature Match</button>'
			: `
				<div class="ccl-t-button-row">
					<button class="ccl-t-cta" data-ccl-t-action="launch_battle">Play Match</button>
					<button class="ccl-t-cta ccl-t-cta--secondary" data-ccl-t-action="quick_win">Quick Match</button>
				</div>
			`;

		const portraitClass = opData.portraitKey ? `ccl-t-portrait--${opData.portraitKey}` : 'ccl-t-portrait--opponent';

		setScreen (
			'<div class="ccl-t-screen ccl-t-screen--matchcard' + (isFeature ? ' ccl-t-screen--featured' : '') + '">' +
				'<div class="ccl-t-matchcard-inner">' +
					'<div class="ccl-t-screen-kicker">' + roundLabel + (isFeature ? ' &middot; Featured Match' : '') + '</div>' +
					'<div class="ccl-t-vs-row">' +
						// Player side
						'<div class="ccl-t-vs-card ccl-t-vs-card--player">' +
							'<div class="ccl-t-portrait ccl-t-portrait--player">' + (pName[0] || 'P') + '</div>' +
							'<div class="ccl-t-vs-name">' + pName + '</div>' +
							'<div class="ccl-t-vs-meta">' + dName + '</div>' +
							'<div class="ccl-t-badges"><span class="ccl-t-badge" style="--badge-color:#2563eb">YOU</span></div>' +
						'</div>' +
						'<div class="ccl-t-vs-label">VS</div>' +
						// Opponent side
						'<div class="ccl-t-vs-card ccl-t-vs-card--opponent">' +
							'<div class="ccl-portrait ' + portraitClass + '">' + (opData.name ? opData.name[0] : '?') + '</div>' +
							'<div class="ccl-t-vs-name">' + opData.name + '</div>' +
							'<div class="ccl-t-vs-meta">' + (opData.district || '') + ' &middot; ' + (opData.deckArchetype || '') + '</div>' +
							'<div class="ccl-t-badges">' + renderBadges (opData.badgeTags || []) + '</div>' +
							'<div class="ccl-t-opponent-bio">' + (opData.bioText || '') + '</div>' +
						'</div>' +
					'</div>' +
					// Banter and support lines
					(opLine ? '<div class="ccl-t-line-block ccl-t-line-block--opponent">&#8220;' + opLine + '&#8221;</div>' : '') +
					lineBlock ('Mira', mLine, 'mira') +
					lineBlock ('Caster Vale', cLine, 'commentator') +
					buttonContainer +
				'</div>' +
			'</div>'
		);
	}

	// ─── Quick win (simulated filler round) ───────────────────────────────────────

	function handleQuickWin () {
		const round = _state.currentRound;
		_state.roundsCleared.push (round.roundId);
		_state.wins += 1;
		_state.roundIndex += 1;          // advance before lounge so it can preview next round
		showRoundResult (true, round, { credits: 10, simulated: true });
	}

	// ─── Screen: Round Result ─────────────────────────────────────────────────────

	function showRoundResult (playerWon, roundPathEntry, rewardInfo) {
		_state.screen = 'round_result';
		const roundDef   = _state.event.rounds.find (function (r) { return r.id === roundPathEntry.roundId; }) || {};
		const roundLabel = roundDef.label || roundPathEntry.roundId;
		const outcome    = playerWon ? 'Victory' : 'Defeat';
		const credits    = (rewardInfo && rewardInfo.credits) || 0;
		const cLine      = playerWon ? commentatorLine ('round_result_win') : commentatorLine ('round_result_loss');

		setScreen (
			'<div class="ccl-t-screen ccl-t-screen--result">' +
				'<div class="ccl-t-result-inner">' +
					'<div class="ccl-t-result-outcome ccl-t-result-outcome--' + (playerWon ? 'win' : 'loss') + '">' + outcome + '</div>' +
					'<div class="ccl-t-screen-kicker">' + roundLabel + ' Complete</div>' +
					'<div class="ccl-t-result-rewards">' +
						(credits > 0 ? '<div class="ccl-t-reward-chip">+' + credits + ' Credits</div>' : '') +
						'<div class="ccl-t-reward-chip">Round Cleared</div>' +
					'</div>' +
					lineBlock ('Caster Vale', cLine, 'commentator') +
					'<button class="ccl-t-cta" data-ccl-t-action="continue_result">Continue</button>' +
				'</div>' +
			'</div>'
		);
	}

	// ─── Screen: Between-Round Lounge ─────────────────────────────────────────────

	function showBetweenRoundLounge () {
		_state.screen    = 'lounge';
		const mLine      = miraLine ('between_round');
		const cLine      = commentatorLine ('lounge_filler');
		const crowd      = crowdLine ();
		const nextPath   = _state.bracket.playerPath[_state.roundIndex];
		const nextRound  = nextPath ? _state.event.rounds.find (function (r) { return r.id === nextPath.roundId; }) : null;
		const nextLabel  = nextRound ? nextRound.label : '';
		const nextOp     = nextPath ? (nextPath.opponent.authored || nextPath.opponent) : null;
		const nextOpName = nextOp ? nextOp.name : '—';

		setScreen (
			'<div class="ccl-t-screen ccl-t-screen--lounge">' +
				'<div class="ccl-t-lounge-inner">' +
					'<div class="ccl-t-screen-kicker">Between Rounds</div>' +
					'<h2 class="ccl-t-screen-title">Lounge</h2>' +
					'<div class="ccl-t-standing-row">' +
						'<div class="ccl-t-standing-chip"><span class="ccl-t-standing-label">Wins</span><span class="ccl-t-standing-value">' + _state.wins + '</span></div>' +
						'<div class="ccl-t-standing-chip"><span class="ccl-t-standing-label">Losses</span><span class="ccl-t-standing-value">' + _state.losses + '</span></div>' +
					'</div>' +
					lineBlock ('Mira', mLine, 'mira') +
					lineBlock ('Caster Vale', cLine, 'commentator') +
					(crowd ? '<div class="ccl-t-line-block ccl-t-line-block--crowd">' + crowd + '</div>' : '') +
					(nextPath ? '<div class="ccl-t-lounge-next"><div class="ccl-t-next-label">Up Next</div><div class="ccl-t-next-value">' + nextLabel + ' &mdash; vs ' + nextOpName + '</div></div>' : '') +
					'<button class="ccl-t-cta" data-ccl-t-action="continue_lounge">Continue</button>' +
				'</div>' +
			'</div>'
		);
	}

	// ─── Begin Round (from bracket reveal) ───────────────────────────────────────

	function beginRound () {
		const roundEntry = _state.bracket.playerPath[_state.roundIndex];
		if (roundEntry) {
			showMatchCard (roundEntry);
		}
	}

	// ─── Continue from lounge ─────────────────────────────────────────────────────

	function continueFromLounge () {
		const roundEntry = _state.bracket.playerPath[_state.roundIndex];
		if (roundEntry) {
			showMatchCard (roundEntry);
		}
	}

	// ─── Launch battle (Rook or Filler) ──────────────────────────────────────────
	function launchBattle () {
		const round = _state.currentRound;
		const opponent = round.opponent.authored || round.opponent;
		const isFinal = round.roundId === 'rook_round';

		const battleId = opponent.battleId || (isFinal ? 'harbor_city_rook' : 'harbor_city_filler');
		const playerDeckId = window.CCLProgressionState.getSelectedDeckId ();

		window.CardBattleBridge.startBattle (battleId, {
			playerDeckId: playerDeckId,
			enemyDeckId:  opponent.deckId || 'starter_tide',
			storyContext: { mentor: 'mira', rival: opponent.id || 'filler' }
		}).then (function (result) {
			handleBattleResult (result);
		}).catch (function () {
			// Fallback: treat as player loss
			handleBattleResult ({
				winner: 'enemy',
				battleId: battleId,
				rewards: { credits: 5, cards: [], packs: [], items: [] },
				affinityChanges: {},
				storyFlags: [],
				score: { playerPoints: 0, enemyPoints: 3 }
			});
		});
	}

	// ─── Handle battle result ────────────────────────────────────────────────────
	function handleBattleResult (result) {
		const playerWon = result.winner === 'player';
		const round = _state.currentRound;

		if (playerWon) {
			_state.wins += 1;
			_state.roundsCleared.push (round.roundId);
		} else {
			_state.losses += 1;
		}

		_state.battleResult = result;
		_state.roundIndex += 1; // Advance after match

		applyTournamentProgressionChanges (result, playerWon);

		if (round.roundId === 'rook_round') {
			showFinalResult (playerWon, result.rewards || {});
		} else {
			showRoundResult (playerWon, round, result.rewards || {});
		}
	}

	// ─── Apply progression changes after final battle ─────────────────────────────

	function applyTournamentProgressionChanges (battleResult, playerWon) {
		const ev           = _state.event;
		const roundRewards = playerWon ? ev.rewards.victory : ev.rewards.defeat;

		// Merge event rewards with whatever the battle system already included,
		// prioritising the event table for credits/cards.
		const mergedRewards = Object.assign (
			{ credits: 0, cards: [], packs: [], items: [] },
			battleResult.rewards || {},
			roundRewards
		);

		const fullResult = Object.assign ({}, battleResult, {
			rewards:          mergedRewards,
			nextScene:        playerWon ? ev.victoryScene : ev.defeatScene,
			tournamentUpdate: {
				tournamentId: ev.id,
				roundCleared: _state.currentRound.roundId,
				nextRoundId:  _state.currentRound.nextRoundId,
				eliminated:   !playerWon,
				champion:     playerWon && _state.currentRound.roundId === 'rook_round'
			}
		});

		window.CCLProgressionState.applyBattleResult (fullResult);

		// Tournament relationship variable changes (Task Group E §6)
		if (typeof window.CCLProgressionState.applyRelationshipPatch === 'function') {
			window.CCLProgressionState.applyRelationshipPatch ({
				miraTrust:    10,
				rookHeat:     playerWon ? -5 : 10,
				tournamentRep: playerWon ? 20 : 5,
				crowdFavor:   playerWon ? 15 : 5
			});
		}

		_state.nextScene = fullResult.nextScene;
	}

	// ─── Screen: Final Result ─────────────────────────────────────────────────────

	function showFinalResult (playerWon, rewards) {
		_state.screen = 'final_result';
		const outcome   = playerWon ? 'Victory' : 'Defeat';
		const placement = playerWon ? 'Champion' : 'Finalist';
		const credits   = (rewards && rewards.credits) || 0;
		const hasCard   = rewards && rewards.cards && rewards.cards.length > 0;
		const mLine     = miraLine (playerWon ? 'post_rook_win' : 'post_rook_loss');
		const rLine     = rookLine (playerWon ? 'post_win' : 'post_loss');
		const cLine     = commentatorLine (playerWon ? 'round_result_win' : 'round_result_loss');

		setScreen (
			'<div class="ccl-t-screen ccl-t-screen--result ccl-t-screen--final">' +
				'<div class="ccl-t-result-inner">' +
					'<div class="ccl-t-result-outcome ccl-t-result-outcome--' + (playerWon ? 'win' : 'loss') + '">' + outcome + '</div>' +
					'<div class="ccl-t-screen-kicker">Harbor City Open &mdash; Finals Complete</div>' +
					'<div class="ccl-t-result-placement">' + placement + '</div>' +
					'<div class="ccl-t-result-rewards">' +
						(credits > 0 ? '<div class="ccl-t-reward-chip">+' + credits + ' Credits</div>' : '') +
						(hasCard    ? '<div class="ccl-t-reward-chip">Card Reward</div>' : '') +
						(function () {
							const bKey = playerWon ? 'champion' : 'finalist';
							const bDef = window.CCLTournamentFlavor.BADGE_DISPLAY[bKey];
							return '<div class="ccl-t-reward-chip" style="background:' + bDef.color + '22; border-color:' + bDef.color + '; color:' + bDef.color + '">' + bDef.label + ' Badge</div>';
						})() +
					'</div>' +
					lineBlock ('Rook', rLine, 'rook') +
					lineBlock ('Mira', mLine, 'mira') +
					lineBlock ('Caster Vale', cLine, 'commentator') +
					'<button class="ccl-t-cta" data-ccl-t-action="close_summary">Continue Story</button>' +
				'</div>' +
			'</div>'
		);
	}

	// ─── Close overlay and hand back to story ─────────────────────────────────────

	function closeSummary () {
		const scene = _state.nextScene;
		hideOverlay ();

		if (scene && window.monogatari) {
			try {
				if (typeof window.monogatari.run === 'function') {
					window.monogatari.run ('jump ' + scene);
				} else if (typeof window.monogatari.jump === 'function') {
					window.monogatari.jump (scene);
				}
			} catch (e) {
				// let the promise resolver carry the result in case jump is unavailable
			}
		}

		if (_resolveRun) {
			_resolveRun ({ placement: _state.wins >= 3 ? 1 : 2, scene: scene });
			_resolveRun = null;
		}
	}

	// ─── Public API: runEvent ─────────────────────────────────────────────────────

	function runEvent (eventId) {
		return new Promise (function (resolve) {
			_resolveRun = resolve;

			const eventData = window.CCLTournamentData.EVENTS[eventId];
			if (!eventData) {
				resolve ({ error: 'unknown_event', eventId: eventId });
				return;
			}

			const progressionState = window.CCLProgressionState.getState ();
			const historyTags      = (progressionState.tournamentHistory || []).map (function (h) { return h.fillerIds || []; }).flat ();
			const filler           = window.CCLTournamentData.selectFillerForEvent (6, historyTags);
			const pName            = playerName ();
			const bracket          = window.CCLTournamentData.buildBracket (eventId, pName, filler);

			_state = {
				event:        eventData,
				bracket:      bracket,
				screen:       null,
				currentRound: null,
				roundIndex:   0,
				wins:         0,
				losses:       0,
				roundsCleared: [],
				battleResult: null,
				nextScene:    null
			};

			showOverlay ();
			showEventSplash ();
		});
	}

	window.CCLTournamentEngine = { runEvent: runEvent };
}) ();
