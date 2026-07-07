# Recenter — Documentation Index

**This is the entry point.** Any human or AI session that needs to
understand this repository should start here, not by guessing which
file to open or relying on a previous conversation's memory. This index
does not contain project state itself — it only tells you what exists,
where it lives, and in what order to read it.

For the release-level story of how the product got here, see
[`CHANGELOG.md`](./CHANGELOG.md).

---

## Company — `docs/company/`

Foundational principles and the decision ledger for the whole project.

| Document | Purpose | When to consult |
|---|---|---|
| [`CONSTITUTION.md`](./company/CONSTITUTION.md) | Approved, binding product/engineering principles (no streaks, faith-optional, deterministic over AI, local-first, etc.) | Before any product or design decision, to check whether it conflicts with an already-approved principle |
| [`DECISION_LOG.md`](./company/DECISION_LOG.md) | Chronological ledger of explicit decisions (what was decided, when, why) | When you need to know *why* something is the way it is, or before resolving a conflict between a new instruction and existing behavior |

## Product — `docs/product/`

| Document | Purpose | When to consult |
|---|---|---|
| [`PRODUCT_STATE.md`](./product/PRODUCT_STATE.md) | Current shipped product surface: onboarding, Today, Journal, Archived Journey, session flows, guardrails, what's deferred | Before touching any screen or flow, to know what already exists and what's explicitly out of scope |

## Design — `docs/design/`

| Document | Purpose | When to consult |
|---|---|---|
| [`DESIGN_STATE.md`](./design/DESIGN_STATE.md) | The design system as implemented: color/type/spacing/elevation/motion tokens, voice conventions, component inventory | Before adding any UI, styling, or animation — check for an existing token/pattern before hand-picking a new value |

## Engineering — `docs/engineering/`

| Document | Purpose | When to consult |
|---|---|---|
| [`ENGINEERING_WORKFLOW.md`](./engineering/ENGINEERING_WORKFLOW.md) | The permanent sprint-start / sprint-end process, including documentation obligations | At the start and end of every sprint, without exception |
| [`PROJECT_STATE.md`](./engineering/PROJECT_STATE.md) | Current architecture, stack, navigation, state management, known limitations, current baseline | At the start of any engineering work, to ground yourself in what's actually true today |
| [`TECH_DEBT.md`](./engineering/TECH_DEBT.md) | Full technical debt register (Low/Medium/High), each with reason for deferral and recommended approach | Before starting a refactor, or when deciding whether something is a known, accepted tradeoff vs. a new bug |
| [`ROADMAP.md`](./engineering/ROADMAP.md) | Engineering-only roadmap: completed milestones, repo maturity, upcoming priorities, infra work | When planning engineering-side work across sprints (not product features) |
| [`ADRS/`](./engineering/ADRS/README.md) | Architecture Decision Records — one file per significant, hard-to-reverse architectural decision | When architectural work is involved, or before reversing/changing an existing architectural pattern |
| [`HANDOFFS/`](./engineering/HANDOFFS/) | Permanent, point-in-time engineering handoffs, one per sprint close (e.g. `Sprint-3.md`) | To see exactly what changed and why at the close of a specific past sprint — never edited after the fact |

## Research — `docs/research/`

| Document | Purpose | When to consult |
|---|---|---|
| [`RESEARCH_STATE.md`](./research/RESEARCH_STATE.md) | Records that no formal user research exists yet | Before citing "research says X" — check here first; if it's not sourced here, don't invent it |

## Testing — `docs/testing/`

| Document | Purpose | When to consult |
|---|---|---|
| [`TESTING_STATE.md`](./testing/TESTING_STATE.md) | Summary of automated/manual test coverage, pointing into `qa/` (the authoritative source) | Before changing anything in the data/logic layer, or before deciding whether a change needs a new test |

The full QA system (test plan, coverage map, checklists) lives in
`qa/` at the repository root, not under `docs/` — `TESTING_STATE.md` is
a summary pointer into it.

## Marketing — `docs/marketing/`

| Document | Purpose | When to consult |
|---|---|---|
| [`MARKETING_STATE.md`](./marketing/MARKETING_STATE.md) | Records that no marketing artifacts exist yet | Before drafting any external-facing copy, positioning, or listing content |

## Business — `docs/business/`

| Document | Purpose | When to consult |
|---|---|---|
| [`BUSINESS_STATE.md`](./business/BUSINESS_STATE.md) | Records that no monetization model, pricing, or business plan exists yet | Before assuming any pricing, subscription, or account-gating behavior |

## Operations — `docs/operations/`

| Document | Purpose | When to consult |
|---|---|---|
| [`OPERATIONS_STATE.md`](./operations/OPERATIONS_STATE.md) | Current operational reality: CI, pre-commit hooks, deployment status (none), no monitoring | Before assuming the app is deployed anywhere, or before touching CI/release process |
| [`HANDOFFS/`](./operations/HANDOFFS/) | Operational handoffs (deployment, infra, incidents) — separate from engineering sprint handoffs | After any deployment, infrastructure change, or incident; empty until the first one occurs |

---

## Recommended AI Reading Order

Read in this order at the start of any new session, stopping early once
you have what you need for the task at hand:

1. **Constitution** (`company/CONSTITUTION.md`)
2. **Decision Log** (`company/DECISION_LOG.md`)
3. **Product State** (`product/PRODUCT_STATE.md`)
4. **Design State** (`design/DESIGN_STATE.md`)
5. **Engineering Project State** (`engineering/PROJECT_STATE.md`)
6. **Engineering Technical Debt** (`engineering/TECH_DEBT.md`)
7. **Relevant department state document(s)** — whichever of Research /
   Testing / Marketing / Business / Operations bears on the task
8. **Latest Operations sprint handoff** (`operations/HANDOFFS/`, most
   recent file)
9. **Relevant ADRs** (`engineering/ADRS/`) — only if the task involves
   architectural work
