# Shortcut Vault

Shortcut Vault is a Raycast extension for searching, saving, importing, exporting, and managing keyboard shortcuts for macOS apps and webapps.

It is designed as a local-first shortcut library that feels fast, native, lightweight, and suitable for future Raycast Store publication.

Shortcut Vault does not use accounts, authentication, subscriptions, sync, cloud storage, remote APIs, scraping, or AI features.

## Features

- Search default and custom shortcuts together.
- Filter shortcut results by source, scope, or owner.
- Search only bundled default shortcuts.
- Search only user-created custom shortcuts.
- Add custom shortcuts with modifier selectors and a live preview.
- Manage custom shortcuts with edit, duplicate, and delete actions.
- Copy shortcut keys with Enter from search results.
- Copy command names or full shortcut summaries.
- View shortcut details and source URLs when available.
- Export custom shortcuts as versioned JSON.
- Import Shortcut Vault JSON after reviewing the supported format.

## Commands

### Search Shortcuts

The primary Shortcut Vault experience. Searches bundled default shortcuts and local custom shortcuts together.

Press Enter on any result to copy the shortcut keys immediately.

Use the filter dropdown to narrow results by source, scope, or owner without leaving the search list.

### Search Default Shortcuts

Searches only the bundled shortcut database.

Phase 1 includes:

- Finder
- Safari
- Raycast
- VS Code
- Gmail Webapp

Phase 3 adds:

- Chrome
- Figma
- Notion
- Slack
- Terminal
- Xcode

### Search Custom Shortcuts

Searches only shortcuts saved by the user.

### Add Shortcut

Creates a custom shortcut with:

- Command name
- Modifier selectors
- Key
- Optional owner app/webapp, saved as General when left blank
- Scope
- Optional notes

### Manage Custom Shortcuts

Lists custom shortcuts and supports:

- Edit
- Duplicate
- Delete with confirmation

### Export Shortcuts

Exports custom shortcuts as a versioned JSON file under Raycast extension support storage and offers a copy-to-clipboard action.

### Import Shortcuts

Starts with an information page that explains the supported format, validation rules, version compatibility, and example JSON. The file picker opens only after choosing Import JSON.

## Screenshots

Final screenshots should replace these placeholders before store submission.

![Search placeholder](./assets/screenshot-search-placeholder.png)

![Add shortcut placeholder](./assets/screenshot-add-shortcut-placeholder.png)

## Installation

```bash
npm install
npm run dev
```

Then open Raycast and run one of the Shortcut Vault commands.

## Development

```bash
npm run validate-data
npm run generate-data
npm test
npm run typecheck
npm run lint
npm run build
```

`npm run build` runs the Raycast production build validation with `ray build -e dist`.
`npm run validate-data` checks every bundled shortcut database for required fields, supported values, and duplicate IDs before generated data is written.
`npm test` validates bundled shortcut databases and runs focused import/export format checks.

This project intentionally does not include GitHub Actions, CI/CD workflows, release automation, deployment pipelines, or publish scripts.

## Data Architecture

Default shortcut databases live in:

```text
src/data/default-shortcuts/
```

Each JSON file describes one owner and its shortcuts. A build-time generator reads every JSON file in that folder and writes:

```text
src/data/generated-default-shortcuts.ts
```

The UI and search logic consume the generated dataset through the shared data layer. Adding a new default database should only require adding a JSON file and running:

```bash
npm run generate-data
```

The generator runs database validation first, so invalid shortcut files fail fast before they reach the extension bundle.

## Adding New Shortcut Databases

Create a new JSON file under `src/data/default-shortcuts/`.

Example:

```json
{
  "ownerName": "Example App",
  "ownerType": "mac-app",
  "sourceUrl": "https://example.com/shortcuts",
  "shortcuts": [
    {
      "id": "new-tab",
      "commandName": "New Tab",
      "modifiers": ["command"],
      "key": "T",
      "scope": "app"
    }
  ]
}
```

Supported owner types:

- `mac-app`
- `webapp`
- `system`
- `other`

Supported scopes:

- `global`
- `app`
- `webapp`

Supported modifiers:

- `command`
- `option`
- `control`
- `shift`
- `fn`

## Import/Export Format

Shortcut Vault uses a versioned JSON envelope.

```json
{
  "format": "shortcut-vault",
  "version": 1,
  "exportedAt": "2026-07-04T00:00:00.000Z",
  "shortcuts": [
    {
      "id": "example-custom-shortcut",
      "commandName": "Open Command Menu",
      "modifiers": ["command", "shift"],
      "key": "P",
      "shortcutDisplay": "⌘ + ⇧ + P",
      "ownerName": "VS Code",
      "ownerType": "mac-app",
      "scope": "app",
      "notes": "Example custom shortcut.",
      "sourceType": "custom",
      "createdAt": "2026-07-04T00:00:00.000Z",
      "updatedAt": "2026-07-04T00:00:00.000Z"
    }
  ]
}
```

Imports validate:

- Top-level structure
- Format
- Version
- Required shortcut fields
- Timestamp fields
- Modifier values
- Owner type
- Scope
- Source type

If an imported shortcut ID conflicts with an existing custom shortcut, Shortcut Vault generates a new ID and preserves the imported shortcut.

## Local Storage

Custom shortcuts are stored locally with Raycast `LocalStorage`.

No data leaves the user's machine.

## Assets

The extension icon is wired to:

- `icon.png`

The source image and generated reference variant are preserved for future design review:

- `icon-source.png`
- `icon-regenerated-reference.png`

The screenshot files are placeholders and should be replaced with user-provided screenshots before store submission:

- `screenshot-search-placeholder.png`
- `screenshot-add-shortcut-placeholder.png`

## Roadmap

### Phase 1

- Architecture and MVP.
- Search default and custom shortcuts.
- Add and manage custom shortcuts.
- Import and export custom shortcuts.
- Default databases for Finder, Safari, Raycast, VS Code, and Gmail.

### Phase 2

- UX consistency review.
- Accessibility review.
- Empty state and error handling polish.
- Validation and copy review.
- README and metadata readiness pass.

### Phase 3

- Added shortcut databases for Chrome, Figma, Notion, Slack, Terminal, and Xcode.
- Expanded bundled coverage to 11 owners and 76 default shortcuts.
- Preserved the JSON-first data architecture.

### Phase 4

- Added data validation for bundled shortcut JSON files.
- Cached normalized default shortcuts for snappier default search.
- Hardened export filenames and stored shortcut parsing.

### Phase 5

- Polished the Add Shortcut form with native Raycast affordances.
- Kept screenshot replacement deferred until real user-provided captures are available.

### Phase 6

- Simplified the Add Shortcut preview row to show only the shortcut preview.

### Phase 7

- Adjusted the icon mask to a balanced rounded-square shape.

### Phase 8

- Added native list filtering by source, scope, and owner.
- Kept Search -> Enter -> Copy Shortcut as the primary workflow.

### Phase 9

- Saved blank custom shortcut owners as General.
- Updated Add Shortcut copy to make general shortcuts clearer.

### Phase 10

- Added focused import/export format tests.
- Extracted import/export validation into a pure module.
- Hardened import validation for timestamp fields and fallback shortcut displays.
