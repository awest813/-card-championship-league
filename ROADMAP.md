# Card Championship League Roadmap

This roadmap treats `Card Championship League` as a premium single-player card-battle RPG built around Harbor City, tournament drama, stylish public card-sport culture, and light-but-meaningful social systems. The opening chapter is the `Harbor City Open`. `Mira` is the player’s mentor and a slow-burn romance route. `Rook` is the early nemesis and a rivalry-to-romance route.

The core product shape stays locked:

- `Monogatari layer`: story scenes, event intros, pre-match banter, lounge scenes, relationship scenes, battle launch, battle return handling
- `Custom battle module`: duel board, rules, turn flow, AI, supports, statuses, win/loss resolution, result payload
- `Shared progression state`: decks, rewards, unlocks, story flags, tournament progress, relationship variables, tournament history

The game should feel:

- fast
- readable
- premium
- tournament-first
- social
- scalable for a solo/lean production path

## Product Pillars

- `Tournament mode is a premium event framework`, not just bracket sequencing.
- `Harbor City is the launch ecosystem`, with enough venues, shops, halls, and public scene culture to carry early and mid-career progression.
- `Battle is one layer of the event fantasy`, alongside registration, bracket reveal, crowd pressure, between-round life, and aftermath.
- `Presentation density matters`: badges, match cards, venue flavor, commentator text, Mira support, Rook pressure, and crowd buzz should do a lot of the heavy lifting.
- `Filler entrants matter`: authored duelists anchor story arcs, while lightweight generated entrants make the circuit feel large and replayable.

## Tournament Tier Ladder

The long-term prestige ladder is:

1. `Local Opens`
2. `District Cups`
3. `City Opens / Circuit Events`
4. `Invitationals`
5. `Championship Qualifiers`
6. `Final Championship`

Each tier should increase:

- venue scale
- social pressure
- presentation density
- reward prestige
- rivalry visibility
- relationship reactivity

### Tier Intent

`Local Opens`
- onboarding events
- cozy community energy
- first public reputation gains

`District Cups`
- stronger fields
- district-specific tone and archetype flavor
- more visible seeding and recognition

`City Opens / Circuit Events`
- real public attention
- major bracket drama
- strong rival collision points

`Invitationals`
- exclusivity
- elite social atmosphere
- curated higher-skill fields

`Championship Qualifiers`
- high late-game pressure
- legacy stakes
- strong Mira/Rook reactivity

`Final Championship`
- ceremonial climax
- strongest event presentation in the game
- major relationship and rivalry payoff

## Phase 0: Tournament Design Lock + Systems Blueprint

Goal: lock the event fantasy, schemas, screen flow, variable model, and engineering boundaries before the content surface sprawls.

This is now the most important pre-production phase. Do not skip it.

Reference blueprint:

- see [TOURNAMENT_PHASE0_BLUEPRINT.md](/C:/Users/allen/Downloads/monogatari-v2.6.0/TOURNAMENT_PHASE0_BLUEPRINT.md)

### Phase 0 Deliverables

- finalized tournament product thesis
- finalized Harbor City launch scope
- finalized tournament tier ladder
- finalized Harbor City Open event flow
- finalized screen list and module list
- finalized icon and badge language
- finalized relationship and nemesis variables
- finalized authored entrant schema
- finalized filler entrant schema
- finalized bracket runtime schema
- finalized banter and commentary tagging model
- finalized launch/return contract between Monogatari and battle mode

### Phase 0 Product Questions

- How many rounds does each tournament tier usually run?
- Are early tournaments single elimination only?
- Which matches are shown and which are simulated?
- Which event tiers get commentators and featured-match framing?
- How often does Rook appear during an event run?
- When does Mira deliver support text?
- Which events are story-gated and which are replayable?
- Which badge types are mandatory for v1?
- How often can romanceable characters message or interrupt the player during tournament flow?

### Phase 0 Exit Criteria

- Harbor City is clearly locked as the launch tournament ecosystem
- Harbor City Open is fully specified as a premium vertical slice
- tournament screens are fully enumerated
- relationship and rivalry variables are defined
- filler entrant generation rules are defined
- event and entrant schemas exist
- banter content has a reusable structure
- Monogatari, tournament UI, battle, and progression responsibilities are clearly separated
- a developer can begin production without inventing product decisions while coding

## Phase 1: Premium Foundation

Goal: ship the first polished Harbor City Open event loop instead of just a duel prototype.

### Deliverables

- `Event Splash Screen`
- `Registration Screen`
- `Bracket Reveal Screen`
- `Opponent Match Card`
- `Between-Round Lounge Screen` v1
- `Result Screen`
- Harbor City Open event config
- first-pass bracket progression logic
- battle launch/return loop using structured context and result payloads
- Mira support text hooks
- Rook rivalry interruption hooks
- deck confirmation and reward preview in tournament flow

### Harbor City Open Vertical Slice Requirements

- event splash and identity branding
- registration scene
- deck confirmation
- bracket reveal
- at least 3 rounds of event structure
- one between-round lounge beat
- Mira support text
- visible Rook bracket presence
- result screen
- story handoff after event completion

### Exit Criteria

- a player can play through a Harbor City Open prototype and feel ceremony, pressure, and advancement
- the event feels like a real tournament, not just a chain of battles
- story and battle return cleanly through structured tournament state

## Phase 2: Battle System v3 Stabilization

Goal: turn the duel layer into a reusable tournament battle product.

### Deliverables

- support card system
- status system with `Burn`, `Stun`, and `Guarded`
- reusable effect hook pipeline
- smarter scored AI
- richer result payload with rewards, unlocks, story flags, and tournament updates
- clearer legality checks and validation
- improved inspector and combat readability
- proper support targeting feedback
- cleaner promotion / KO replacement flow

### Exit Criteria

- supports and statuses are fully readable in-board
- battle results are strong enough to drive tournament, reward, and story layers
- AI can take lethal, use supports sensibly, and obey phase rules

## Phase 3: Flavor Density

Goal: make tournaments and Harbor City feel alive between matches.

### Deliverables

- crowd buzz snippets
- commentator lines
- district-specific event flavor
- opponent archetype intros
- upset callouts
- streak callouts
- featured match callouts
- richer result text
- lounge message variations
- stronger venue identity language

### Exit Criteria

- events feel socially active rather than structurally functional
- Harbor City reads as a living card scene with public stories, not a menu hub

## Phase 4: Relationship + Nemesis Reactivity

Goal: make tournament runs feel personal and emotionally responsive.

### Required Variables

- `miraTrust`
- `rookHeat`
- `tournamentRep`
- `crowdFavor`

Optional early bonds:

- `bond_nia`
- `bond_sora`
- `bond_hana`

### Deliverables

- variable integration into pre-match lines
- variable integration into between-round support text
- post-match reaction variants
- commentator and crowd lines influenced by rep and momentum
- Rook heat ladder variants
- Mira trust ladder variants
- tournament-specific romance expression for Mira and Rook
- special collision scenes and finals variants

### Route Rules

- Mira remains `mentor first, romance second`
- Rook remains `nemesis first, romance second`

### Exit Criteria

- event scenes react to who the player has become
- tournament mode can carry rivalry tension and romance progression without breaking core roles

## Phase 5: Filler Entrants + Event Identity Packs

Goal: make Harbor City’s circuit feel large, stylish, and replayable without requiring every entrant to be hand-authored.

### Filler Entrant System

Tournament brackets should support:

- `authored entrants`
- `filler entrants`

For a 16-player bracket:

- 4 to 6 authored entrants
- 10 to 12 filler entrants

For an 8-player bracket:

- 2 to 3 authored entrants
- 5 to 6 filler entrants

### Filler Entrant v1 Fields

- id
- name
- portrait key or portrait parts
- district/origin tag
- deck archetype
- one visual hook
- one personality tag
- one intro line
- one badge tag if applicable
- optional crowd flavor tag
- optional recurrence tag

### Generation Inputs

Recommended generator shape:

- `generateTournamentEntrant(tier, district, deckBias, eventTone)`

### Event Identity Packs

- Harbor City Open
- Sunset Terminal Cup
- Bayline Wharf Cup
- Neon Mission Night Circuit
- Redwood Invitational
- Civic Crown Finals

Each event pack should vary:

- logo and color treatment
- venue tone
- announcer/commentator voice
- badge density
- local crowd feel
- text pack flavor

### Exit Criteria

- generated entrants make the bracket feel populated and believable
- authored entrants still own the emotional center
- different events feel materially different without system rewrites

## Phase 6: Prestige + Long-Term Retention

Goal: turn tournaments into a circuit career with memory and consequence.

### Deliverables

- tournament history screen
- placement archive
- champion records
- title unlocks
- streak badges
- invitational unlock chains
- prestige cosmetics or profile markers
- hall of champions
- late-game elite event chains
- filler entrant recurrence/history tags

### Exit Criteria

- tournament mode feels like a career ladder
- the player can look back on events, titles, rivals, and runs with a sense of legacy

## Required Tournament Screens

These are the minimum premium event UI modules the roadmap now assumes.

### Event Splash Screen

Must show:

- event logo
- event name
- venue
- district identity
- tier label
- subtitle or tagline
- register CTA

### Registration Screen

Must show:

- selected deck
- event format
- entry info
- reward preview
- Mira or organizer support line

### Bracket Reveal Screen

Must show:

- player seed or slot
- bracket path
- notable entrants
- rival markers
- seeded markers
- possible collision highlights

### Opponent Match Card

Must show:

- opponent portrait
- district or origin
- deck or archetype icon
- short bio
- match stakes
- relationship/rival marker
- banter block

### Between-Round Lounge Screen

Must show:

- next round preview
- current event standing
- Mira note or support message
- crowd buzz snippet
- message pane
- possible Rook interruption

### Result Screen

Must show:

- win/loss
- round cleared
- placement
- rewards
- reputation changes
- relationship changes
- next story hook

### Finals / Championship Screen

Must show:

- featured match framing
- strongest title card treatment
- commentator/crowd highlight
- biggest Mira/Rook reaction beat
- championship stakes

### Tournament Summary / History Screen

Must show:

- final placement
- event name
- rewards earned
- badges or titles
- aftermath hook
- archive entry

## Icon / Badge Language

First release icon set:

- Seeded Entrant
- Rival
- Nemesis
- Mentor Support
- Friend
- Romance Interest
- Local Favorite
- Crowd Favorite
- Win Streak
- Upset Alert
- Featured Match
- Elite Entrant
- Finalist
- Champion

Optional archetype icons:

- Aggro Specialist
- Control Specialist
- Combo Specialist
- Defensive Specialist
- Trickster / Disruption Specialist

Rule: these do not all need deep mechanics in the first release. Some can remain visual-only or text-trigger-only if they still improve clarity and premium presentation.

## Content Model Rules

Tournament flavor should become tagged content packs, not UI hardcode.

### Banter Categories

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

### Tag Dimensions

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

## Suggested Module Expansion

As the current repo grows, it should trend toward:

```text
/src
  /tournament
    tournamentState.js
    tournamentFlow.js
    bracketEngine.js
    entrantGenerator.js
    tournamentConfigs/
    entrantConfigs/
    fillerPools/
    tournamentUI/
    tournamentText/
    tournamentBadges/
    tournamentThemes/
  /story
    monogatariTournamentBridge.js
  /battle
    BattleScene.js
  /shared
    progressionState.js
    relationshipState.js
    tournamentHistory.js
```

In the current Monogatari project structure, that translates to gradually separating:

- `battle engine logic`
- `tournament flow logic`
- `shared progression and relationship logic`
- `data/text packs`

instead of letting `main.js` or story files absorb those responsibilities.

## Recommended Immediate Priorities

1. Finish and document Phase 0 tournament blueprint inside the repo
2. Build Harbor City Open screens around the current battle launch/return contract
3. Add tournament runtime state and bracket reveal flow
4. Add Mira/Rook event-reactive line packs
5. Add authored + filler entrant support for bracket population

## Known Risks

- treating tournament mode like a simple battle menu
- hardcoding event flavor directly into UI logic
- overbuilding simulation before premium presentation exists
- writing romance content that weakens core mentor/rival roles
- expanding event count before Harbor City Open feels truly premium
- letting Monogatari story scripting absorb battle or bracket logic

## Final Lock Statement

`Card Championship League` should use Harbor City as its fully playable launch tournament ecosystem and build tournament mode as a premium event framework rather than a simple bracket utility. Mira is a romanceable mentor route, Rook is a romanceable rival-to-romance route, and tournament brackets should be populated by a mix of authored named entrants and lightweight generated filler NPCs so the city scene feels large, stylish, reactive, and replayable without requiring every slot to be hand-authored.
