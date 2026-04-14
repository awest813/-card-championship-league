# Card Championship League

`Card Championship League` is a single-player card-battle RPG built with Monogatari and a custom JavaScript battle module. The game is set in `Harbor City`, where the player enters the `Harbor City Open`, learns under `Mira`, and collides early with `Rook`, the rising rival who turns every bracket run into a public story.

The target product is a commercial, story-driven tournament card game with premium event presentation, fast readable battles, strong rivalry chemistry, and light-but-meaningful relationship systems.

## Project Position

This repository is an active prototype moving toward a commercial vertical slice.

What is already in the project:

- Monogatari story shell and save flow
- custom battle scene with active/bench board state
- starter decks and early Harbor City battle content
- support cards, statuses, AI, and battle result payloads
- roadmap and Phase 0 tournament blueprint for production planning

What is still in progress:

- Harbor City Open tournament presentation screens
- bracket runtime and filler entrant generation
- larger card pool and deckbuilding depth
- relationship-reactive event text and route expansion
- final art, audio, and commercial polish

## Product Direction

The game should feel like:

- a premium single-player card RPG
- a sports-anime event arc
- a stylish city card-scene drama
- a tournament-first progression game

The player fantasy is:

- entering branded events
- building and selecting decks
- climbing the Harbor City circuit
- earning attention from the scene
- forming bonds and rivalries
- carrying match outcomes back into story

## Core Architecture

The project is built around three layers:

### 1. Monogatari Layer

Owns:

- story scenes
- dialogue
- registration and event scenes
- relationship beats
- pre-match banter
- between-round lounge scenes
- battle launch and battle return handling

### 2. Custom Battle Module

Owns:

- duel board rendering
- battle rules and phases
- hand/deck/discard/active/bench state
- supports and statuses
- AI turns
- win/loss resolution
- structured battle result payloads

### 3. Shared Progression State

Owns:

- selected deck
- rewards and unlocks
- story flags
- tournament progress
- relationship values
- tournament history

## Current Battle Baseline

The live prototype battle format currently supports:

- 20-card decks
- opening hand of 5
- 1 active battler
- up to 3 benched battlers
- 1 draw per turn
- 1 energy attachment per turn
- optional retreat once per turn
- 1 attack per turn, ending the turn
- KO scoring to 3 points
- immediate loss if a side cannot replace a KO'd active

Current v3 battle features include:

- support cards
- status effects: `Burn`, `Stun`, `Guarded`
- hook-based effect resolution
- inspector panel
- scored enemy AI
- structured result payloads for story and tournament flow

## Harbor City Open

The opening premium event is the `Harbor City Open`.

Its job in the final product is to prove that the game cares about tournament presentation, not just battle sequencing. The Harbor City Open should deliver:

- event identity
- registration and deck confirmation
- bracket reveal
- at least three rounds of event structure
- Mira support beats
- visible Rook pressure across the bracket
- a clean result handoff back into story

The repo now includes a dedicated Phase 0 blueprint for tournament mode:

- [TOURNAMENT_PHASE0_BLUEPRINT.md](/C:/Users/allen/Downloads/monogatari-v2.6.0/TOURNAMENT_PHASE0_BLUEPRINT.md)

And the higher-level production plan remains in:

- [ROADMAP.md](/C:/Users/allen/Downloads/monogatari-v2.6.0/ROADMAP.md)

## Repository Layout

Key files and folders:

- `js/script.js`: Monogatari story content
- `js/main.js`: battle/story bridge and runtime bootstrapping
- `js/storage.js`: default save shape
- `js/data/`: battle data, decks, statuses, rivals
- `js/battle/`: hook, AI, and battle-result helpers
- `js/story/`: launch and result bridge helpers
- `js/shared/`: progression state
- `js/systems/battle-system.js`: current standalone battle scene implementation
- `style/main.css`: VN and battle scene presentation

## Development Priorities

Near-term priorities:

1. build the Harbor City Open event screens
2. add bracket runtime state and reveal flow
3. expand event text packs for Mira, Rook, and crowd buzz
4. add authored + filler entrant support
5. continue tightening battle readability and tournament handoff

## Running the Project

Install dependencies and run the local web build:

```powershell
yarn install
yarn serve
```

Run the Electron build in development:

```powershell
yarn start
```

## License

This repository is currently intended for a commercial product and is not open source.

See:

- [LICENSE](/C:/Users/allen/Downloads/monogatari-v2.6.0/LICENSE)
