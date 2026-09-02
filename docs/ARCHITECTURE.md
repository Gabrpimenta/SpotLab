# SpotLab architecture

## Goals

SpotLab keeps navigation, poker state, remote-style data, persistence, and presentation separate. The architecture favors explicit state transitions, validated boundaries, replaceable services, and a UI that remains understandable without animation.

## Runtime foundation

Expo SDK 57 provides the React Native runtime and version-aligned native modules. Expo Router owns navigation and deep linking. The three tab routes compose feature screens, while the focused trainer route lives in the root stack so it can be opened from Battle, Missions, or League.

```text
Expo Router
    │
    ├── Feature screens and hooks
    │       ├── Zustand session state
    │       └── TanStack Query server-style state
    │
    └── Service boundaries
            ├── SolverClient
            └── Performance persistence
```

## State ownership

- **TanStack Query** owns training-deck retrieval, solver mutations, and performance summaries.
- **Zustand** owns the active session: spot index, selected action, session score, completed spots, and lifecycle status.
- **Local component state** owns view-only concerns such as an expanded explanation or open range sheet.
- **AsyncStorage** persists the compact performance snapshot behind a service interface.

The trainer uses one status value—`choosing`, `submitting`, `analyzing`, `feedback`, or `transitioning`—instead of independent booleans. That prevents contradictory UI states.

## Practice-engine boundary

`SolverClient` isolates the UI from transport. The included `MockSolverClient` emits typed progress events and returns an API-shaped payload. Zod validates that unknown response before `normalizeSolverSolution()` maps it into the internal domain model.

```text
External-shaped payload
        ↓
Runtime validation
        ↓
Normalization
        ↓
SolverSolution domain model
        ↓
Trainer UI
```

A remote solver can implement the same contract with REST, SSE, WebSockets, or background jobs. Any solver or AI provider must remain behind an authenticated backend; provider credentials do not belong in the application bundle.

## Analysis progress

The local client emits deterministic progress stages so the interface exercises the same asynchronous states required by a remote engine. Stage timing is configurable, cancellation is supported through `AbortSignal`, and tests use zero-delay execution.

## Persistence

The performance service reads and writes a small versioned summary. AsyncStorage is appropriate for the current data volume and Expo Go workflow. A synced account model or SQLite cache can replace it without changing feature components.

## Rendering and interaction

- Reanimated handles entrances, progress, and strategy bars.
- Native views and SVG keep poker information crisp at different display densities.
- Decorative art is non-interactive and excluded from accessibility trees.
- Reduced-motion settings remove nonessential animation.
- Safe-area and scroll ownership remain at screen boundaries.
- Action controls preserve poker semantics in visible labels and accessibility state.

## Reliability

The trainer retains the selected decision when analysis fails and exposes retry instead of discarding progress. Normalization rejects malformed payloads before they reach UI state. Query invalidation keeps persisted summaries and visible rating data aligned after a completed hand.

## Testing

Tests target behavior and boundaries rather than implementation snapshots:

- decision-quality thresholds and score calculation;
- valid and invalid solver normalization;
- progress-stage ordering and cancellation behavior;
- trainer state transitions;
- poker fixture plausibility;
- persisted performance aggregation.

The next reliability layer should add component interaction tests, remote contract fixtures, and a native end-to-end happy path.
