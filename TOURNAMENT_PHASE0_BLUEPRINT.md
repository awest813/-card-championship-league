# Card Championship League
## Tournament Mode Phase 0 Blueprint

This document locks the first implementation-ready blueprint for tournament mode in `Card Championship League`.

Canon assumptions:

- Setting: `Harbor City`
- Opening premium event: `Harbor City Open`
- Mentor: `Mira`
- Early nemesis/rival: `Rook`
- Mira is romanceable
- Rook is romanceable
- Tournament mode supports both authored entrants and generated filler entrants

Core architecture lock:

- `Monogatari layer`: story scenes, registration, relationship scenes, event intros, pre-match banter, battle launch, post-battle branching
- `Tournament system`: event flow, bracket state, entrant generation, tournament presentation, event UI modules, result aggregation
- `Battle module`: duel execution, board state, rules, AI, supports, statuses, battle result payload
- `Shared progression state`: rewards, flags, deck selection, tournament history, relationship variables, reputation, filler entrant history tags

## 1. Tournament Product Vision

Tournament mode must feel like a premium event framework, not a battle ladder utility.

The player should feel:

- ceremony when entering events
- bracket pressure before each duel
- social attention between rounds
- visible rival heat from Rook
- grounded support from Mira
- progression through Harbor City's public card-sport scene

Tournament mode is the game's main prestige layer. Battles are one part of that loop, but event identity, crowd flavor, bracket reveal, and social reactivity carry equal weight.

## 2. Tournament Tier Ladder

### 2.1 Local Opens

Purpose:

- onboarding
- first public reputation gains
- regular community event cadence

Scale:

- 8-player brackets
- cozy venues
- light crowd density

Presentation:

- simple event splash
- low badge density
- modest result ceremony

Social intensity:

- friendly locals
- low-pressure rival encounters

Reward prestige:

- low
- starter cards, credits, simple badges

### 2.2 District Cups

Purpose:

- stronger field
- district identity
- more public seeding and archetype recognition

Scale:

- 8 to 16 entrants
- stronger venue branding

Presentation:

- district-specific color and venue treatment
- clearer seeding markers

Social intensity:

- medium
- more recurring faces and commentary

Reward prestige:

- medium-low
- stronger credits, named reward packs, district badges

### 2.3 City Opens / Circuit Events

Purpose:

- real public attention
- major rivalry collision points
- premium bracket drama

Scale:

- 16-player fields minimum for authored presentation

Presentation:

- high-end event splash
- stronger title cards
- featured match framing

Social intensity:

- high
- more crowd buzz, more bracket pressure, more public identity

Reward prestige:

- medium-high
- premium packs, reputation gains, route progression hooks

### 2.4 Invitationals

Purpose:

- exclusivity
- curated strong fields
- late-midgame prestige

Scale:

- 8 to 16 curated entrants

Presentation:

- elegant, branded, elite atmosphere
- premium venue flavor

Social intensity:

- high
- more targeted social and route reactivity

Reward prestige:

- high
- rare unlocks, titles, stronger relationship beats

### 2.5 Championship Qualifiers

Purpose:

- late-game pressure gate
- strongest non-final stakes

Scale:

- strong 16-player or staged qualifier structures

Presentation:

- broadcast-style framing
- strong featured-match language

Social intensity:

- very high
- heavy rival pressure and mentor support

Reward prestige:

- very high
- qualification flags, elite titles, championship entry

### 2.6 Final Championship

Purpose:

- ceremonial climax
- career-defining final event

Scale:

- elite final bracket or finals sequence

Presentation:

- strongest title treatment in the game
- highest ceremony and aftermath

Social intensity:

- peak
- major Mira/Rook payoff scenes

Reward prestige:

- peak
- champion titles, ending progression, legacy archive entry

## 3. Core Tournament Experience Flow

The emotional loop of a major tournament should be:

1. `Arrival / Event Splash`
   - establish tier, venue, and event identity
2. `Registration`
   - confirm deck, stakes, rewards, and support framing
3. `Bracket Reveal`
   - reveal player slot, notable entrants, and possible collision paths
4. `Pre-Match Banter`
   - opponent intro, Mira note, Rook interruption, or commentator flavor
5. `Battle Launch`
   - hand control to the battle module using structured launch context
6. `Immediate Result`
   - show win/loss, rewards, rep, and round outcome
7. `Between-Round Lounge`
   - deliver social texture, support messaging, and event buzz
8. `Escalation`
   - later rounds get stronger intros, more public pressure, and stronger reactions
9. `Final Match`
   - use peak presentation and the strongest route/rival framing
10. `Placement / Legacy / Story Handoff`
   - update tournament history, rewards, flags, and next scene

## 4. Screen and Module List

### 4.1 Event Splash Screen

Purpose:

- announce event identity
- establish prestige and venue tone

Required content:

- event logo
- event name
- venue
- district
- tier
- tagline
- register CTA

Optional flavor:

- organizer line
- sponsor mark
- crowd teaser text

### 4.2 Registration Screen

Purpose:

- make the player feel enrolled in a real event

Required content:

- selected deck
- event format
- entrant count
- reward preview
- Mira or organizer support text

Optional flavor:

- deck archetype icon
- entry number
- event notes

### 4.3 Bracket Reveal Screen

Purpose:

- create anticipation and tension

Required content:

- player slot
- bracket path
- notable entrants
- rival marker
- seeded marker
- highlighted collision paths

Optional flavor:

- crowd buzz line
- upset watch tags

### 4.4 Opponent Match Card

Purpose:

- make each match feel authored even when using filler entrants

Required content:

- opponent portrait
- district/origin
- deck/archetype icon
- short bio
- stakes note
- relationship/rival marker
- banter block

Optional flavor:

- badge row
- previous result/history tag

### 4.5 Between-Round Lounge Screen

Purpose:

- inject social life and event texture between rounds

Required content:

- next round preview
- current standing
- Mira note or support message
- crowd buzz snippet
- message panel
- possible Rook interruption

Optional flavor:

- route-support message
- upset board
- side-event callout

### 4.6 Result Screen

Purpose:

- clearly deliver round outcome and emotional payoff

Required content:

- win/loss
- round cleared
- placement
- rewards
- rep changes
- relationship changes
- next scene hook

Optional flavor:

- commentary recap
- upset headline
- featured match tag

### 4.7 Finals / Championship Screen

Purpose:

- provide the biggest event framing in the game

Required content:

- special title card
- finals stakes
- strongest commentator beat
- strongest Mira/Rook reaction beat
- featured match framing

Optional flavor:

- crowd chant line
- legacy stakes callout

### 4.8 Tournament Summary / History Screen

Purpose:

- turn event results into long-term memory

Required content:

- final placement
- event name
- rewards earned
- badges/titles
- aftermath hook
- archive entry

Optional flavor:

- championship board placement
- relationship aftermath note

## 5. Icon and Badge System

First release icon set:

- `Seeded Entrant`: pre-event notable threat
- `Rival`: recurring named competitive foil
- `Nemesis`: emotionally charged major opponent
- `Mentor Support`: active Mira support beat or related event text
- `Friend`: positive recurring social contact
- `Romance Interest`: route-relevant social signal
- `Local Favorite`: known scene regular
- `Crowd Favorite`: public popularity tag
- `Win Streak`: current momentum indicator
- `Upset Alert`: current event surprise indicator
- `Featured Match`: broadcast/highlight table tag
- `Elite Entrant`: high-status duelist marker
- `Finalist`: made finals in a notable event
- `Champion`: won an event or title-bearing bracket

Optional archetype icons:

- `Aggro Specialist`
- `Control Specialist`
- `Combo Specialist`
- `Defensive Specialist`
- `Trickster / Disruption Specialist`

Implementation rule:

- first-release icons may be visual-only or text-trigger-only
- they do not all need deep mechanics at launch

## 6. Relationship and Nemesis System Blueprint

### 6.1 Required Variables

- `miraTrust`
- `rookHeat`
- `tournamentRep`
- `crowdFavor`

### 6.2 Optional Early Bond Variables

- `bond_nia`
- `bond_sora`
- `bond_hana`

### 6.3 Variable Meaning

`miraTrust`
- measures how much Mira trusts the player's judgment, pacing, and resilience

`rookHeat`
- measures rivalry intensity, irritation, fixation, and bracket-centered emotional pressure

`tournamentRep`
- measures how seriously the Harbor City scene takes the player

`crowdFavor`
- measures public warmth, spotlight appeal, and audience momentum

### 6.4 System Influence

These variables should affect:

- pre-match line variants
- between-round messages
- post-match reactions
- finals intros
- commentary lines
- crowd buzz
- scene eligibility
- route progression gates

### 6.5 Route Rules

- Mira remains `mentor first, romance second`
- Rook remains `nemesis first, romance second`

### 6.6 Expression Guidance

`Mira route`
- guidance
- earned closeness
- quiet strategic intimacy
- post-event debrief warmth

`Rook route`
- obsession
- friction
- attraction through competition
- emotionally charged bracket encounters

## 7. Banter and Commentary Content Model

### 7.1 Categories

- event intro lines
- registration lines
- bracket reveal lines
- pre-match opponent lines
- Mira support lines
- Rook interruption lines
- commentator lines
- crowd buzz lines
- between-round lounge lines
- result lines
- finals lines

### 7.2 Tag Dimensions

- tournament tier
- event id
- district
- round
- opponent archetype
- relationship state
- nemesis state
- player streak
- upset state
- featured match state
- win/loss context

### 7.3 Example Data Shape

```json
{
  "speaker": "mira",
  "category": "prematch_support",
  "eventId": "harbor_city_open",
  "tier": "city_open",
  "round": "semifinal",
  "conditions": {
    "miraTrustMin": 40,
    "rookHeatMin": 20,
    "featuredMatch": true
  },
  "text": "You settled in after registration. Good. Play your pace, not his."
}
```

### 7.4 Usage Rules

- do not hardcode flavor text into UI logic outside temporary prototypes
- line selection should be driven by tags + conditions
- event packs should be extensible without branching code explosions

## 8. Tournament Data Schemas

### 8.1 Tournament Event Definition

```ts
interface TournamentEvent {
  id: string;
  name: string;
  tier: "local_open" | "district_cup" | "city_open" | "invitational" | "qualifier" | "final_championship";
  district: string;
  venue: string;
  logoThemeKey: string;
  roundCount: number;
  entrantCount: number;
  rewardTableId: string;
  notableEntrantIds: string[];
  bracketRules: {
    format: "single_elimination";
    simulatedNonPlayerMatches: boolean;
  };
  flavorPackKey: string;
  replayable: boolean;
  storyGated: boolean;
}
```

### 8.2 Entrant Definition

```ts
interface TournamentEntrant {
  id: string;
  entrantType: "authored" | "filler";
  name: string;
  portraitKey: string;
  district: string;
  deckArchetype: string;
  roleTags: string[];
  relationshipTags: string[];
  rivalryTags: string[];
  bioText: string;
  introLinePool: string[];
  badgeTags: string[];
  seeded: boolean;
  elite: boolean;
  crowdFavorite: boolean;
  generatorSource?: string;
}
```

### 8.3 Tournament Runtime State

```ts
interface TournamentRuntimeState {
  currentTournamentId: string;
  currentRound: string;
  playerPosition: number;
  currentOpponentId: string | null;
  bracketState: BracketState;
  upsetNotes: string[];
  roundsCleared: string[];
  rewardsPending: string[];
  sceneTriggerFlags: string[];
}
```

### 8.4 Bracket State

```ts
interface BracketState {
  entrantSlots: string[];
  currentPairings: Array<{
    roundId: string;
    entrantA: string;
    entrantB: string;
    matchId: string;
  }>;
  resolvedMatches: Array<{
    matchId: string;
    winnerId: string;
    loserId: string;
  }>;
  playerPath: string[];
  notableCollisions: string[];
  simulatedResults: Array<{
    matchId: string;
    winnerId: string;
  }>;
}
```

### 8.5 Battle Result Linkage

The tournament system must consume battle returns shaped like:

```ts
interface BattleResult {
  winner: "player" | "enemy";
  battleId: string;
  pointsEarned: number;
  rewards: {
    credits: number;
    cards: string[];
    packs: string[];
    items: string[];
  };
  unlocks: string[];
  storyFlags: string[];
  nextScene?: string;
  rematchAvailable?: boolean;
  tournamentUpdate?: {
    tournamentId: string;
    roundCleared?: string;
    nextRoundId?: string;
    eliminated?: boolean;
    champion?: boolean;
  };
  affinityChanges?: Record<string, number>;
}
```

## 9. Harbor City Open Vertical Slice

### 9.1 Event Identity

`Harbor City Open` should feel like:

- the player's first real public proving ground
- bigger than a local and clearly city-scale
- a place where the scene can notice the player
- the first event where Rook treats the rivalry as real

### 9.2 Event Flow

1. Event Splash
2. Registration
3. Deck Confirmation
4. Bracket Reveal
5. Early Match
6. Between-Round Lounge
7. Intermediate Match
8. Rook Feature Match
9. Result Screen
10. Story Handoff

### 9.3 Required Flavor Systems

- Mira support notes
- Rook bracket presence before the feature match
- crowd buzz
- featured match framing
- result aftermath text

### 9.4 Where Mira Appears

- registration support line
- one bracket reveal note
- one between-round lounge message
- one post-Rook reaction scene

### 9.5 Where Rook Appears

- pre-event intimidation or needling
- bracket reveal pressure beat
- feature match pre-battle banter
- post-battle reaction

### 9.6 Result Handoff Must Support

- win/loss branch
- rewards
- relationship changes
- story flags
- tournament round completion
- next scene jump

## 10. UI and UX Principles

Tournament mode UI should feel:

- bright
- premium
- readable
- sporty
- social
- text-forward but elegant
- icon-rich without becoming cluttered

Avoid:

- spreadsheet-looking brackets
- overly dark esports UI
- noisy glow overload
- generic fantasy event dressing
- utility popups without event identity

Rules:

- every screen must establish hierarchy in under 3 seconds
- event branding should be clear before dense data appears
- icons should reinforce readability, not compete with it
- text blocks should be short enough to feel event-like, not lore-dumpy

## 11. Engineering Boundaries

### Monogatari Owns

- story scenes
- registration scenes
- event intros
- relationship scenes
- pre-match banter scenes
- between-round lounge scenes
- post-match branching
- battle launch
- battle return handling

### Tournament System Owns

- event configs
- bracket runtime
- entrant generation
- filler entrant support
- tournament screen state
- badge and icon logic
- result aggregation
- event presentation logic

### Battle Module Owns

- duel execution
- board state
- rules
- supports and statuses
- combat AI
- win/loss resolution
- battle result payload generation

### Shared Progression State Owns

- selected deck
- rewards
- unlocks
- story flags
- relationship variables
- tournament history
- filler entrant history tags if persisted

## 12. Ordered Implementation Tasks

### Task Group A: Schema Lock

1. define tournament event schema
2. define entrant schema
3. define runtime bracket schema
4. define tournament history schema
5. define filler entrant generation input/output schema

### Task Group B: Harbor City Open Flow

1. implement Harbor City Open event config
2. implement registration screen
3. implement bracket reveal
4. implement round progression plumbing
5. implement result handoff logic

### Task Group C: Text and Presentation

1. create Mira support pack v1
2. create Rook line pack v1
3. create crowd buzz pack v1
4. create commentator pack v1
5. create badge/icon placeholder set

### Task Group D: Filler Entrants

1. define filler pools
2. build entrant generator
3. define recurrence/history tags
4. integrate filler entrants into bracket creation

### Task Group E: Relationship Hooks

1. add tournament-facing relationship variables to progression
2. gate line variants by state
3. define first Mira/Rook route-sensitive tournament beats

## 13. Phase 0 Exit Checklist

- Harbor City launch scope is locked
- Harbor City Open event flow is fully specified
- tournament tier ladder is finalized
- tournament screen list is finalized
- icon and badge set is defined
- relationship and nemesis variables are defined
- Mira and Rook route expression in tournaments is defined
- event schema exists
- entrant schema exists
- filler entrant schema exists
- bracket runtime schema exists
- banter tagging model exists
- launch/return contract is clear
- implementation tasks are sequenced for Phase 1

## 14. Immediate Next Build Target

The first production milestone after this blueprint should be:

- Harbor City Open `Event Splash Screen`
- Harbor City Open `Registration Screen`
- Harbor City Open `Bracket Reveal Screen`
- a simple 8- or 16-slot bracket state
- one authored filler-capable opponent card flow
- clean launch into the current battle module
- clean return into result and story flow

If that slice works, tournament mode becomes a real game layer instead of a future-facing idea.
