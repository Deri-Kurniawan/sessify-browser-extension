# Extension Architecture

## Overview

The extension uses a simplified FSD structure inside `apps/ext/src`.
It keeps only the layers that are currently paying for themselves:

- `app`: startup, routing, layout, and runtime wiring
- `pages`: route-level screens
- `features`: user-facing behavior
- `entities`: domain models and pure domain logic
- `shared`: infrastructure, config, browser adapters, and reusable UI

There is no active `widgets` layer right now because the extension is still small enough that an extra UI layer adds more folders than value.

## Source Layout

```text
src/
  app/
    background/      # background bootstrap and message listener setup
    entrypoints/     # shared React mounting and app wrapper
    layouts/         # top-level shell/layout composition and app-only layout UI
    providers/       # app-level providers
    router/          # route definitions
  entities/
    session/
      lib/           # session-specific pure logic
      model/         # session types
  entrypoints/       # WXT entry files for popup, sidepanel, options, background, content
  features/
    session-management/
      api/           # background request dispatcher
      model/         # provider state and background use-cases
  pages/
    sessions/        # sessions page and page-specific UI
    settings/        # settings page
  shared/
    api/background-client/  # UI to background messaging client
    config/                 # config values and action constants
    lib/browser/            # browser API wrappers
    lib/storage/            # extension storage wrappers
    lib/monitoring/         # logging and diagnostics helpers
    ui/                     # generic extension UI primitives
```

## Runtime Boundaries

### App Layer

`app` owns startup and composition:

- `app/background/bootstrap.ts`
  Registers runtime listeners, command handlers, uninstall URL, and badge refresh triggers.
- `app/entrypoints/*`
  Mounts the React app for popup, sidepanel, and options.
- `app/providers/app-providers.tsx`
  Wraps the app with `SessionManagementProvider`.
- `app/router/create-app-router.tsx`
  Maps routes to page slices.

`app` should not contain domain rules for sessions. It only connects the runtime pieces.

### Shared Layer

`shared` contains code that is not part of one business slice:

- `shared/config`
  Extension config keys and canonical background action constants.
- `shared/api/background-client`
  The typed client used by UI code to talk to the background runtime.
- `shared/lib/browser`
  Thin wrappers around browser tabs, cookies, scripting, and badge APIs.
- `shared/lib/storage`
  Local storage wrappers for extension persistence.
- `shared/ui`
  Generic extension UI primitives like `TopBar`, `ContentWrapper`, and `Placeholder`.

Nothing in `shared` should depend on `pages` or `widgets`.

### Entity Layer

`entities/session` is the source of truth for the session domain:

- `model/types.ts`
  Defines `Session`, `SessionDomain`, and `SessionState`.
- `lib/create-session.ts`
  Creates a normalized `Session` from the active tab and captured storage.
- `lib/filter-sessions-for-url.ts`
  Matches sessions against the current tab URL.
- `lib/sort-sessions-by-relevance.ts`
  Sorts sessions for display priority.

This layer should stay mostly pure and reusable.

### Feature Layer

`features/session-management` contains the actual behavior users care about:

- `model/background-session-service.ts`
  Implements background-side use-cases such as:
  - listing sessions for the active tab
  - saving the active tab session
  - activating a saved session
  - updating or deleting sessions
  - creating an empty session
  - syncing the browser action badge
- `model/session-management-context.tsx`
  Provides UI-side session state and commands.
- `api/handle-background-request.ts`
  Maps background actions to the feature use-cases.

This slice is the main bridge between the UI and the background runtime.

### Pages

- `pages/sessions`
  Owns the main sessions screen and the session detail dialog.
- `pages/settings`
  Owns the settings screen.

If a block is used only by the app shell, keep it in `app/layouts`.
If a block is used only by one page, keep it in that page slice.

## Background Message Contract

The background wire contract is intentionally stable.
The canonical source is `shared/config/background-actions.ts`.

Internal code uses camelCase aliases:

- `listSessionsForActiveTab`
- `saveActiveTabSession`
- `updateSession`
- `deleteSession`
- `createEmptySession`
- `reloadActiveTab`
- `activateSession`
- `readActiveSessionId`

These map to the existing runtime string values:

- `GET_FILTERED_SESSIONS_BY_ACTIVE_TAB`
- `SAVE_CURRENT_TAB_STORAGE_TO_EXTENSION_STORAGE`
- `UPDATE_SESSION_BY_ID`
- `DELETE_SESSION_BY_ID`
- `CREATE_NEW_SESSION`
- `REFRESH_CURRENT_TAB`
- `SWITCH_SESSION_BY_ID`
- `GET_ACTIVE_SESSION`

UI code should use `sessionBackgroundClient` instead of constructing raw messages.

## Naming Rules

Use these conventions across the extension:

- Use `camelCase` for functions, variables, handlers, and exported action aliases.
- Use `PascalCase` for React components, provider names, and error classes.
- Use `UPPER_SNAKE_CASE` only for wire-level browser/background action values that must remain backward-compatible.
- Prefer verb-first names for commands:
  - `listSessions`
  - `saveActiveTabSession`
  - `activateSession`
  - `reloadActiveTab`
- Prefer `read*` for direct retrieval from storage or messaging when the function is not loading UI state.
- Prefer `sync*` for background/UI synchronization side effects like badge updates.

## Dependency Direction

Expected dependency flow:

```text
app -> features -> shared
app -> pages -> features/entities/shared
pages -> features/entities/shared
features -> entities/shared
entities -> shared
shared -> shared
```

Avoid importing upward across layers.
Examples:

- `shared` must not import from `features` or `pages`.
- `entities` must not import from `features` or `pages`.
- `pages` can depend on `features`, but feature state should not depend on page components.
- `app` can own layout-only UI that is not reused elsewhere.

## Typical Flows

### Save Active Tab Session

1. The sessions page calls `sessionBackgroundClient.saveActiveTabSession`.
2. The background listener forwards the message to `handleBackgroundRequest`.
3. `features/session-management` captures active-tab storage and builds a `Session`.
4. The session is stored in extension storage.
5. The provider refreshes state and the badge is synced.

### Activate Saved Session

1. The sessions page calls `sessionBackgroundClient.activateSession`.
2. The background feature validates the session and active tab.
3. If needed, the tab is navigated to the matching host.
4. Current site storage is cleared.
5. Saved storage and cookies are applied.
6. The active session id is updated and badge sync runs.

## Documentation Maintenance

Update this document when any of the following changes:

- a new slice or layer is introduced
- a public API barrel changes
- the background message contract changes
- session flows change materially
- naming conventions or dependency rules change
