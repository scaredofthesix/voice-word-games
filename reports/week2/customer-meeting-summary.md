# Customer Meeting Summary - Assignment 2 (Team 40)

- **Date:** 2026-06-13
- **Participants / roles:** Customer (product owner / domain expert); Team 40 members (attended the review; identities are kept private per the sanitization policy).
- **Artifacts demonstrated:** the documented user stories and MoSCoW priorities ([user-stories.md](./user-stories.md)), the initial proposed MVP v1 scope, the Figma prototype, and the running MVP v0 (Voice Racer and Voice Bubble Popper) on localhost.
- **Evidence:** sanitized [transcript](./customer-meeting-transcript.md) (published with customer permission); recording shared privately with instructors via Moodle.

## MIT-license consent

Written consent to the public MIT-licensed development model was obtained from the customer **before** the repository was created (recorded in the team's prior written communication with the customer; the consent message is included as evidence in the Moodle PDF). At this review the customer reaffirmed it: the MIT license is present in the repository and the customer confirmed "all looks good".

## Discussion points

- **User stories and roles.** The team walked through 13 stories across three personas (child learner, parent, teacher). The customer questioned why "start quickly" and "simple home screen" are split; the team explained they are related but distinct interface concerns.
- **Terminology.** The customer asked the team to use "round" consistently instead of mixing "attempt" and "round".
- **Per-word feedback vs. results.** The customer agreed they are distinct (one is per-word correctness, one is the game score) but judged per-word feedback to be mostly valuable to parents, so it should be a Should Have rather than a Must Have.
- **Recognition reliability.** The customer stressed (from their own Doodle Jump prototype) that the speech engine cannot be fully trusted; the game must let the child retry a word multiple times so they never lose to a misrecognition. The team proposed a word-selection heuristic (per-word statistics, surface struggling words - spaced repetition).
- **Model pronunciation.** The customer wanted clicking a word to play its pronunciation, and surfacing the native-language (Russian) translation, with clickable English/Russian audio as a nice addition.
- **Progress tracking as a single source of truth.** Progress must be tracked per individual word, pooled across all lists and all games (not per list); custom teacher lists must not discard prior progress on overlapping words.
- **Localization.** UI text should default to the child's native language (Russian); a language toggle would add flexibility.
- **Prototype / MVP v0 demo.** The customer reviewed the running app, liked the colorful, animated, scrollable menu, and confirmed the prototype and MVP v0 may be the same artifact. Issues observed: Bubble Popper ran too fast and recognition occasionally stalled; "Fun Clue" is an unimplemented placeholder.
- **Long phrases and pause.** Open design discussion on fitting multi-word phrases into gameplay (sentence at the top with the current word highlighted, or one word per platform/lane) and on adding a pause button that also stops the microphone.
- **Recognition quality target.** The customer suggested defining an accuracy threshold (around 80-90%, not viable below ~70%) and, ideally, an evaluation set of children's pronunciations.

## Decisions

- Product name confirmed as **Voice Games** (from "Voice Word Games"), since the product may include phrases, not only words.
- MoSCoW changes accepted:
  - US-06 (per-word feedback): Must Have -> **Should Have**.
  - US-08 (retry until recognized / multiple attempts): Should Have -> **Must Have**.
  - US-09 (hear model pronunciation): Should Have -> **Must Have**.
  - US-10 (parent progress review): Could Have -> **Must Have**, but **not in MVP v1**.
  - US-11 (custom word list): Could Have -> **Must Have**.
- US-14 (real-time multiplayer): confirmed **Removed** / out of scope ("overkill at this stage").
- New stories added from the discussion: **US-15** (see/hear translation, Should Have), **US-16** (pause the game, Could Have), **US-17** (localized UI / language toggle, Should Have).
- "round" adopted as the consistent term over "attempt".
- Prototype and MVP v0 accepted as the same running artifact.

## Action points

- Update [user-stories.md](./user-stories.md) with the new priorities, the new stories, and consistent "round" terminology. (Done.)
- Implement multiple-attempts tolerance and a per-word selection heuristic (US-04 / US-08).
- Add clickable word pronunciation and native-language translation (US-09 / US-15).
- Design progress tracking as a single per-word source of truth pooled across lists and games (US-10 / US-11).
- Default UI to Russian with a language toggle (US-17); add a pause button that stops the mic (US-16).
- Investigate recognition accuracy (canonical forms, Levenshtein distance, recognition hints); define an accuracy target and, later, an evaluation set.
- Ensure a stable ~5-minute play session without breakage; fix the Bubble Popper speed/recognition issue.

## Risks

- Web Speech API is effectively Chrome-only (US-13 is Won't Have for the course).
- Voice recognition accuracy is the dominant product risk: if reliable recognition of children's speech cannot reach roughly 70%+, core gameplay may not be viable.
- Fitting long phrases into fast-paced gameplay is an unresolved UX problem.
- Misclicks on clickable translations during fast gameplay.

## Customer feedback

Positive on the overall design and direction (colorful, animated, child-friendly menu; clear core loop). Main concerns are recognition reliability and gameplay robustness over a normal session, plus localization of UI text into Russian. Prototype and interface artifacts were shown; the customer's feedback was incorporated as above (their approval of the prototype is not required by the assignment).

## Customer approvals

- [x] Documented user stories (approved, with the changes above incorporated)
- [x] MoSCoW priorities (approved as revised in this meeting)
- [x] Initial proposed MVP v1 scope (approved)
- [x] Reaffirmed consent to the public MIT-licensed development model (originally obtained before repository creation)

## Resulting changes

- [user-stories.md](./user-stories.md): priority changes for US-06, US-08, US-09, US-10, US-11; new US-15, US-16, US-17; US-14 reason updated to note customer confirmation; "round" terminology; MVP v1 scope updated to US-01, US-02, US-04, US-07, US-08 (US-06 removed from scope after its downgrade).
- [analysis.md](./analysis.md): learning points, validated/rejected assumptions, and planned response updated from this review.
- [README.md](./README.md): customer-review links and coverage section updated.
