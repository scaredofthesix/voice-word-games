# Week 2 Analysis (Team 40)

## Learning points

- **Writing user stories.** Splitting closely related needs into separate stories (e.g., "start quickly" vs. "simple home screen") triggered a useful customer question and forced us to articulate the distinct value of each. We also learned the value of consistent terminology: the customer flagged that we mixed "attempt" and "round", which we standardized on "round".
- **Prioritization (MoSCoW).** Priorities are not fixed by the team alone - the customer materially reshaped them. Several stories moved in both directions in one meeting (feedback down to Should Have; retry, model pronunciation, parent progress, and custom word lists up to Must Have). We learned to treat MoSCoW as a negotiation artifact and to separate "is this a current requirement" (status) from "how important is it" (MoSCoW) and from "is it in the first slice" (MVP v1 scope) - e.g., parent progress is now a Must Have that is deliberately not in MVP v1.
- **Prototyping and interface design.** A running prototype communicated far more than the written stories: ambiguous points ("distinct interface", how feedback looks) only became clear during the live demo. Showing real screens surfaced concrete design problems (long phrases, misclicks, localization) that text reviews had missed.
- **MVP v0 deployment.** Building a runnable foundation early exposed real defects under demonstration (Bubble Popper speed runaway, intermittent recognition stalls) that we would not have found from documents alone. We learned to define a realistic smoke window (a stable ~5-minute session) as the bar for "usable".
- **Customer validation.** The customer's own prior prototype experience was the most valuable input: their hard-won lesson (never let a child lose to a misrecognition) became a Must Have we had underweighted.

## Validated assumptions

- **Confirmed - voice as the only controller.** The customer endorsed the core premise (children skip pronunciation when an alternative exists), so voice-only control stays central.
- **Confirmed - two-game MVP scope.** Voice Racer and Voice Bubble Popper as the primary MVP v1 games were accepted.
- **Confirmed - prototype and MVP v0 can be the same artifact.** The customer explicitly agreed, simplifying our deliverables.
- **Confirmed - teachers need custom word lists.** Our assumption that custom vocabulary matters was upgraded by the customer to a Must Have.
- **Rejected - per-word feedback is a core child-facing Must Have.** The customer reframed it as mostly parent-facing, so it dropped to Should Have.
- **Rejected - recognition can be treated as reliable.** The customer's experience (and our live demo) showed the Web Speech API stalls and mis-hears; we must design around it (multiple attempts, tolerance) rather than assume accuracy.
- **Rejected - English-only UI is acceptable.** The customer noted users read Russian, not English, so the interface should default to Russian (US-17).
- **Confirmed - no public backend needed yet.** Local/VM storage is sufficient for current scope (affects US-05, US-10).

## Needs clarification

- **Recognition accuracy target and measurement.** What threshold makes the game enjoyable (customer suggested ~80-90%, ~70% as a viability floor) and how do we measure it - do we build an evaluation set of children's pronunciations, and from what source (US-04)?
- **Matching tolerance.** The current matcher in `src/utils.ts` is overly permissive (a correct first letter can count as a full word); the customer wants reliability without frustrating strictness. What is the right strategy (canonical forms, Levenshtein distance, recognition hints) (US-04 / US-06)?
- **Long phrases in gameplay.** How to present multi-word phrases - full sentence at the top with the current word highlighted, or one word per platform/lane (US-03)?
- **Translation audio behavior.** Should the native-language translation auto-play after a correct attempt or remain click-only, and how do we avoid misclicks during fast gameplay (US-15)?
- **Should US-06 and US-07 share one screen?** The team proposed merging their presentation; the customer kept them as distinct stories. The exact end-of-round layout (score + words-correct) is still open (US-06 / US-07).
- **Bubble Popper speed.** The speed currently increases without a cap and broke during the demo; what is the intended difficulty curve (US-12)?

## Planned response

- **MVP v1 core loop** stays small and robust: US-01, US-02, US-04, US-07, and now US-08 (retry until recognized), so the loop survives imperfect recognition - directly addressing the customer's top concern.
- **Recognition work** is scheduled as a focused investigation for a later iteration (canonical forms, Levenshtein distance, recognition hints) with an explicit accuracy target before we commit to gameplay depth (US-04 / US-06).
- **Model pronunciation and translation** (US-09 Must Have, US-15 Should Have) will be added with clickable English/Russian audio.
- **Localization** (US-17) will default the UI to Russian with a toggle.
- **Progress tracking** (US-10, US-11) will be designed as a single per-word source of truth pooled across lists and games, kept out of MVP v1 but architected so custom lists preserve prior progress.
- **Stability** is the immediate engineering priority: fix the Bubble Popper speed/recognition issue so a normal ~5-minute session does not break (smoke-check bar in [mvp-v0-report.md](./mvp-v0-report.md)).
