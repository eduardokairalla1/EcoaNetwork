# Frontend structure

Everything lives under `src/`. The folders divide by **what each one knows**,
and the dependency runs one way.

```
src/
  main.tsx        entry: mounts the router
  router.tsx      the route tree
  routes.ts       every destination the client links to

  logic/          non-rendering logic
  components/     the shared component kit
  site/           the marketing site
  app/            the platform
  styles/         tokens.css and global.css
```

| Folder | Knows | Responsibility |
|---|---|---|
| `logic/` | the protocol | Non-rendering logic. Two named children, never loose files. |
| `components/ui/` | nothing about Ecoa | Generic primitives, plus `cn` and the design-system hooks. Could be published on its own. |
| `components/ecoa/` | the product's vocabulary | Review, claim, event and version components. Takes props, never fetches. |
| `site/` | the marketing site | Landing and its chrome. Leaves this repo one day. |
| `app/` | the platform | Every product screen. |
| `styles/` | — | The token layer and the base stylesheet. |

## logic/

| Path | Responsibility |
|---|---|
| `protocol/` | The contract: types generated from the repo's `protocol/schemas`, and the pure rules — sign, verify, resolve a version chain. Runs offline, testable against `protocol/fixtures`. |
| `network/` | The conversation: node client, queries, cache. **The only layer that does I/O.** |

## site/ vs app/

This split is about **deployment, not authentication**. The landing will become
its own service; the platform stays here. Reading is public in Ecoa, so
`/explore`, review permalinks and `/login` are unauthenticated and still belong
to `app/`. Auth is a guarded layout inside `app/`, not a folder.

Each side owns its own chrome: the site's nav carries section anchors, the app's
will carry search and identity.

## Naming

`Button.tsx` holds the component and `Button.t.ts` holds its types. Inside a
page folder, the file whose name matches the folder is the entry —
`site/landing/Landing.tsx`.

## Where does a new file go?

1. Does it do I/O? → `logic/network/`
2. Would it still be true offline, against a fixture? → `logic/protocol/`
3. Does it render? → `components/ecoa/` if it knows what a review is, otherwise
   `components/ui/`
4. Does it only exist on one screen? → that route's folder

Promote on the second use, not on the first guess.

## Where data meets rendering

One data hook per route, and that file is the seam:

```
app/explore/
  useExploreData.ts   calls logic/network, returns ready data
  Explore.tsx         receives props and renders
```

Components never fetch. A component that fetches only works on one screen.
