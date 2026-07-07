# Architecture Decision Records

Each ADR captures one significant, already-made architectural decision:
the context, the decision, and the consequences. ADRs are historical —
once written, don't edit one to reflect a later reversal; write a new
ADR that supersedes it and link back.

Naming: `NNNN-short-title.md`, zero-padded, sequential.

## Index

| ADR | Title | Status |
|---|---|---|
| [0001](./0001-repository-pattern.md) | Strict repository pattern for all persistence | Accepted |
| [0002](./0002-recommendation-confidence-layer.md) | Confidence layer separate from session-type selection | Accepted |

This directory was backfilled at the close of Sprint 3 from decisions
already implemented and recorded elsewhere in the repository (commit
history, `docs/company/DECISION_LOG.md`). It is not a complete history of
every architectural choice ever made in this codebase — only the ones
judged significant enough to warrant a standalone record. Add new ADRs
going forward for any decision that would be genuinely costly to
reverse or that a future session would otherwise have to rediscover from
scratch.
