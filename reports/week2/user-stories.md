# User Stories - Voice Games (Team 40)

Product: a browser-based platform of **voice-controlled English word games for children**. A child must pronounce a target word correctly to trigger an in-game action - **voice is the only controller**, because children skip pronunciation tasks whenever another way to finish exists. Platform: **Voice Games** (games: Voice Racer, Voice Bubble Popper; currently Chrome-only).

> Stable IDs (`US-01`, `US-02`, ...) must never be changed, reused, or reassigned. Removed stories keep their IDs and are preserved below. Requirement status (Active / Removed) is independent of MoSCoW priority. Priorities and scope below reflect the customer review on 2026-06-13 (see [customer-meeting-summary.md](./customer-meeting-summary.md)).

## Roles / personas

- **Child learner** - primary user, roughly ages 6-10, learning English pronunciation through play. Cannot read long instructions; motivated by immediate, fun feedback.
- **Parent** - sets up the game for the child, cares about safety and visible learning progress.
- **Teacher** - uses the games in or after class, may want curated vocabulary aligned to lessons.

---

## US-01: Start a game from the home screen

**Requirement status:** Active
**MoSCoW priority:** Must Have

As a child learner,
I want to open the app and start playing from a simple home screen,
so that I can begin a game quickly without help from an adult.

### Notes and constraints

- Home screen must be large-button, low-text, child-friendly.
- Entry point to the whole experience; first screen in the prototype.

## US-02: Choose which word game to play

**Requirement status:** Active
**MoSCoW priority:** Must Have

As a child learner,
I want to pick a game from a small game-selection screen,
so that I can play the game I find most fun today.

### Notes and constraints

- Long-term vision is up to 10 games; for MVP v1 the primary playable games are Voice Racer and Voice Bubble Popper, others may appear as "coming soon".
- Selection screen is a distinct interface in the prototype.

## US-03: See the target word clearly

**Requirement status:** Active
**MoSCoW priority:** Must Have

As a child learner,
I want to clearly see the word I have to say,
so that I know what to pronounce.

### Notes and constraints

- Large, readable font that does not obscure gameplay.
- Supporting image/icon (or emoji) is optional, not required (customer: "this is not a must-have ... optional then").
- Showing the native-language translation beneath the word is handled by US-15.
- **Open design question (long phrases):** a multi-word phrase such as "I go to school" does not fit cleanly into a single game element. Candidate approaches discussed with the customer: show the full sentence at the top of the screen and highlight the current word, or place each word on a separate platform/lane.

## US-04: Pronounce a word to trigger the in-game action

**Requirement status:** Active
**MoSCoW priority:** Must Have

As a child learner,
I want my correct pronunciation of the target word to make the game act (e.g., steer the car into a lane),
so that my voice is the way I control and win the game.

### Notes and constraints

- Core gameplay loop. Uses the Web Speech API for recognition.
- Tolerance to multiple attempts is mandatory (see US-08): the child must not lose because the speech engine failed to recognize a correctly pronounced word.
- **Word selection heuristic:** maintain per-word statistics and surface words the child struggles with more frequently (spaced repetition without strict time constraints).
- **Open question / known risk:** voice matching tolerance must be calibrated - too permissive breaks the learning goal, too strict frustrates young learners. The customer asked the team to target a recognition accuracy threshold (roughly 70-90%) and, ideally, build an evaluation set of words pronounced by children to measure against (see analysis.md).

## US-05: Grant microphone access easily

**Requirement status:** Active
**MoSCoW priority:** Must Have

As a parent (on behalf of the child),
I want a clear microphone-permission prompt and a fallback message if access is denied,
so that the game can hear the child and we understand what to do if it cannot.

### Notes and constraints

- Microphone requires a secure (HTTPS) context.
- No public backend is required for this; data persists in browser storage (the team plans to host on the Innopolis VM).
- Represented as the "mic permission / mic denied" states in the game-screen prototype.

## US-06: Get immediate feedback on each attempt

**Requirement status:** Active
**MoSCoW priority:** Should Have

As a child learner,
I want clear feedback showing which words I pronounced correctly or incorrectly,
so that I (and my parent) can see what needs more practice.

### Notes and constraints

- **Downgraded from Must Have to Should Have at the customer review:** children are primarily motivated by progressing in the game rather than reviewing word-level statistics; per-word feedback is mostly valuable to parents.
- Its on-screen presentation may be consolidated with the results screen (US-07); the two remain distinct stories because one is about per-word correctness and the other is about the game score.

## US-07: See my results at the end of a round

**Requirement status:** Active
**MoSCoW priority:** Must Have

As a child learner,
I want to see a simple results screen with my score at the end of a round,
so that I feel a sense of achievement and want to play again.

### Notes and constraints

- Keep it simple: final score, best score, and a "play again" button (Doodle-Jump-style end screen); may optionally show how many words were said correctly.
- Terminology: use "round" consistently (not "attempt") across the product and docs.

## US-08: Retry a word until it is recognized

**Requirement status:** Active
**MoSCoW priority:** Must Have

As a child learner,
I want to pronounce a word several times until the game recognizes it,
so that I do not lose just because the speech engine misheard me.

### Notes and constraints

- **Upgraded from Should Have to Must Have at the customer review.** The customer (from their own prototype experience) stressed that recognition quality cannot be fully controlled, so the game design must let the child attempt a word multiple times until success.
- Give more time/attempts when an in-game hazard is far away; losing to a nearby hazard is acceptable, losing to a recognition failure is not.
- Telling the child to pronounce the word differently (coaching) is a nice-to-have, not part of this Must Have.

## US-09: Hear how the word should sound

**Requirement status:** Active
**MoSCoW priority:** Must Have

As a child learner,
I want to click a word and hear how it should be pronounced,
so that I can imitate it correctly.

### Notes and constraints

- **Upgraded from Should Have to Must Have at the customer review** ("click a word to hear its pronunciation - this is a must-have").
- Can use the Web Speech API speech-synthesis side for the English audio. Native-language audio is covered by US-15.

## US-10: Review my child's progress

**Requirement status:** Active
**MoSCoW priority:** Must Have

As a parent,
I want a dedicated section in the main menu to see which words my child has practised and how they performed,
so that I can support their learning.

### Notes and constraints

- **Upgraded from Could Have to Must Have at the customer review, but intentionally excluded from MVP v1** (later milestone).
- **Single source of truth for progress:** track statistics per individual word, pooled across all word lists and all games - not per list. If two lists both contain "apple" and the child encountered it three times across games, the progress for "apple" is three. Per-list/per-group views may be shown as percentages, but the underlying data is one shared word-level store.

## US-11: Create a custom word list

**Requirement status:** Active
**MoSCoW priority:** Must Have

As a teacher,
I want to define a custom list of words for the games,
so that practice matches my current lesson vocabulary.

### Notes and constraints

- **Upgraded from Could Have to Must Have at the customer review:** teachers need to upload lesson-specific vocabulary for their students.
- A custom list is independent from the built-in categories (e.g., space, animals) but must not discard accumulated progress: prior per-word history carries over for any overlapping words (see US-10 single source of truth).

## US-12: Adjust difficulty level

**Requirement status:** Active
**MoSCoW priority:** Could Have

As a parent,
I want to choose a difficulty level (word length / speed),
so that the challenge fits my child's age and ability.

### Notes and constraints

- Connected to the word-list feature: choosing a list/level that matches the child's language level.

## US-13: Play on any browser

**Requirement status:** Active
**MoSCoW priority:** Won't Have

As a child learner,
I want to play in any browser (Firefox, Safari, mobile),
so that I am not restricted to Google Chrome.

### Notes and constraints

- **Won't Have for the course:** voice recognition relies on the Web Speech API, whose reliable support is effectively Chrome-only. Full cross-browser parity is intentionally excluded from the intended product scope for the duration of the course. Will be revisited as a future direction.

## US-15: See and hear the word's translation

**Requirement status:** Active
**MoSCoW priority:** Should Have

As a child learner,
I want to see the target word together with its native-language (Russian) translation, each clickable to hear its pronunciation,
so that I understand the word even if I cannot yet read English.

### Notes and constraints

- Added at the customer review. The customer wanted the English word's translation surfaced; clickable English and Russian audio is a nice addition.
- **Open questions:** whether the translation should auto-play after a correct attempt or only on click (currently proposed as click-only); risk of accidental taps during fast gameplay; very young children may not read Russian either.

## US-16: Pause the game

**Requirement status:** Active
**MoSCoW priority:** Could Have

As a child learner,
I want to pause the game mid-round,
so that I can take a break without losing.

### Notes and constraints

- Added at the customer review. Pausing must also stop the microphone.

## US-17: Localized interface with a language toggle

**Requirement status:** Active
**MoSCoW priority:** Should Have

As a child learner (and the parent setting up the game),
I want the interface text in my native language (Russian), with a toggle,
so that I can navigate the app even though I do not read English yet.

### Notes and constraints

- Added at the customer review: the customer noted users know Russian, not English, so UI text should default to Russian; a language toggle makes it more flexible.

---

## Removed stories

## US-14: Real-time multiplayer voice race

**Requirement status:** Removed
**Previous MoSCoW priority:** Could Have

As a child learner,
I want to race another child in real time by pronouncing words faster,
so that the game is more competitive and social.

**Reason:** Removed as a candidate requirement during Assignment 2 and confirmed out of scope by the customer at the review ("overkill at this stage"). It requires real-time networking and matchmaking that are infeasible within the course timeframe and divert effort from the core single-player learning loop. ID US-14 is retired, not reused.

---

## Initial proposed MVP v1 scope

A small, playable core loop selected **only from Must Have** stories. It spans the prototype screens (Home -> game selection -> main game with microphone interaction -> results):

- **US-01** - Start a game from the home screen
- **US-02** - Choose which word game to play
- **US-04** - Pronounce a word to trigger the in-game action (core mic interaction)
- **US-07** - See my results at the end of a round
- **US-08** - Retry a word until it is recognized (keeps the core loop playable despite imperfect recognition)

Supporting Must-Have stories **US-03** (see the target word) and **US-05** (microphone permission) are realized as elements and states *within* the main game screen of the same prototype, so the prototype covers them without listing them as separate scope items.

Other Must-Have stories (US-09 model pronunciation, US-10 parent progress, US-11 custom word lists) are accepted product requirements but intentionally left out of this initial MVP v1 slice to keep it small and prototypable.

> This is an initial proposal, not a final delivery commitment. It will be refined, estimated, and finalized in Assignment 3.
