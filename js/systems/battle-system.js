/* global window */

(function () {
	const ENERGY_TYPES = ['fire', 'water', 'electric', 'wind', 'metal', 'colorless'];
	const PHASES = {
		DRAW: 'draw',
		MAIN: 'main',
		ATTACK: 'attack',
		END: 'end'
	};

	function clone (value) {
		return JSON.parse (JSON.stringify (value));
	}

	function shuffle (list) {
		const copy = list.slice ();

		for (let index = copy.length - 1; index > 0; index--) {
			const swapIndex = Math.floor (Math.random () * (index + 1));
			const current = copy[index];
			copy[index] = copy[swapIndex];
			copy[swapIndex] = current;
		}

		return copy;
	}

	function energyPool () {
		return { fire: 0, water: 0, electric: 0, wind: 0, metal: 0, colorless: 0 };
	}

	function freshTurnFlags () {
		return {
			energyAttached: false,
			supportPlayed: false,
			retreated: false,
			attacked: false
		};
	}

	function getCard (cardId) {
		return window.CCLData.cards[cardId];
	}

	function getDeck (deckId) {
		return window.CCLData.decks[deckId];
	}

	function totalEnergy (attachedEnergy) {
		return Object.values (attachedEnergy || {}).reduce ((sum, value) => sum + value, 0);
	}

	function createInstance (cardId, ownerId, serial) {
		const definition = getCard (cardId);
		return {
			instanceId: `${ownerId}_${cardId}_${serial}`,
			cardId,
			cardType: definition.type,
			currentHp: definition.type === 'battler' ? definition.hp : null,
			attachedEnergy: definition.type === 'battler' ? energyPool () : null,
			statuses: [],
			buffs: []
		};
	}

	function escapeHtml (value) {
		return String (value)
			.replace (/&/g, '&amp;')
			.replace (/</g, '&lt;')
			.replace (/>/g, '&gt;')
			.replace (/"/g, '&quot;')
			.replace (/'/g, '&#39;');
	}

	function formatEnergy (attachedEnergy) {
		if (!attachedEnergy) {
			return 'No energy';
		}

		return Object.entries (attachedEnergy)
			.filter (([, amount]) => amount > 0)
			.map (([type, amount]) => `${type}:${amount}`)
			.join (' ') || 'No energy';
	}

	function formatCost (cost) {
		return Object.entries (cost || {})
			.map (([type, amount]) => `${amount} ${type}`)
			.join (' + ');
	}

	class CCLBattleSystem {
		constructor () {
			this.root = null;
			this.state = null;
			this.resolveResult = null;
			this.statusTargetId = null;
			this.lastResult = null;
			this.inspectedInstanceId = null;
		}

		ensureRoot () {
			if (!this.root) {
				this.root = document.createElement ('div');
				this.root.id = 'ccl-battle-root';
				this.root.hidden = true;
				document.body.appendChild (this.root);
			}
		}

		start ({ battleId, statusTargetId = null, playerDeckId = null, launchContext = null }) {
			if (this.resolveResult) {
				return Promise.reject (new Error ('Battle already active.'));
			}

			this.ensureRoot ();
			this.statusTargetId = statusTargetId;
			this.state = this.createBattleState ({ battleId, playerDeckId, launchContext });
			this.lastResult = null;
			this.inspectedInstanceId = this.state.player.active ? this.state.player.active.instanceId : null;
			this.root.hidden = false;
			document.body.classList.add ('battle-open');
			window.CCLBattleHooks.run (this, 'onBattleStart', { battleId });
			this.render ();
			this.startTurn ('player', true);

			return new Promise ((resolve) => {
				this.resolveResult = resolve;
			});
		}

		createBattleState ({ battleId, playerDeckId, launchContext }) {
			const battle = window.CCLData.battles[battleId];
			const context = launchContext || {
				battleId,
				playerDeckId: playerDeckId || battle.playerDeckId,
				enemyDeckId: battle.enemyDeckId,
				tournamentId: battle.tournamentId,
				roundId: battle.roundId,
				opponentId: battle.opponentId,
				storyContext: {
					mentor: 'mira',
					rival: battle.opponentId
				}
			};
			const playerDeck = getDeck (context.playerDeckId || battle.playerDeckId);
			const enemyDeck = getDeck (context.enemyDeckId || battle.enemyDeckId);
			const state = {
				battleId,
				label: battle.label,
				launchContext: context,
				turn: 1,
				currentPlayer: 'player',
				phase: PHASES.DRAW,
				winner: null,
				log: [],
				pendingAction: null,
				awaitingPromotion: null,
				stats: {
					turns: 1,
					playerKOs: 0,
					enemyKOs: 0,
					supportsPlayed: 0,
					statusesApplied: 0
				},
				player: this.createSide ('player', 'You', playerDeck),
				enemy: this.createSide ('enemy', window.CCLData.rivals[battle.opponentId].name, enemyDeck)
			};

			this.draw (state.player, 5);
			this.draw (state.enemy, 5);
			this.setupOpeningBattler (state.player);
			this.setupOpeningBattler (state.enemy);
			state.log.unshift (`${battle.label} begins.`);
			window.CCLBattleHooks.run (this, 'onOpeningSetup', { battleId });
			return state;
		}

		createSide (id, name, deckDefinition) {
			return {
				id,
				name,
				deckId: deckDefinition.id,
				deckName: deckDefinition.name,
				energyTypes: deckDefinition.energyTypes.slice (),
				selectedEnergyType: deckDefinition.energyTypes[0],
				deck: shuffle (deckDefinition.cards).map ((cardId, index) => createInstance (cardId, id, index + 1)),
				hand: [],
				discard: [],
				active: null,
				bench: [],
				points: 0,
				turnFlags: freshTurnFlags ()
			};
		}

		setupOpeningBattler (side) {
			while (!side.hand.some ((entry) => entry.cardType === 'battler') && side.deck.length > 0) {
				this.draw (side, 1);
			}

			const openingIndex = side.hand.findIndex ((entry) => entry.cardType === 'battler');
			if (openingIndex > -1) {
				side.active = side.hand.splice (openingIndex, 1)[0];
			}
		}

		draw (side, count) {
			for (let draws = 0; draws < count && side.deck.length > 0; draws++) {
				side.hand.push (side.deck.shift ());
			}
		}

		pushLogLine (line) {
			this.state.log.unshift (line);
			this.state.log = this.state.log.slice (0, 16);
		}

		side (id) {
			return this.state[id];
		}

		opponentId (id) {
			return id === 'player' ? 'enemy' : 'player';
		}

		opponent (id) {
			return this.side (this.opponentId (id));
		}

		findInstance (instanceId) {
			if (!this.state || !instanceId) {
				return null;
			}

			for (const sideId of ['player', 'enemy']) {
				const side = this.side (sideId);
				const entries = [
					{ sideId, zone: 'active', battler: side.active },
					...side.bench.map ((battler, index) => ({ sideId, zone: 'bench', index, battler })),
					...side.hand.map ((battler, index) => ({ sideId, zone: 'hand', index, battler })),
					...side.discard.map ((battler, index) => ({ sideId, zone: 'discard', index, battler }))
				];

				for (const entry of entries) {
					if (entry.battler && entry.battler.instanceId === instanceId) {
						return entry;
					}
				}
			}

			return null;
		}

		inspect (instanceId) {
			if (this.findInstance (instanceId)) {
				this.inspectedInstanceId = instanceId;
				this.render ();
			}
		}

		setPhase (phase) {
			this.state.phase = phase;
		}

		getStatusDefinition (statusId) {
			return window.CCLData.statuses[statusId];
		}

		hasStatus (battler, statusId) {
			return Boolean (battler && battler.statuses.some ((status) => status.statusId === statusId));
		}

		hasBlockingStatus (battler, actionName) {
			if (!battler) {
				return false;
			}

			return battler.statuses.some ((status) => {
				const definition = this.getStatusDefinition (status.statusId);
				return definition && definition.blockedActions.indexOf (actionName) > -1;
			});
		}

		addStatus (battler, ownerId, statusId, meta = {}) {
			if (!battler) {
				return;
			}

			const definition = this.getStatusDefinition (statusId);
			if (!definition) {
				return;
			}

			const existing = battler.statuses.find ((status) => status.statusId === statusId);
			if (existing) {
				existing.turnsRemaining = Math.max (existing.turnsRemaining, meta.turnsRemaining || definition.defaultTurns);
				return;
			}

			battler.statuses.push ({
				statusId,
				ownerId,
				turnsRemaining: meta.turnsRemaining || definition.defaultTurns,
				meta
			});
			this.state.stats.statusesApplied += 1;
		}

		removeStatus (battler, statusId) {
			if (battler) {
				battler.statuses = battler.statuses.filter ((status) => status.statusId !== statusId);
			}
		}

		clearStatuses (battler) {
			if (battler) {
				battler.statuses = [];
				battler.buffs = [];
			}
		}

		getAttackBonus (battler) {
			return (battler && battler.buffs || []).reduce ((sum, buff) => sum + (buff.attackBonus || 0), 0);
		}

		hasGuarded (battler) {
			return this.hasStatus (battler, 'guarded');
		}

		consumeGuarded (battler) {
			if (!battler || !this.hasGuarded (battler)) {
				return 0;
			}

			this.removeStatus (battler, 'guarded');
			return 20;
		}

		setEnergyType (value) {
			this.side ('player').selectedEnergyType = value;
			this.render ();
		}

		isPlayerActionLocked () {
			return Boolean (this.state.winner || this.state.awaitingPromotion === 'player');
		}

		startTurn (sideId, skipDraw) {
			if (this.state.winner) {
				return;
			}

			const side = this.side (sideId);
			this.state.currentPlayer = sideId;
			side.turnFlags = freshTurnFlags ();
			this.state.pendingAction = null;
			this.setPhase (PHASES.DRAW);
			window.CCLBattleHooks.run (this, 'onTurnStart', { sideId });

			if (!skipDraw) {
				this.draw (side, 1);
				this.pushLogLine (`${side.name} draws a card.`);
				window.CCLBattleHooks.run (this, 'onDrawStep', { sideId });
			}

			if (!side.active && side.bench.length > 0 && this.state.awaitingPromotion !== sideId) {
				this.promoteFromBench (sideId, 0, true);
			}

			this.setPhase (PHASES.MAIN);
			window.CCLBattleHooks.run (this, 'onMainPhaseStart', { sideId });

			if (sideId === 'player') {
				this.state.stats.turns = this.state.turn;
			}

			this.render ();

			if (sideId === 'enemy') {
				window.setTimeout (() => this.runEnemyTurn (), 650);
			}
		}

		endTurn () {
			if (this.state.winner) {
				return;
			}

			window.CCLBattleHooks.run (this, 'onTurnEnd', { sideId: this.state.currentPlayer });
			if (this.state.winner) {
				return;
			}

			this.setPhase (PHASES.END);

			if (this.state.currentPlayer === 'player') {
				this.startTurn ('enemy', false);
			} else {
				this.state.turn += 1;
				this.startTurn ('player', false);
			}
		}

		canAffordAttack (battler, attack) {
			if (!battler || !attack) {
				return false;
			}

			let specific = 0;

			for (const [type, amount] of Object.entries (attack.cost || {})) {
				if (type === 'colorless') {
					continue;
				}

				if ((battler.attachedEnergy[type] || 0) < amount) {
					return false;
				}

				specific += amount;
			}

			return totalEnergy (battler.attachedEnergy) >= specific + (attack.cost.colorless || 0);
		}

		spendEnergy (battler, amount) {
			for (const type of ENERGY_TYPES) {
				while (amount > 0 && battler.attachedEnergy[type] > 0) {
					battler.attachedEnergy[type] -= 1;
					amount -= 1;
				}
			}
		}

		playBench (instanceId, sideId = 'player') {
			const side = this.side (sideId);
			const index = side.hand.findIndex ((entry) => entry.instanceId === instanceId && entry.cardType === 'battler');

			if (this.state.currentPlayer !== sideId || this.state.phase !== PHASES.MAIN || index === -1 || side.bench.length >= 3 || this.state.awaitingPromotion === sideId) {
				return false;
			}

			const battler = side.hand.splice (index, 1)[0];
			side.bench.push (battler);
			this.pushLogLine (`${sideId === 'player' ? 'You' : side.name} bench${sideId === 'player' ? '' : 'es'} ${getCard (battler.cardId).name}.`);
			this.render ();
			return true;
		}

		attachEnergy (target, benchIndex, sideId = 'player') {
			const side = this.side (sideId);

			if (this.state.currentPlayer !== sideId || this.state.phase !== PHASES.MAIN || side.turnFlags.energyAttached || this.state.winner || this.state.awaitingPromotion === sideId) {
				return false;
			}

			const battler = target === 'active' ? side.active : side.bench[benchIndex];
			if (!battler) {
				return false;
			}

			battler.attachedEnergy[side.selectedEnergyType] += 1;
			side.turnFlags.energyAttached = true;
			this.pushLogLine (`${sideId === 'player' ? 'You' : side.name} attach${sideId === 'player' ? '' : 'es'} ${side.selectedEnergyType} energy to ${getCard (battler.cardId).name}.`);
			window.CCLBattleHooks.run (this, 'onEnergyAttach', { sideId, target, benchIndex });
			this.render ();
			return true;
		}

		retreat (benchIndex, sideId = 'player', fromSupport = false) {
			const side = this.side (sideId);

			if (this.state.currentPlayer !== sideId || this.state.phase !== PHASES.MAIN || !side.active || !side.bench[benchIndex] || this.state.winner) {
				return false;
			}

			if (!fromSupport && side.turnFlags.retreated) {
				return false;
			}

			if (this.hasBlockingStatus (side.active, 'retreat')) {
				this.pushLogLine (`${getCard (side.active.cardId).name} cannot retreat right now.`);
				this.render ();
				return false;
			}

			const retreatCost = getCard (side.active.cardId).retreatCost;
			if (!fromSupport && totalEnergy (side.active.attachedEnergy) < retreatCost) {
				return false;
			}

			if (!fromSupport) {
				this.spendEnergy (side.active, retreatCost);
				side.turnFlags.retreated = true;
			}

			const previousActive = side.active;
			side.active = side.bench[benchIndex];
			side.bench[benchIndex] = previousActive;
			this.pushLogLine (`${sideId === 'player' ? 'You retreat' : `${side.name} retreats`} into ${getCard (side.active.cardId).name}.`);
			window.CCLBattleHooks.run (this, 'onRetreat', { sideId, benchIndex, fromSupport });
			this.render ();
			return true;
		}

		attack (attackIndex, sideId = 'player') {
			if (this.state.currentPlayer !== sideId || this.state.phase !== PHASES.MAIN || this.state.winner || this.state.awaitingPromotion === sideId) {
				return false;
			}

			const side = this.side (sideId);
			if (side.turnFlags.attacked || !side.active) {
				return false;
			}

			if (this.hasBlockingStatus (side.active, 'attack')) {
				this.pushLogLine (`${getCard (side.active.cardId).name} is stunned and cannot attack.`);
				this.render ();
				return false;
			}

			this.resolveAttack (sideId, attackIndex);
			return true;
		}

		resolveAttack (attackerId, attackIndex) {
			const attacker = this.side (attackerId);
			const defender = this.opponent (attackerId);
			const attack = getCard (attacker.active.cardId).attacks[attackIndex];

			if (!attack || !this.canAffordAttack (attacker.active, attack)) {
				return;
			}

			this.setPhase (PHASES.ATTACK);
			attacker.turnFlags.attacked = true;
			window.CCLBattleHooks.run (this, 'onAttackDeclare', { attackerId, attackId: attack.id });

			const baseDamage = attack.baseDamage + this.getAttackBonus (attacker.active);
			const prevented = this.hasGuarded (defender.active) ? this.consumeGuarded (defender.active) : 0;
			const dealtDamage = Math.max (0, baseDamage - prevented);
			defender.active.currentHp = Math.max (0, defender.active.currentHp - dealtDamage);
			attacker.active.buffs = attacker.active.buffs.filter ((buff) => buff.expires !== 'turn_end');
			this.pushLogLine (`${attacker.name} uses ${attack.name} for ${dealtDamage} damage${prevented ? ` (${prevented} blocked)` : ''}.`);
			window.CCLBattleHooks.run (this, 'onDamageDealt', {
				attackerId,
				defenderId: this.opponentId (attackerId),
				damage: dealtDamage,
				attackId: attack.id
			});

			if (defender.active.currentHp <= 0) {
				this.handleKnockout (attackerId);
			}

			this.render ();

			if (!this.state.winner && !this.state.awaitingPromotion) {
				this.endTurn ();
			}
		}

		handleKnockout (attackerId) {
			const attacker = this.side (attackerId);
			const defenderId = this.opponentId (attackerId);
			const defender = this.side (defenderId);
			const knockedOut = defender.active;
			const knockedOutName = getCard (knockedOut.cardId).name;

			attacker.points += 1;
			this.clearStatuses (knockedOut);
			defender.discard.push (knockedOut);
			defender.active = null;

			if (attackerId === 'player') {
				this.state.stats.playerKOs += 1;
			} else {
				this.state.stats.enemyKOs += 1;
			}

			this.pushLogLine (`${knockedOutName} is knocked out. ${attacker.name} reaches ${attacker.points} point(s).`);
			window.CCLBattleHooks.run (this, 'onKO', { attackerId, knockedOutSideId: defenderId, knockedOutCardId: knockedOut.cardId });

			if (attacker.points >= 3 || defender.bench.length === 0) {
				this.finish (attackerId);
				return;
			}

			if (defenderId === 'player') {
				this.state.awaitingPromotion = 'player';
				this.pushLogLine ('Choose your next active battler.');
			} else {
				this.state.awaitingPromotion = 'enemy';
				this.promoteFromBench ('enemy', this.chooseBestPromotionIndex ('enemy'), true);
			}
		}

		promoteFromBench (sideId, benchIndex, automatic) {
			const side = this.side (sideId);

			if (!side.bench[benchIndex]) {
				return false;
			}

			side.active = side.bench.splice (benchIndex, 1)[0];
			this.state.awaitingPromotion = null;
			this.pushLogLine (`${sideId === 'player' ? 'You promote' : `${side.name} promotes`} ${getCard (side.active.cardId).name}.`);
			window.CCLBattleHooks.run (this, 'onPromote', { sideId, automatic });
			this.render ();
			return true;
		}

		chooseBestPromotionIndex (sideId) {
			const side = this.side (sideId);
			let bestIndex = 0;
			let bestScore = -Infinity;

			side.bench.forEach ((entry, index) => {
				const definition = getCard (entry.cardId);
				const highestAttack = definition.attacks.reduce ((max, attack) => Math.max (max, attack.baseDamage), 0);
				const score = entry.currentHp + highestAttack + totalEnergy (entry.attachedEnergy);
				if (score > bestScore) {
					bestScore = score;
					bestIndex = index;
				}
			});

			return bestIndex;
		}

		cancelPendingAction () {
			this.state.pendingAction = null;
			this.render ();
		}

		getValidSupportTargets (sideId, supportDefinition) {
			const side = this.side (sideId);
			const enemy = this.opponent (sideId);

			switch (supportDefinition.target) {
			case 'none':
				return [];
			case 'ally_any':
				return [
					side.active ? { sideId, zone: 'active' } : null,
					...side.bench.map ((entry, index) => ({ sideId, zone: 'bench', index }))
				].filter (Boolean);
			case 'ally_bench':
				return side.bench.map ((entry, index) => ({ sideId, zone: 'bench', index }));
			case 'enemy_active':
				return enemy.active ? [{ sideId: this.opponentId (sideId), zone: 'active' }] : [];
			default:
				return [];
			}
		}

		beginSupportPlay (instanceId, sideId = 'player') {
			const side = this.side (sideId);
			const supportInstance = side.hand.find ((entry) => entry.instanceId === instanceId && entry.cardType === 'support');

			if (!supportInstance || this.state.currentPlayer !== sideId || this.state.phase !== PHASES.MAIN || side.turnFlags.supportPlayed || this.state.awaitingPromotion === sideId) {
				return false;
			}

			const supportDefinition = getCard (supportInstance.cardId);
			const validTargets = this.getValidSupportTargets (sideId, supportDefinition);

			if (!this.validateSupportPlay (sideId, supportInstance, validTargets)) {
				return false;
			}

			if (!validTargets.length) {
				return this.resolveSupportCard (sideId, instanceId, null);
			}

			this.state.pendingAction = {
				type: 'support',
				instanceId,
				validTargets
			};
			this.render ();
			return true;
		}

		validateSupportPlay (sideId, supportInstance, validTargets) {
			const side = this.side (sideId);
			return side.turnFlags.supportPlayed === false
				&& this.state.phase === PHASES.MAIN
				&& this.state.currentPlayer === sideId
				&& supportInstance.cardType === 'support'
				&& (validTargets.length > 0 || getCard (supportInstance.cardId).target === 'none');
		}

		playSupportTarget (zone, index, sideId) {
			if (!this.state.pendingAction || this.state.pendingAction.type !== 'support') {
				return false;
			}

			const valid = this.state.pendingAction.validTargets.some ((target) => (
				target.sideId === sideId
				&& target.zone === zone
				&& Number (target.index) === Number (index)
			));

			if (!valid) {
				return false;
			}

			return this.resolveSupportCard ('player', this.state.pendingAction.instanceId, { sideId, zone, index });
		}

		resolveSupportCard (sideId, instanceId, targetRef) {
			const side = this.side (sideId);
			const handIndex = side.hand.findIndex ((entry) => entry.instanceId === instanceId && entry.cardType === 'support');

			if (handIndex === -1) {
				return false;
			}

			const supportInstance = side.hand.splice (handIndex, 1)[0];
			const supportDefinition = getCard (supportInstance.cardId);
			const context = window.CCLBattleHooks.createContext ('supportResolve', {
				sideId,
				supportId: supportDefinition.id,
				targetRef
			});

			window.CCLBattleHooks.queueEffect (context, {
				kind: 'support',
				sideId,
				supportId: supportDefinition.id,
				targetRef
			});
			window.CCLBattleHooks.flush (this, context);
			side.discard.push (supportInstance);
			side.turnFlags.supportPlayed = true;
			this.state.stats.supportsPlayed += 1;
			this.state.pendingAction = null;
			this.render ();
			return true;
		}

		handleHook (context) {
			const sideId = context.payload.sideId;

			if (context.hookName === 'onTurnEnd' && sideId) {
				this.queueStatusTickEffects (context, sideId);
			}

			if (context.hookName === 'onBattleEnd') {
				window.CCLBattleHooks.emitLog (context, 'Battle complete.');
			}
		}

		queueStatusTickEffects (context, sideId) {
			const side = this.side (sideId);
			[side.active].concat (side.bench).filter (Boolean).forEach ((battler) => {
				battler.statuses.forEach ((status) => {
					const definition = this.getStatusDefinition (status.statusId);
					if (!definition || status.ownerId !== sideId || definition.durationPhase !== 'turn_end') {
						return;
					}

					if (status.statusId === 'burn') {
						window.CCLBattleHooks.queueEffect (context, {
							kind: 'damage',
							sideId,
							targetRef: this.findBattlerRef (battler.instanceId),
							amount: 10,
							line: `${getCard (battler.cardId).name} takes 10 burn damage.`
						});
					}

					window.CCLBattleHooks.queueEffect (context, {
						kind: 'decrement_status',
						targetRef: this.findBattlerRef (battler.instanceId),
						statusId: status.statusId
					});
				});

				battler.buffs = battler.buffs.filter ((buff) => buff.expires !== 'turn_end');
			});
		}

		findBattlerRef (instanceId) {
			const match = this.findInstance (instanceId);
			return match ? { sideId: match.sideId, zone: match.zone, index: match.index } : null;
		}

		getTargetBattler (targetRef) {
			if (!targetRef) {
				return null;
			}

			const side = this.side (targetRef.sideId);
			if (targetRef.zone === 'active') {
				return side.active;
			}

			if (targetRef.zone === 'bench') {
				return side.bench[targetRef.index];
			}

			return null;
		}

		applyQueuedEffect (effect, context) {
			if (effect.kind === 'support') {
				this.applySupportEffect (effect.sideId, effect.supportId, effect.targetRef, context);
				return;
			}

			if (effect.kind === 'damage') {
				const target = this.getTargetBattler (effect.targetRef);
				if (!target) {
					return;
				}

				target.currentHp = Math.max (0, target.currentHp - effect.amount);
				if (effect.line) {
					window.CCLBattleHooks.emitLog (context, effect.line);
				}

				if (target.currentHp <= 0) {
					this.handleKnockout (this.opponentId (effect.sideId));
				}
				return;
			}

			if (effect.kind === 'decrement_status') {
				const target = this.getTargetBattler (effect.targetRef);
				if (!target) {
					return;
				}

				target.statuses = target.statuses.reduce ((next, status) => {
					if (status.statusId !== effect.statusId) {
						next.push (status);
						return next;
					}

					const remaining = status.turnsRemaining - 1;
					if (remaining > 0) {
						next.push ({ ...status, turnsRemaining: remaining });
					} else {
						window.CCLBattleHooks.emitLog (context, `${getCard (target.cardId).name} is no longer ${this.getStatusDefinition (status.statusId).label}.`);
					}
					return next;
				}, []);
			}
		}

		applySupportEffect (sideId, supportId, targetRef, context) {
			const support = getCard (supportId);
			const side = this.side (sideId);
			const target = this.getTargetBattler (targetRef);

			switch (support.effect.kind) {
			case 'draw':
				this.draw (side, support.effect.amount);
				window.CCLBattleHooks.emitLog (context, `${sideId === 'player' ? 'You play' : side.name + ' plays'} ${support.name} and draw ${support.effect.amount}.`);
				break;
			case 'heal':
				if (target) {
					target.currentHp = Math.min (getCard (target.cardId).hp, target.currentHp + support.effect.amount);
					window.CCLBattleHooks.emitLog (context, `${support.name} heals ${getCard (target.cardId).name} for ${support.effect.amount}.`);
				}
				break;
			case 'buff':
				if (target) {
					target.buffs.push ({
						attackBonus: support.effect.attackBonus,
						expires: support.effect.expires || 'turn_end'
					});
					window.CCLBattleHooks.emitLog (context, `${support.name} gives ${getCard (target.cardId).name} +${support.effect.attackBonus} damage this turn.`);
				}
				break;
			case 'swap':
				if (targetRef && targetRef.zone === 'bench' && targetRef.sideId === sideId) {
					this.retreat (targetRef.index, sideId, true);
					window.CCLBattleHooks.emitLog (context, `${support.name} repositions the active battler without spending your retreat.`);
				}
				break;
			case 'status':
				if (target) {
					this.addStatus (target, targetRef.sideId, support.effect.statusId);
					window.CCLBattleHooks.emitLog (context, `${support.name} applies ${this.getStatusDefinition (support.effect.statusId).label} to ${getCard (target.cardId).name}.`);
				}
				break;
			default:
				break;
			}
		}

		listAIOptions (sideId) {
			const side = this.side (sideId);
			const enemy = this.opponent (sideId);
			const options = [];

			if (!side.active && side.bench.length > 0) {
				side.bench.forEach ((entry, index) => {
					options.push ({
						type: 'promote',
						benchIndex: index,
						score: entry.currentHp + getCard (entry.cardId).attacks[0].baseDamage + 30,
						reason: 'Need an active battler'
					});
				});
				return options;
			}

			if (side.bench.length < 3) {
				side.hand.forEach ((entry) => {
					if (entry.cardType === 'battler') {
						options.push ({
							type: 'bench',
							instanceId: entry.instanceId,
							score: 30 + getCard (entry.cardId).hp,
							reason: 'Fill the bench'
						});
					}
				});
			}

			if (!side.turnFlags.supportPlayed) {
				side.hand.forEach ((entry) => {
					if (entry.cardType !== 'support') {
						return;
					}

					const support = getCard (entry.cardId);
					const validTargets = this.getValidSupportTargets (sideId, support);

					if (!this.validateSupportPlay (sideId, entry, validTargets)) {
						return;
					}

					if (support.effect.kind === 'draw') {
						options.push ({ type: 'support', instanceId: entry.instanceId, targetRef: null, score: 35, reason: 'Refill hand' });
					}

					if (support.effect.kind === 'status' && support.effect.statusId === 'stun' && enemy.active && !this.hasStatus (enemy.active, 'stun')) {
						options.push ({ type: 'support', instanceId: entry.instanceId, targetRef: { sideId: this.opponentId (sideId), zone: 'active' }, score: 95, reason: 'Shut off enemy turn' });
					}

					if (support.effect.kind === 'status' && support.effect.statusId === 'burn' && enemy.active && !this.hasStatus (enemy.active, 'burn')) {
						options.push ({ type: 'support', instanceId: entry.instanceId, targetRef: { sideId: this.opponentId (sideId), zone: 'active' }, score: 55, reason: 'Apply pressure over time' });
					}

					if (support.effect.kind === 'status' && support.effect.statusId === 'guarded' && side.active && !this.hasStatus (side.active, 'guarded')) {
						options.push ({ type: 'support', instanceId: entry.instanceId, targetRef: { sideId, zone: 'active' }, score: 52, reason: 'Protect active battler' });
					}

					if (support.effect.kind === 'heal' && side.active && side.active.currentHp <= getCard (side.active.cardId).hp - 20) {
						options.push ({ type: 'support', instanceId: entry.instanceId, targetRef: { sideId, zone: 'active' }, score: 60, reason: 'Heal damaged active' });
					}

					if (support.effect.kind === 'buff' && side.active) {
						options.push ({ type: 'support', instanceId: entry.instanceId, targetRef: { sideId, zone: 'active' }, score: 70, reason: 'Increase attack pressure' });
					}

					if (support.effect.kind === 'swap' && side.bench.length > 0) {
						options.push ({
							type: 'support',
							instanceId: entry.instanceId,
							targetRef: { sideId, zone: 'bench', index: this.chooseBestPromotionIndex (sideId) },
							score: 45,
							reason: 'Improve active position'
						});
					}
				});
			}

			if (!side.turnFlags.energyAttached && side.active) {
				options.push ({ type: 'attach-active', score: 65, reason: 'Advance active attacker' });
				side.bench.forEach ((entry, index) => {
					options.push ({
						type: 'attach-bench',
						benchIndex: index,
						score: 30 + getCard (entry.cardId).attacks.reduce ((max, attack) => Math.max (max, attack.baseDamage), 0),
						reason: 'Set up a benched attacker'
					});
				});
			}

			if (side.active) {
				getCard (side.active.cardId).attacks.forEach ((attack, index) => {
					if (this.canAffordAttack (side.active, attack) && !this.hasBlockingStatus (side.active, 'attack')) {
						const damage = attack.baseDamage + this.getAttackBonus (side.active);
						const lethal = enemy.active && damage >= enemy.active.currentHp;
						options.push ({
							type: 'attack',
							attackIndex: index,
							score: (lethal ? 140 : 80) + damage,
							reason: lethal ? 'Take the KO' : 'Best attack line'
						});
					}
				});
			}

			if (!side.turnFlags.retreated && side.active && side.bench.length > 0 && !this.hasBlockingStatus (side.active, 'retreat')) {
				const currentDamage = getCard (side.active.cardId).attacks.reduce ((max, attack) => (
					this.canAffordAttack (side.active, attack) ? Math.max (max, attack.baseDamage) : max
				), 0);

				side.bench.forEach ((entry, index) => {
					const benchDamage = getCard (entry.cardId).attacks.reduce ((max, attack) => Math.max (max, attack.baseDamage), 0);
					if (benchDamage > currentDamage && totalEnergy (side.active.attachedEnergy) >= getCard (side.active.cardId).retreatCost) {
						options.push ({
							type: 'retreat',
							benchIndex: index,
							score: 68 + benchDamage,
							reason: 'Bench battler is stronger'
						});
					}
				});
			}

			options.push ({ type: 'end-turn', score: 0, reason: 'Fallback pass' });
			return options;
		}

		runEnemyTurn () {
			if (this.state.currentPlayer !== 'enemy' || this.state.winner) {
				return;
			}

			if (this.state.awaitingPromotion === 'enemy') {
				this.promoteFromBench ('enemy', this.chooseBestPromotionIndex ('enemy'), true);
			}

			let steps = 0;
			while (steps < 6 && !this.state.winner && this.state.currentPlayer === 'enemy') {
				steps += 1;
				const action = window.CCLBattleAI.chooseAction (this, 'enemy');
				this.pushLogLine (`AI: ${action.type} (${action.reason}).`);

				if (action.type === 'bench') {
					if (this.playBench (action.instanceId, 'enemy')) {
						continue;
					}
				}

				if (action.type === 'support') {
					this.resolveSupportCard ('enemy', action.instanceId, action.targetRef || null);
					continue;
				}

				if (action.type === 'attach-active') {
					this.attachEnergy ('active', null, 'enemy');
					continue;
				}

				if (action.type === 'attach-bench') {
					this.attachEnergy ('bench', action.benchIndex, 'enemy');
					continue;
				}

				if (action.type === 'retreat') {
					this.retreat (action.benchIndex, 'enemy');
					continue;
				}

				if (action.type === 'promote') {
					this.promoteFromBench ('enemy', action.benchIndex, true);
					continue;
				}

				if (action.type === 'attack') {
					window.setTimeout (() => this.attack (action.attackIndex, 'enemy'), 450);
					return;
				}

				this.pushLogLine ('Rook passes the turn.');
				this.endTurn ();
				return;
			}

			if (!this.state.winner && this.state.currentPlayer === 'enemy') {
				this.pushLogLine ('Rook passes the turn.');
				this.endTurn ();
			}
		}

		buildResult (winner) {
			return window.CCLBattleResult.build (this, winner);
		}

		finish (winner) {
			this.state.winner = winner;
			window.CCLBattleHooks.run (this, 'onBattleEnd', { winner });
			this.lastResult = this.buildResult (winner);
			this.updateStatus (winner === 'player'
				? 'Round One complete: you defeated Rook and advanced the Harbor City Open story.'
				: 'Round One complete: Rook took the feature match and the defeat route is active.');
			this.render ();
			window.dispatchEvent (new CustomEvent ('ccl:battle-complete', { detail: clone (this.lastResult) }));
		}

		updateStatus (text) {
			if (!this.statusTargetId) {
				return;
			}

			const target = document.getElementById (this.statusTargetId);
			if (target) {
				target.textContent = text;
			}
		}

		close () {
			const result = clone (this.lastResult);
			this.root.hidden = true;
			this.root.innerHTML = '';
			document.body.classList.remove ('battle-open');
			this.state = null;
			this.statusTargetId = null;
			this.inspectedInstanceId = null;

			if (this.resolveResult) {
				this.resolveResult (result);
			}

			this.resolveResult = null;
		}

		renderStatusChips (battler) {
			if (!battler || !battler.statuses.length) {
				return '<div class="ccl-status-row"><span class="ccl-status-chip">No statuses</span></div>';
			}

			return `
				<div class="ccl-status-row">
					${battler.statuses.map ((status) => {
						const definition = this.getStatusDefinition (status.statusId);
						return `<span class="ccl-status-chip ${definition.chipClass}">${escapeHtml (definition.label)} ${status.turnsRemaining}</span>`;
					}).join ('')}
				</div>
			`;
		}

		renderActionSummary () {
			const player = this.side ('player');
			const currentPlayerLabel = this.state.currentPlayer === 'player' ? 'Your turn' : `${this.side ('enemy').name}'s turn`;
			const flagChip = (label, complete) => `<span class="${complete ? 'is-complete' : ''}">${label}</span>`;

			return `
				<div class="ccl-phase-summary">
					<div class="ccl-card-title-row">
						<strong>${escapeHtml (currentPlayerLabel)}</strong>
						<span class="ccl-counter-pill"><span>Phase</span><strong>${this.state.phase.toUpperCase ()}</strong></span>
					</div>
					<p class="ccl-phase-copy">Turn ${this.state.turn}. Supports, statuses, retreat, and attack legality are all surfaced here instead of hidden in story logic.</p>
					<div class="ccl-flag-row">
						${flagChip ('Attach Used', player.turnFlags.energyAttached)}
						${flagChip ('Support Used', player.turnFlags.supportPlayed)}
						${flagChip ('Retreat Used', player.turnFlags.retreated)}
						${flagChip ('Attack Used', player.turnFlags.attacked)}
					</div>
					${this.state.awaitingPromotion === 'player' ? '<div class="ccl-prompt-banner">Promotion required: choose your next active battler.</div>' : ''}
					${this.state.pendingAction ? '<div class="ccl-prompt-banner">Support target selection active.</div>' : ''}
				</div>
			`;
		}

		renderCardZone (sideId, label, battler) {
			if (!battler) {
				return `
					<section class="ccl-zone">
						<div class="ccl-zone-label">${escapeHtml (label)}</div>
						<div class="ccl-zone-empty">No battler deployed.</div>
					</section>
				`;
			}

			const definition = getCard (battler.cardId);
			const inspected = this.inspectedInstanceId === battler.instanceId ? ' is-selected' : '';
			const canTarget = this.state.pendingAction
				&& this.state.pendingAction.type === 'support'
				&& this.state.pendingAction.validTargets.some ((target) => target.sideId === sideId && target.zone === 'active');

			return `
				<section class="ccl-zone${canTarget ? ' is-targetable' : ''}">
					<div class="ccl-zone-label">${escapeHtml (label)}</div>
					<div class="ccl-zone-card${inspected}">
						<div class="ccl-card-title-row">
							<strong>${escapeHtml (definition.name)}</strong>
							<span>${escapeHtml (definition.element)}</span>
						</div>
						<div class="ccl-hp-row">
							<span>HP</span>
							<strong>${battler.currentHp}/${definition.hp}</strong>
						</div>
						<div class="ccl-energy-row">
							<span>Energy</span>
							<strong>${escapeHtml (formatEnergy (battler.attachedEnergy))}</strong>
						</div>
						${this.renderStatusChips (battler)}
						<div class="ccl-card-button-actions">
							<button type="button" class="ccl-secondary-button" data-action="inspect" data-instance-id="${escapeHtml (battler.instanceId)}">Inspect</button>
							${canTarget ? `<button type="button" class="ccl-secondary-button" data-action="support-target" data-side-id="${sideId}" data-zone="active">Target</button>` : ''}
						</div>
					</div>
				</section>
			`;
		}

		renderBenchCard (sideId, battler, index) {
			const definition = getCard (battler.cardId);
			const canPromote = this.state.awaitingPromotion === sideId;
			const canTarget = this.state.pendingAction
				&& this.state.pendingAction.type === 'support'
				&& this.state.pendingAction.validTargets.some ((target) => target.sideId === sideId && target.zone === 'bench' && Number (target.index) === index);
			const inspected = this.inspectedInstanceId === battler.instanceId ? ' is-selected' : '';
			const isPlayer = sideId === 'player';

			return `
				<div class="ccl-bench-card${canTarget ? ' is-targetable' : ''}${inspected}">
					<div class="ccl-card-title-row">
						<strong>${escapeHtml (definition.name)}</strong>
						<span>${battler.currentHp}/${definition.hp} HP</span>
					</div>
					<small>${escapeHtml (formatEnergy (battler.attachedEnergy))}</small>
					${this.renderStatusChips (battler)}
					<div class="ccl-bench-actions">
						<button type="button" class="ccl-secondary-button" data-action="inspect" data-instance-id="${escapeHtml (battler.instanceId)}">Inspect</button>
						${isPlayer && this.state.phase === PHASES.MAIN && !this.state.awaitingPromotion ? `<button type="button" class="ccl-secondary-button" data-action="attach-bench" data-bench-index="${index}" ${this.side ('player').turnFlags.energyAttached ? 'disabled' : ''}>Attach</button>` : ''}
						${isPlayer && this.state.phase === PHASES.MAIN && !this.state.awaitingPromotion ? `<button type="button" class="ccl-secondary-button" data-action="retreat" data-bench-index="${index}" ${this.side ('player').turnFlags.retreated ? 'disabled' : ''}>Retreat</button>` : ''}
						${canPromote ? `<button type="button" class="ccl-secondary-button" data-action="promote" data-bench-index="${index}">Promote</button>` : ''}
						${canTarget ? `<button type="button" class="ccl-secondary-button" data-action="support-target" data-side-id="${sideId}" data-zone="bench" data-index="${index}">Target</button>` : ''}
					</div>
				</div>
			`;
		}

		renderSideSummary (sideId) {
			const side = this.side (sideId);
			return `
				<div class="ccl-side-summary">
					<div class="ccl-card-title-row">
						<strong>${escapeHtml (side.name)}</strong>
						<span>${side.points} / 3 points</span>
					</div>
					<div class="ccl-counter-row">
						<div class="ccl-counter-pill"><span>Deck</span><strong>${side.deck.length}</strong></div>
						<div class="ccl-counter-pill"><span>Hand</span><strong>${side.hand.length}</strong></div>
						<div class="ccl-counter-pill"><span>Discard</span><strong>${side.discard.length}</strong></div>
					</div>
					<p class="ccl-energy-display">Energy lane: ${escapeHtml (side.energyTypes.join (' / '))}</p>
				</div>
			`;
		}

		renderInspector () {
			const match = this.findInstance (this.inspectedInstanceId);
			if (!match) {
				return `
					<div class="ccl-inspector-card">
						<div class="ccl-panel-title">Card Detail</div>
						<p class="ccl-inspector-meta">Select a card to inspect attacks, support text, statuses, and attached energy.</p>
					</div>
				`;
			}

			const battler = match.battler;
			const card = getCard (battler.cardId);
			const location = `${match.sideId} ${match.zone}${typeof match.index === 'number' ? ` ${match.index + 1}` : ''}`;

			return `
				<div class="ccl-inspector-card">
					<div class="ccl-panel-title">Card Detail</div>
					<div class="ccl-card-title-row">
						<strong>${escapeHtml (card.name)}</strong>
						<span>${escapeHtml (card.type)}</span>
					</div>
					<p class="ccl-inspector-meta">Location: ${escapeHtml (location)} | Element: ${escapeHtml (card.element || 'neutral')}</p>
					${card.type === 'battler' ? `
						<div class="ccl-hp-row">
							<span>HP</span>
							<strong>${battler.currentHp}/${card.hp}</strong>
						</div>
						<div class="ccl-energy-row">
							<span>Attached</span>
							<strong>${escapeHtml (formatEnergy (battler.attachedEnergy))}</strong>
						</div>
						<div class="ccl-energy-row">
							<span>Retreat</span>
							<strong>${card.retreatCost}</strong>
						</div>
						${this.renderStatusChips (battler)}
						<div class="ccl-inspector-attacks">
							${card.attacks.map ((attack) => `
								<div class="ccl-attack-chip">
									<strong>${escapeHtml (attack.name)}</strong>
									<small>${escapeHtml (formatCost (attack.cost))} | ${attack.baseDamage} damage</small>
								</div>
							`).join ('')}
						</div>
					` : `
						<p class="ccl-inspector-meta">${escapeHtml (card.rulesText || 'No rules text.')}</p>
						<div class="ccl-attack-chip">
							<strong>Targeting</strong>
							<small>${escapeHtml (card.target)}</small>
						</div>
					`}
				</div>
			`;
		}

		renderHandCard (entry) {
			const card = getCard (entry.cardId);
			const isSelected = this.inspectedInstanceId === entry.instanceId ? ' is-selected' : '';
			const isPlayerTurn = this.state.currentPlayer === 'player' && this.state.phase === PHASES.MAIN && !this.state.winner && !this.state.awaitingPromotion;
			const canBench = card.type === 'battler' && this.side ('player').bench.length < 3 && isPlayerTurn;
			const canSupport = card.type === 'support' && !this.side ('player').turnFlags.supportPlayed && isPlayerTurn;

			return `
				<div class="ccl-card-button${isSelected}">
					<strong>${escapeHtml (card.name)}</strong>
					<small>${escapeHtml (card.type === 'battler' ? `${card.element} battler` : card.rulesText)}</small>
					<div class="ccl-card-button-actions">
						<button type="button" class="ccl-secondary-button" data-action="inspect" data-instance-id="${escapeHtml (entry.instanceId)}">Inspect</button>
						${canBench ? `<button type="button" class="ccl-secondary-button" data-action="play-bench" data-instance-id="${escapeHtml (entry.instanceId)}">Bench</button>` : ''}
						${canSupport ? `<button type="button" class="ccl-secondary-button" data-action="play-support" data-instance-id="${escapeHtml (entry.instanceId)}" ${this.state.pendingAction ? 'disabled' : ''}>Play Support</button>` : ''}
					</div>
				</div>
			`;
		}

		renderResultPanel () {
			if (!this.state.winner || !this.lastResult) {
				return '';
			}

			return `
				<div class="ccl-result-panel">
					<div class="ccl-result-card">
						<div class="ccl-battle-kicker">Battle Summary</div>
						<h3>${this.state.winner === 'player' ? 'Victory' : 'Defeat'}</h3>
						<p class="ccl-result-meta">Score ${this.lastResult.score.playerPoints} - ${this.lastResult.score.enemyPoints}</p>
						<p class="ccl-result-meta">Rewards: ${this.lastResult.rewards.credits} credits${this.lastResult.rewards.cards.length ? `, ${this.lastResult.rewards.cards.length} card unlock` : ''}${this.lastResult.rewards.packs.length ? `, ${this.lastResult.rewards.packs.length} pack` : ''}.</p>
						<p class="ccl-result-meta">Next scene: ${escapeHtml (this.lastResult.nextScene || 'none')}</p>
						<button type="button" data-action="close-result">Continue</button>
					</div>
				</div>
			`;
		}

		render () {
			if (!this.root || !this.state) {
				return;
			}

			const player = this.side ('player');
			const enemy = this.side ('enemy');
			const activeCard = player.active ? getCard (player.active.cardId) : null;
			const legalAttacks = activeCard
				? activeCard.attacks.map ((attack, index) => ({
					index,
					attack,
					enabled: this.state.currentPlayer === 'player'
						&& this.state.phase === PHASES.MAIN
						&& !player.turnFlags.attacked
						&& !this.state.awaitingPromotion
						&& !this.hasBlockingStatus (player.active, 'attack')
						&& this.canAffordAttack (player.active, attack)
				}))
				: [];

			this.root.innerHTML = `
				<div class="ccl-battle-shell">
					<header class="ccl-battle-topbar">
						<div>
							<div class="ccl-battle-kicker">Harbor City Open</div>
							<h2>${escapeHtml (this.state.label)}</h2>
						</div>
						<div class="ccl-turn-pill">Turn ${this.state.turn} | ${this.state.currentPlayer === 'player' ? 'Player' : enemy.name}</div>
					</header>
					<section class="ccl-scoreboard">
						<div class="ccl-score-card"><span>You</span><strong>${player.points}</strong></div>
						<div class="ccl-score-card"><span>${escapeHtml (enemy.name)}</span><strong>${enemy.points}</strong></div>
					</section>
					<section class="ccl-board">
						<div class="ccl-side">
							${this.renderSideSummary ('enemy')}
							${this.renderCardZone ('enemy', 'Enemy Active', enemy.active)}
							<div class="ccl-zone">
								<div class="ccl-zone-label">Enemy Bench</div>
								<div class="ccl-bench">
									${enemy.bench.length ? enemy.bench.map ((entry, index) => this.renderBenchCard ('enemy', entry, index)).join ('') : '<div class="ccl-empty-bench">Enemy bench empty.</div>'}
								</div>
							</div>
						</div>
						<div class="ccl-action-panel">
							${this.renderActionSummary ()}
							<div class="ccl-log">
								<div class="ccl-panel-title">Battle Log</div>
								${this.state.log.map ((line) => `<div class="ccl-log-entry">${escapeHtml (line)}</div>`).join ('')}
							</div>
							<div class="ccl-inspector">
								${this.renderInspector ()}
							</div>
						</div>
						<div class="ccl-side">
							${this.renderSideSummary ('player')}
							${this.renderCardZone ('player', 'Your Active', player.active)}
							<div class="ccl-zone">
								<div class="ccl-zone-label">Your Bench</div>
								<div class="ccl-bench">
									${player.bench.length ? player.bench.map ((entry, index) => this.renderBenchCard ('player', entry, index)).join ('') : '<div class="ccl-empty-bench">Your bench is open.</div>'}
								</div>
							</div>
						</div>
					</section>
					<section class="ccl-player-controls">
						<div class="ccl-hand-panel">
							<div class="ccl-panel-title">Hand</div>
							<div class="ccl-hand">
								${player.hand.length ? player.hand.map ((entry) => this.renderHandCard (entry)).join ('') : '<div class="ccl-empty-hand">Your hand is empty.</div>'}
							</div>
						</div>
						<div class="ccl-main-controls">
							<div class="ccl-panel-title">Main Controls</div>
							<label class="ccl-energy-select">
								<span class="ccl-zone-label">Energy Choice</span>
								<select data-action="select-energy" ${player.turnFlags.energyAttached || this.state.currentPlayer !== 'player' || this.state.awaitingPromotion ? 'disabled' : ''}>
									${player.energyTypes.map ((type) => `<option value="${type}" ${player.selectedEnergyType === type ? 'selected' : ''}>${type}</option>`).join ('')}
								</select>
							</label>
							<button type="button" data-action="attach-active" ${player.turnFlags.energyAttached || this.state.currentPlayer !== 'player' || this.state.phase !== PHASES.MAIN || !player.active || this.state.awaitingPromotion ? 'disabled' : ''}>Attach to Active</button>
							${legalAttacks.map ((entry) => `<button type="button" data-action="attack" data-attack-index="${entry.index}" ${entry.enabled ? '' : 'disabled'}>${escapeHtml (entry.attack.name)} (${escapeHtml (formatCost (entry.attack.cost))})</button>`).join ('')}
							${this.state.pendingAction ? '<button type="button" class="ccl-secondary-button" data-action="cancel-support">Cancel Targeting</button>' : ''}
							<button type="button" class="ccl-end-turn" data-action="end-turn" ${this.state.currentPlayer !== 'player' || this.state.awaitingPromotion ? 'disabled' : ''}>End Turn</button>
						</div>
					</section>
					${this.renderResultPanel ()}
				</div>
			`;

			this.bind ();
		}

		bind () {
			this.root.querySelectorAll ('[data-action="inspect"]').forEach ((button) => {
				button.addEventListener ('click', () => this.inspect (button.dataset.instanceId));
			});

			this.root.querySelectorAll ('[data-action="play-bench"]').forEach ((button) => {
				button.addEventListener ('click', () => this.playBench (button.dataset.instanceId));
			});

			this.root.querySelectorAll ('[data-action="play-support"]').forEach ((button) => {
				button.addEventListener ('click', () => this.beginSupportPlay (button.dataset.instanceId));
			});

			this.root.querySelectorAll ('[data-action="support-target"]').forEach ((button) => {
				button.addEventListener ('click', () => {
					this.playSupportTarget (button.dataset.zone, button.dataset.index, button.dataset.sideId);
				});
			});

			this.root.querySelectorAll ('[data-action="attach-bench"]').forEach ((button) => {
				button.addEventListener ('click', () => this.attachEnergy ('bench', Number (button.dataset.benchIndex), 'player'));
			});

			this.root.querySelectorAll ('[data-action="retreat"]').forEach ((button) => {
				button.addEventListener ('click', () => this.retreat (Number (button.dataset.benchIndex), 'player'));
			});

			this.root.querySelectorAll ('[data-action="promote"]').forEach ((button) => {
				button.addEventListener ('click', () => this.promoteFromBench ('player', Number (button.dataset.benchIndex), false));
			});

			const energySelect = this.root.querySelector ('[data-action="select-energy"]');
			if (energySelect) {
				energySelect.addEventListener ('change', (event) => this.setEnergyType (event.target.value));
			}

			const attachActive = this.root.querySelector ('[data-action="attach-active"]');
			if (attachActive) {
				attachActive.addEventListener ('click', () => this.attachEnergy ('active', null, 'player'));
			}

			this.root.querySelectorAll ('[data-action="attack"]').forEach ((button) => {
				button.addEventListener ('click', () => this.attack (Number (button.dataset.attackIndex), 'player'));
			});

			const cancelSupport = this.root.querySelector ('[data-action="cancel-support"]');
			if (cancelSupport) {
				cancelSupport.addEventListener ('click', () => this.cancelPendingAction ());
			}

			const endTurn = this.root.querySelector ('[data-action="end-turn"]');
			if (endTurn) {
				endTurn.addEventListener ('click', () => this.endTurn ());
			}

			const closeResult = this.root.querySelector ('[data-action="close-result"]');
			if (closeResult) {
				closeResult.addEventListener ('click', () => this.close ());
			}
		}
	}

	window.CCLBattleSystem = CCLBattleSystem;
	window.CCLBattlePhases = PHASES;
})();
