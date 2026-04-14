/* global monogatari */

// Define the messages used in the game.
monogatari.action ('message').messages ({
	'LeagueGuide': {
		title: 'League Guide',
		subtitle: 'Prototype Notes',
		body: `
			<p>Card Championship League is currently a narrative vertical-slice prototype.</p>
			<p>The next implementation milestone is the Round One tutorial duel at the Harbor City Open.</p>
			<p>This project uses Monogatari for story flow and will layer custom JavaScript battle systems on top.</p>
		`
	},
	'HarborCityOpenEntry': {
		title: 'Harbor City Open',
		subtitle: 'Tournament Mode',
		body: `
			<p>The pairings are sealed. The bracket is live. Everything from registration leads here.</p>
			<p>This is a full tournament run: three rounds, single elimination, Rook waiting in the finals.</p>
			<p><button class="button" data-ccl-t-start-event="harbor_city_open">Enter the Harbor City Open</button></p>
		`
	}
});

// Define the notifications used in the game
monogatari.action ('notification').notifications ({
	'LeagueStart': {
		title: 'League Registration Open',
		body: 'The Harbor City Open begins today.',
		icon: ''
	},
	'DeckReady': {
		title: 'Starter Deck Registered',
		body: 'Starter Blaze and Starter Tide have been added to your league profile.',
		icon: ''
	}
});

// Define the Particles JS Configurations used in the game
monogatari.action ('particles').particles ({

});

// Define the canvas objects used in the game
monogatari.action ('canvas').objects ({

});

// Credits of the people involved in the creation of this awesome game
monogatari.configuration ('credits', {
	'Story and Prototype Direction': 'Allen',
	'Engine': 'Monogatari'
});

// Define the images that will be available on your game's image gallery
monogatari.assets ('gallery', {

});

// Define the music used in the game.
monogatari.assets ('music', {

});

// Define the voice files used in the game.
monogatari.assets ('voices', {

});

// Define the sounds used in the game.
monogatari.assets ('sounds', {

});

// Define the videos used in the game.
monogatari.assets ('videos', {

});

// Define the images used in the game.
monogatari.assets ('images', {

});

// Define the backgrounds for each scene.
monogatari.assets ('scenes', {

});

// Define the Characters
monogatari.characters ({
	'm': {
		name: 'Mira',
		color: '#6ed3ff'
	},
	'r': {
		name: 'Rook',
		color: '#ff7a7a'
	},
	'c': {
		name: 'Caster Vale',
		color: '#ffd166'
	}
});

monogatari.script ({
	// The game starts here.
	'Start': [
		'show scene #f7f6f6 with fadeIn',
		'show notification LeagueStart',
		{
			'Input': {
				'Text': 'What name will you register under?',
				'Validation': function (input) {
					return input.trim ().length > 0;
				},
				'Save': function (input) {
					this.storage ({
						player: {
							name: input,
							callSign: input
						}
					});
					return true;
				},
				'Revert': function () {
					this.storage ({
						player: {
							name: '',
							callSign: ''
						}
					});
				},
				'Warning': 'You need a league name before registration can close.'
			}
		},
		'The sea wind coming off Harbor City tastes like rain and hot cables.',
		'Above the convention hall, a holo-banner flashes the same promise on every loop.',
		'centered CARD CHAMPIONSHIP LEAGUE - HARBOR CITY OPEN',
		'Your first sanctioned tournament. One crowded lobby. One starter deck. One chance to stop feeling like a spectator.',
		'm {{player.name}}. There you are.',
		'm Registration closes in ten minutes, and I already had to bluff the front desk into thinking you were doing breathing exercises.',
		'Mira presses a deck case into your hands. The latch is worn smooth from years of use.',
		'm Starter Blaze. Fast pressure, direct lines, no nonsense. Perfect for surviving your first bracket.',
		'show notification DeckReady',
		'm The Harbor City Open only runs three rounds before top cut, but do not let that fool you.',
		'm Everyone here wants a story they can drag into the rankings feed.',
		'r If this is your idea of a warm welcome, coach, you are getting soft.',
		'A boy in a crimson league jacket leans against the check-in gate, spinning a silver-backed card over his knuckles.',
		'r Name is Rook. Top seed in the junior ladder. Probably your round-one disaster.',
		'r Try not to fold before the pairings go up. I hate boring brackets.',
		'm Ignore him. Rook wins because he wants the room to feel tilted before the match even starts.',
		'On the far stage, the tournament stream comes alive in a wash of gold light.',
		'c Duelists, welcome to the Harbor City Open.',
		'c Today is where league reputations begin.',
		'c If you survive Swiss, you earn a seat in tonight\'s championship spotlight match.',
		'The room erupts. Sleeves snap. Deck boxes open. Tablets flash with pairings not yet revealed.',
		{
			'Choice': {
				'Dialog': 'm Before pairings drop, what do you focus on?',
				'Steady': {
					'Text': 'Review the deck and stay calm',
					'Do': 'jump DeckReview'
				},
				'Scout': {
					'Text': 'Watch the room and scout rivals',
					'Do': 'jump ScoutFloor'
				}
			}
		}
	],

	'DeckReview': [
		'You open the case and sort through the Starter Blaze list by instinct.',
		'Cheap frontliners. Burst tactics. One late-game finisher that can steal a match if you earn the tempo.',
		'Starter Tide sits beside it in the case, slower and cleaner, built to stabilize before turning the duel around.',
		'm Good. Do not memorize every card. Memorize your first two turns and the kind of hand you can keep.',
		'm In this league, confidence is a resource too.',
		'jump RegistrationDesk'
	],

	'ScoutFloor': [
		'You study the room instead of the cards.',
		'Half the field looks wired on practice matches. The other half looks terrified of them.',
		'Rook is not watching his own deck. He is watching reactions.',
		'm Useful read?',
		'm Good. Then remember it. The first duel in a tournament usually starts before anyone draws.',
		'jump RegistrationDesk'
	],

	'RegistrationDesk': [
		'Your badge prints with a hiss.',
		'"{{player.name}} - Rookie Division - Two starter decks verified."',
		'm There. Official.',
		'm Your first goal is simple: win one sanctioned match and prove you belong here.',
		'r Ambitious. I like it.',
		'r Pairings are up. Table Seven. You and me.',
		'Mira exhales through her nose, halfway between concern and amusement.',
		'm Then the tournament did us a favor. If you are going to make noise, start by rattling the favorite.',
		{
			'Choice': {
				'Dialog': 'The judge calls your table. How do you answer?',
				'Fire': {
					'Text': 'Tell Rook you are taking his spotlight',
					'Do': 'jump RoundOneFire'
				},
				'Ice': {
					'Text': 'Stay quiet and save it for the match',
					'Do': 'jump RoundOneIce'
				}
			}
		}
	],

	'RoundOneFire': [
		'{{player.name}} Then you should pay attention. I did not come here to be your opening act.',
		'r There it is. Much better.',
		'm Hold onto that nerve. Just do not waste it.',
		'jump RoundOneSetup'
	],

	'RoundOneIce': [
		'You slide your deck case onto the table without answering.',
		'r Quiet rookie. Fine. Sometimes that means dangerous.',
		'm Good choice. Let the cards do the loud part.',
		'jump RoundOneSetup'
	],

	'RoundOneSetup': [
		'Table Seven feels smaller than the rest of the hall.',
		'The overhead display locks onto your names while the stream caster reads the upset angle in real time.',
		'c We have a live feature table in Rookie Division: ladder favorite Rook versus new entrant {{player.name}}.',
		'c This is exactly the kind of pairing the Harbor City Open loves.',
		'm Remember the plan: establish pressure early, keep your resources clean, and make him answer you.',
		'You cut decks. Present hands. Wait for the judge signal.',
		'show message HarborCityOpenEntry',
		'end'
	],

	'RoundOneVictory': [
		'show scene #edf6ff with fadeIn',
		'The final strike lands so hard the feature table lights pulse white.',
		'c Upset on Table Seven. The rookie just took down Rook in round one.',
		'r Hah. Good. That is the first real match I have had all month.',
		'r Do not get comfortable. Now the bracket knows your name.',
		'm You kept the pressure clean and forced him to answer your pace. That was not luck.',
		'm Take the win, take the credits, and get ready for the next pairing.',
		'You feel the room differently now. Not like an outsider trying to sneak in, but like part of the story everyone is watching.',
		'centered Round One Clear - Victory Route Unlocked',
		'end'
	],

	'RoundOneDefeat': [
		'show scene #f9f0f0 with fadeIn',
		'The last exchange slips away from you in a flash of silver-backed cards and cold applause.',
		'c Rook closes the feature match and survives the upset scare.',
		'r Better than I expected. Which means next time I will come prepared.',
		'm Look at me, {{player.name}}.',
		'm You did not freeze, and you did not fold. That matters more than one round-one loss.',
		'm Tournament stories are not only built on victories. They are built on who earns the rematch.',
		'The sting stays with you, but so does the shape of the game you nearly took from him.',
		'centered Round One Complete - Defeat Route Continues',
		'end'
	]
});
