# Card Championship League

Card Championship League is a visual novel prototype built on Monogatari with a tournament-driven trading card battle loop. The goal is to blend character-focused VN storytelling with fast, readable matches inspired by the cadence of Pokemon TCG Pocket, while keeping the ruleset streamlined enough to fit naturally inside a narrative game.

## Current Project State

This repository is currently a clean Monogatari starter project with placeholder story content and mostly empty asset folders. That is a good starting point for this concept because the VN flow, saves, menus, Electron packaging, and asset structure are already in place.

What exists today:

- Monogatari web and Electron setup
- Starter script, options, storage, and style files
- Empty asset directories for scenes, characters, sounds, music, UI, and gallery items
- Packaging scripts for local web preview and desktop builds

What does not exist yet:

- Original setting, cast, and tournament story content
- Battle UI and rules engine
- Card data, decks, rewards, or progression systems
- Final art, audio, or presentation polish

## Vision

The game centers on a player entering a competitive card circuit where every duel has both narrative and strategic stakes. Story scenes build rivalries, friendships, sponsorship pressure, and tournament drama. Matches are short, high-information encounters that reward deck identity, tactical sequencing, and reading the opponent.

Core fantasy:

- Live the rise of a rookie duelist through local qualifiers, regional cups, and championship brackets
- Build relationships with rivals, teammates, and mentors through VN scenes
- Collect cards, refine decks, and adapt to tournament metas
- Make story choices that affect trust, routes, rewards, and available matchups

## Gameplay Pillars

### 1. Visual Novel First

The story layer should do more than introduce battles. It should create tension before matches, deepen the cast between rounds, and make tournament results feel personal.

### 2. Fast Tactical Card Battles

Battles should feel snappy and spectator-friendly:

- Small deck sizes
- Short turns
- Clear board states
- Limited resource complexity
- Strong card identity and matchup texture

### 3. Tournament-Based Progression

The primary game loop is:

1. Story scene
2. Deck edit and prep
3. Match or multi-round tournament set
4. Rewards, relationship shifts, and bracket advancement
5. New story branch or event

## Battle System Direction

This project should target a simplified digital-first card game model rather than a full tabletop simulation.

Suggested rules direction:

- Two active creatures or one active plus one bench slot, depending on UI tests
- Energy/resources generated automatically each turn instead of manually attached from hand
- Small opening hands and aggressive mulligan simplification
- Matches decided by prize points, knockout count, or best-of-one tournament rules
- Distinct card types: units, support cards, tactics, and passive gear
- Status and combo language kept intentionally compact

Desired feel:

- Easier to learn than a full TCG
- Enough interaction to support deck archetypes and counterplay
- Fast enough to fit naturally between VN scenes

## Narrative Structure

The story can be built around a season format:

- Prologue: learn the scene, meet the core cast, enter the circuit
- Local Arc: first rivalries, first deck identity, first elimination pressure
- Regional Arc: stronger opponents, team politics, deck evolution
- National Arc: scouting, media attention, personal route lock-ins
- Finals Arc: route climax and championship bracket

Character routes can influence:

- Exclusive support cards
- Practice partners and test matches
- Branching event scenes
- Different final opponents or endings

## Technical Direction

Monogatari should handle:

- Narrative scripting
- Menus and save/load flow
- Character presentation
- Scene transitions
- Global game state and route flags

Custom JavaScript should handle:

- Card database loading
- Deck validation
- Match state
- Turn flow
- AI decision logic
- Reward generation
- Tournament bracket tracking

Recommended data model:

- `js/script.js`: story scenes, branching labels, tutorial scripting
- `js/main.js`: custom bootstrapping and battle system registration
- `js/storage.js`: persistent player profile, deck inventory, tournament progress
- `assets/`: card art, UI, audio, character sprites, scenes
- future `data/` or `js/data/`: cards, opponents, tournaments, rewards

## MVP Scope

The first playable milestone should stay narrow.

Target MVP:

- 20 to 40 cards
- 3 starter decks
- 3 to 5 AI opponents
- 1 short tournament arc
- 1 tutorial match
- 1 deck edit screen
- 1 reward loop between rounds

If the MVP feels good, expansion can add more routes, mechanics, archetypes, and seasonal tournament content.

## Immediate Next Steps

1. Define the first card ruleset on paper before building UI
2. Implement battle state and a minimal Round One test match in JavaScript
3. Build the first battle screen for the Harbor City Open feature table
4. Add a simple win/loss branch after the Rook match
5. Start the first reward and deck-adjustment loop between rounds

## Running The Project

Install dependencies and launch the local preview:

```powershell
yarn install
yarn serve
```

For the Electron desktop build during development:

```powershell
yarn start
```

## Project Notes

- Project metadata now uses the working title `Card Championship League`
- The VN script now covers tournament registration, mentor/rival setup, and the Round One feature match lead-in
- Asset folders are prepared but mostly empty, so the next major gains come from writing content and defining systems

This repo is in a strong prototype phase: the shell exists, and the design challenge now is turning it into a compelling card-battle VN with a clear production plan.
