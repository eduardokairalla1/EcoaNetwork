# Overview

Ecoa Network is a decentralized platform for publishing and reading reviews, complaints, and experiences about companies, products, services, and other entities.

The core idea: a review is not a row in someone's database — it's a **signed, immutable event**. No single company, server, or admin can silently edit or delete what a user published — its authenticity stays checkable by anyone holding a copy.

*Hiding* is a weaker guarantee, and worth stating honestly: a reader only ever sees what the indexer they queried chose to return. That guarantee is worth exactly as much as the number of independent gateways and indexers that exist, which on day one is one, run by this project. See [concepts.md](./concepts.md#progressive-decentralization).

## The problem

Centralized review platforms have structural weaknesses:

- One company controls existence and visibility of content.
- Content can be removed or ranked unilaterally.
- A single outage takes the whole service down.
- Reputation algorithms are opaque and unaccountable.
- If the company shuts down, user history is lost.

An open, identity-less platform has the opposite problem: spam, bots, fake reviews, Sybil attacks, defamation, and abuse are trivial without any accountability.

Ecoa Network's goal is to balance both: decentralization and censorship-resistance on one side, integrity and abuse-resistance on the other.

## Core principles

1. **Events are the source of truth.** Reviews exist as signed events, not rows in a central table.
2. **The index is not authoritative.** An index is a fast, queryable *projection* of events — it can be wiped and rebuilt from whatever the network still holds, regardless of what database or technology builds it. Retention is a per-operator choice, so once nodes start pruning, an event every node has dropped is genuinely gone. (No v1 node prunes, so for now the log is complete; see [protocol.md](./protocol.md#sync-against-a-peer-that-pruned-data).)
3. **Users own their identity.** Private keys never leave the user's device; no API or server can sign on a user's behalf.
4. **Publications are immutable.** Edits and deletions are new events referencing the original — nothing is silently rewritten.
5. **Moderation is separate from publication.** Whether an event is *valid* (signature, authorship, schema) is independent of how it's *labeled or displayed* (spam, off-policy, hidden).
6. **Every component is replaceable.** Client, gateway, indexer, and moderation service can all be swapped without losing identity or history.
7. **Decentralization is progressive.** Day one, the project runs most of the infrastructure. Over time, communities and organizations run their own nodes, APIs, and indexers.
8. **Some things are facts, others are observations.** What an event says and who signed it is a fact any implementation reproduces identically. When a node first saw it, whether a DNS record still resolves, how much an identity's vote weighs — those are observations, local to whoever made them, and honest implementations can differ. Confusing the two is how a decentralized system grows a hidden authority; see [architecture.md](./architecture.md#what-must-be-identical-across-indexers-and-what-must-not-be).

## Non-goals (v1)

- No blockchain, no token/cryptocurrency.
- No requirement that every browser be a full P2P node.
- No global consensus or "vote on the truth" mechanism.
- No guarantee that a removed event physically disappears from every node.
- Not a replacement for legal/consumer-protection processes.
- No full DHT, no mobile app, no desktop client in the first version.
- No company verification beyond proven control of a domain — CNPJ verification needs a manual process and is deferred.

See [mvp.md](./mvp.md) for the exact v1 scope, and [architecture.md](./architecture.md) for how the pieces fit together.
