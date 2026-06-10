# Team 40 subagents (Assignment 2)

Drop the `.claude/` folder at the repository root. Claude Code picks up every
agent in `.claude/agents/`. Each file's `name:` field matches its filename.

## Planning and checks
- assignment-planner: builds the phased execution plan.
- assignment-compliance-checker: checks deliverables against the requirements.

## Writers
- user-story-writer: user stories, stable IDs, MoSCoW, MVP v1 scope.
- prototype-interface-designer: graphical prototype (home, game selection, main game, results).
- mvp-v0-reporter: mvp-v0-report.md with deployment, limits, smoke check.
- customer-meeting-assistant: customer review materials and meeting summary/transcript/notes.
- week2-index-builder: reports/week2/README.md index.
- week2-analysis-writer: analysis.md.
- llm-usage-reporter: llm-report.md.

## Evidence and submission
- link-and-evidence-checker: links, Lychee, screenshots, PR/MR evidence.
- submission-pdf-checker: Moodle PDF content check.

## Cleanup
- text-humanizer: removes AI writing tells, hard ban on em and en dashes. Run on report prose before it ships.
