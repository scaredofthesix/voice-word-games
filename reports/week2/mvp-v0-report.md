# MVP v0 Report — Voice Word Jumper (Team 40)

> Draft skeleton — completed in Phase 4 once the application is built and deployed.

## Purpose and description
MVP v0 is a runnable/deployed technical foundation of *Voice Word Jumper* (React + Vite, served via Caddy in Docker Compose). It does not need to implement a complete user story; placeholder behavior and mocks are allowed.

## Deployment URL / runnable artifact
_TODO — public URL, accessible over the internet until the course is graded._

## Public video demonstration
_TODO — sanitized public video, < 2 minutes._

## Relationship to the prototype and proposed MVP v1 stories
_TODO — which MVP v1 stories (US-01, US-02, US-04, US-06, US-07) the foundation begins to realize._

## Current limitations, placeholders, and mocks
- Chrome-only (Web Speech API).
- **Known flaw:** word match uses `target.startsWith(t)` — a single correct first letter is accepted as a full word. Tracked for correction.
- _TODO — other mocks/placeholders._

## Local setup instructions
See [root README → Local setup](../../README.md#local-setup).

## Repeatable smoke-check scenario
**Type:** Web application.

**Access instructions:** open the deployment URL in Google Chrome.

**Steps:**
1. Navigate to the deployment URL.
2. Confirm the home screen renders.
3. Use primary navigation to reach the game-selection screen.

**Expected result:** the application opens without errors and primary navigation works.
