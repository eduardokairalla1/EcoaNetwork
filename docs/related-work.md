# Related Work

The nearest neighbours to this design, what each one solves, what each one leaves open, and where this project actually sits. Written early rather than at the end, because the honest answer to *"why not just use an existing protocol?"* should shape the design rather than be assembled to defend it afterwards.

The short version: **the transport and event model here is known art**, and the position between Nostr's simplicity and AT Protocol's weight is a deliberate choice rather than an accident. What is genuinely different is narrower than it first looks, and worth stating narrowly.

---

## Nostr

Signed events with content-derived ids, pluggable clients, no blockchain, no consensus. The closest neighbour by event model, and the comparison anyone familiar with the space will reach for first.

**What it solves.** An event is a signed object whose id is a hash of its content, clients are interchangeable, and nobody needs permission to publish or to run infrastructure. Extension happens through NIPs rather than through a central roadmap.

**What it leaves open — and this is the substantive difference.** [Relays deliberately do not talk to each other](https://nostr.how/en/the-protocol): the protocol defines no gossip layer, no relay mesh, and no replication between relays. Publishing to relay A means relay B does not have the event unless a client also sent it there. Individual implementations may build syncing, but it is not part of the protocol and no client can rely on it.

The consequence is durability. If a relay disappears, an event survives only where a client happened to also publish it. Redundancy is a client-side habit, not a property of the network.

**Where this project differs.** Nodes here replicate to each other by design: Gossipsub for new events, and a sync protocol so a node that was offline can ask what it missed ([protocol.md](./protocol.md#node-to-node-sync)). That is the piece Nostr deliberately leaves to clients, and building it is most of the cost of this project's network layer. Whether it is worth that cost is a fair question — for a review platform where the archive *is* the product, we think it is.

---

## AT Protocol

Signed repositories as the source of truth, a relay aggregating a firehose, and AppViews projecting it into something queryable. Architecturally the closest neighbour to the split this project makes between an event log and an index.

**What it solves.** A user's repository is a [signed Merkle tree](https://atproto.com/guides/glossary) verifiable against keys published under their DID. Identity is a DID rather than a server address, so a user can move hosts and keep it. AppViews are explicitly projections — "a bit like search engines on the Web" — which is the same log-is-truth, index-is-opinion separation this project makes.

**It also already has pluralistic moderation.** [Labelers are independent services](https://bsky.social/about/blog/03-12-2024-stackable-moderation) that publish labels, and users subscribe to the ones they trust, stacking them on top of a default. That is the same shape as moderation here: a separate stream of labels, applied by consumers who chose to follow the labeler, never deleting the underlying content.

This is worth stating plainly rather than glossing, because an earlier framing of this project claimed moderation-as-projection as a contribution. **It is not.** AT Protocol shipped the idea first and at scale. Converging on the same design independently is a signal that the design is right, not evidence of originality.

**What it costs.** Merkle repositories per user, DID resolution, handle verification by domain, and a lexicon system are a lot of machinery. It buys real properties — account portability above all — and it is more than this project needs for a first version.

**Where this project differs.** Events here are individual signed objects with an explicit replace chain, not entries in a per-user Merkle repo. Simpler to implement and simpler to explain; it gives up the cheap full-repo integrity proof that a Merkle tree provides.

---

## Secure Scuttlebutt

Per-identity append-only signed logs, replicated by gossip along the social graph. The oldest of the four and the closest on replication.

**What it solves.** [Each feed is bound 1:1 to an identity](https://ssbc.github.io/ssb-db/) and only its owner can extend it. Replication is genuinely simple: ask a peer for everything newer than the latest message you hold. Offline-first by construction.

**What it leaves open.** [Fork attacks are a known, unresolved problem](https://dicg2020.github.io/papers/kermarrec.pdf): an author can publish two different messages at the same index, turning their log into a tree, and how nodes should react is non-trivial. Research protocols such as 2P-BFT-Log exist to address it, but it is not settled.

**Worth borrowing the lesson.** That fork is the same shape as the conflicting-rotation problem here — one signer, two mutually exclusive continuations. This project's answer is to fail closed: an identity that presents two irreconcilable successors is *contested*, and no successor is canonical ([identity.md](./identity.md#key-rotation)). It does not resolve the fork; it refuses to guess, on the grounds that freezing an identity is survivable and transferring it to an attacker is not.

---

## ActivityPub

Federated, and the furthest away of the four.

**What it solves.** A large, working federation with real adoption, and a shared vocabulary for social objects.

**What it leaves open.** [Identity is tied to the server domain](https://shadowfacts.net/2023/activitypub-portable-identity/), and while Mastodon can migrate an account by moving followers, posts do not move: their identifiers contain the origin server, so relocating them would break every existing reference. Server-to-server authentication is HTTP signatures between hosts rather than signatures that travel with the object, which makes the server — not the author — the unit of trust.

**Where this project differs.** Fundamentally, in what is signed. Here the *event* carries the signature and can be verified by anyone holding a copy, independent of who served it. That is the property the whole design rests on, and it is the one ActivityPub does not have.

---

## Where this project sits

| | Nostr | AT Protocol | SSB | ActivityPub | This project |
|---|---|---|---|---|---|
| Unit of truth | signed event | signed repo | signed feed | server-held object | signed event |
| Replication between servers | **no** | relay firehose | gossip | federation push | Gossipsub + sync |
| Identity | keypair | DID | keypair | server-scoped | keypair (`did:key`) |
| Index is a projection | n/a | **yes** | n/a | no | yes, with an explicit boundary |
| Pluralistic moderation | partial | **yes** | subjective | per-instance | yes |
| Weighted reputation | no | no | social graph | no | **yes** |
| Authority over unowned data | n/a | n/a | n/a | n/a | **yes** |

Positioned deliberately between Nostr and AT Protocol: individual signed events rather than Merkle repositories, but with real inter-node replication rather than isolated relays.

## What is actually contributed

Stated narrowly, because the wide version does not survive contact with the table above.

**Authority over data nobody owns.** Every protocol above assumes each record has an author who owns it. A review platform does not: a review belongs to whoever signed it, but an entity's name and category are a shared fact that several identities describe differently, with no natural owner to defer to. The two-tier resolution — recognized claims first, then per-field weighting with the author's own weight as the fallback when nobody votes — addresses a problem the social protocols never have ([entities.md](./entities.md)).

**Weighted claims as the Sybil defense**, with weight scaled per claim type rather than a verified/unverified flag, and the honest observation that identity age cannot carry that weight because timestamps are self-attested ([reputation.md](./reputation.md#eligibility-and-weighting)).

**Vote-to-version binding.** Credit attaches to the exact version that earned it, while warnings and conversation attach to the thing. None of the protocols above needs this rule, because none of them combines editable content with a score attached to it ([protocol.md](./protocol.md#votes-do-not-follow-an-edit)).

**An explicit determinism boundary** — a written list of what two honest indexers must reproduce identically and what they may legitimately disagree about ([architecture.md](./architecture.md#what-must-be-identical-across-indexers-and-what-must-not-be)). AT Protocol has the same architecture without, as far as we can tell, publishing the equivalent contract.

## What is not contributed

Recorded so it is never claimed by accident:

- **Signed events with content-derived identifiers** — Nostr, and older.
- **Log as truth, index as projection** — AT Protocol, at scale.
- **Moderation as a separate, subscribable stream of labels** — AT Protocol's labelers. Same design, arrived at independently.
- **Gossip replication of append-only signed data** — SSB.
- **Pluggable clients against a shared protocol** — all of them.

