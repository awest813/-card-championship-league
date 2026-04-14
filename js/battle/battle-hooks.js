/* global window */

(function () {
	const HOOK_NAMES = [
		'onBattleStart',
		'onOpeningSetup',
		'onTurnStart',
		'onDrawStep',
		'onMainPhaseStart',
		'onEnergyAttach',
		'onRetreat',
		'onAttackDeclare',
		'onDamageDealt',
		'onKO',
		'onPromote',
		'onTurnEnd',
		'onBattleEnd'
	];

	function createContext (hookName, payload = {}) {
		return {
			hookName,
			payload,
			queue: [],
			logs: []
		};
	}

	function queueEffect (context, effect) {
		context.queue.push (effect);
	}

	function emitLog (context, line) {
		context.logs.push (line);
	}

	function flush (system, context) {
		while (context.queue.length > 0) {
			system.applyQueuedEffect (context.queue.shift (), context);
		}

		context.logs.forEach ((line) => system.pushLogLine (line));
	}

	function run (system, hookName, payload = {}) {
		const context = createContext (hookName, payload);

		if (typeof system.handleHook === 'function') {
			system.handleHook (context);
		}

		flush (system, context);
		return context;
	}

	window.CCLBattleHooks = {
		HOOK_NAMES,
		createContext,
		queueEffect,
		emitLog,
		flush,
		run
	};
})();
