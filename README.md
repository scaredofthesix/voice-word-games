# Voice Word Games — Team 40

A browser-based platform of **voice-controlled English word games for children**. A child pronounces the target word correctly to trigger the in-game action — voice is the only controller. Flagship game: **Voice Word Jumper** (currently Chrome-only).

- **License:** [MIT](./LICENSE)
- **Assignment 2 submission index:** [reports/week2/README.md](./reports/week2/README.md)
- **MVP v0 report:** [reports/week2/mvp-v0-report.md](./reports/week2/mvp-v0-report.md)

## Tech stack

React · Vite · Web Speech API · Caddy · Docker Compose

## Local setup

> Filled in once the MVP v0 application code lands (Phase 4). Placeholder steps:

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server (Chrome recommended — Web Speech API)
npm run dev

# 3. Or run the full container stack
docker compose up --build
```

A microphone and a **secure (HTTPS or localhost)** context are required for voice recognition.

## Repository layout

```
.
├── LICENSE                 # MIT
├── README.md               # this file
├── reports/week2/          # Assignment 2 deliverables (see index)
└── src/ ...                # MVP v0 application (added in Phase 4)
```
