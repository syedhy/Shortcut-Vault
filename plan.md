# Shortcut Vault Plan

## Product Vision

Shortcut Vault is a polished Raycast extension for finding, saving, importing, exporting, and managing keyboard shortcuts for macOS apps and webapps. It should feel fast, native, lightweight, reliable, and ready for eventual Raycast Store review.

Shortcut Vault is local-first. It does not use accounts, authentication, subscriptions, sync, cloud storage, remote APIs, scraping, AI features, practice modes, analytics, or a standalone macOS app.

## Architecture Overview

Shortcut Vault is a data-driven Raycast extension.

- Default shortcuts live in JSON files under `src/data/default-shortcuts/`.
- User-created shortcuts live in Raycast local storage.
- Commands consume a shared shortcut data layer instead of hardcoding app-specific shortcut lists.
- Search combines normalized default and custom shortcuts into a single list model.
- Import and export use a versioned JSON format that can round-trip without manual edits.
- UI commands share reusable list, form, action, validation, and formatting utilities.

The default database is intentionally file-based so future shortcut sets can be added by adding JSON files. Search, UI, and storage should not require app-specific changes when new databases are added.

## Folder Structure

```text
assets/
  icon.png
src/
  add-shortcut.tsx
  export-shortcuts.tsx
  import-shortcuts.tsx
  manage-custom-shortcuts.tsx
  search-custom-shortcuts.tsx
  search-default-shortcuts.tsx
  search-shortcuts.tsx
  components/
  data/default-shortcuts/
  lib/
  types/
scripts/
  generate-default-shortcuts.mjs
  validate-default-shortcuts.mjs
README.md
package.json
tsconfig.json
```

## Data Model

Shortcut:

- `id`
- `commandName`
- `modifiers`
- `key`
- `shortcutDisplay`
- `ownerName`
- `ownerType`
- `scope`
- `notes`
- `sourceType`
- `sourceUrl`
- `createdAt`
- `updatedAt`

Owner types:

- `mac-app`
- `webapp`
- `system`
- `other`

Scope types:

- `global`
- `app`
- `webapp`

Source types:

- `default`
- `custom`

## Phase Breakdown

### Phase 1: Architecture + MVP

Status: Complete

Scope:

- [x] Create extension scaffold.
- [x] Add default shortcuts for Finder, Safari, Raycast, VS Code, and Gmail Webapp.
- [x] Implement Search Shortcuts across default and custom shortcuts.
- [x] Implement Search Default Shortcuts.
- [x] Implement Search Custom Shortcuts.
- [x] Implement Add Shortcut.
- [x] Implement Manage Custom Shortcuts.
- [x] Implement Export Shortcuts.
- [x] Implement Import Shortcuts with an info page before file selection.
- [x] Create placeholder assets.
- [x] Create professional README.
- [x] Verify build, TypeScript, linting, and command behavior by code-level smoke review.

Stop after Phase 1 and wait for approval.

### Phase 2: Store Readiness & Polish

Status: Complete

Scope:

- [x] UX consistency pass.
- [x] Accessibility pass.
- [x] Empty state pass.
- [x] Error handling pass.
- [x] Validation pass.
- [x] README quality review.
- [x] Folder structure review.
- [x] Naming, type, copy, and metadata review.

Do not add additional shortcut databases during this phase.

### Phase 3: Database Expansion

Status: Complete

Scope:

- [x] Add more application and webapp shortcut databases.
- [x] Improve shortcut coverage.
- [x] Improve database coverage documentation.
- [x] Continue using the Phase 1 data-driven architecture.

### Phase 4: Data Validation & Performance Hardening

Status: Complete

Scope:

- [x] Add bundled shortcut JSON validation.
- [x] Cache normalized default shortcuts for snappier default search.
- [x] Harden export filenames and stored shortcut parsing.
- [x] Keep search native and lightweight.

### Phase 5: Add Shortcut UI Polish

Status: Complete

Scope:

- [x] Improve Add Shortcut form affordances.
- [x] Add colored modifier and scope choices.
- [x] Improve preview visibility while staying native to Raycast.
- [x] Keep screenshots deferred for user-provided captures.

### Phase 6: Preview Wording Cleanup

Status: Complete

Scope:

- [x] Remove extra preview wording from Add Shortcut.
- [x] Keep the preview row as `Preview` plus the actual shortcut.
- [x] Preserve Search Shortcuts UI.

### Phase 7: Icon Rounded-Square Adjustment

Status: Complete

Scope:

- [x] Reduce icon rounding so it reads as a normal rounded-square app icon.
- [x] Preserve transparent corners and source artwork.

### Phase 8: Search Filtering

Status: Complete

Scope:

- [x] Add native filtering by source, scope, and owner.
- [x] Keep the primary Search -> Enter -> Copy Shortcut flow unchanged.
- [x] Preserve Raycast's native search performance and keyboard behavior.
- [x] Avoid screenshot replacement until user-provided screenshots are available.

### Phase 9: General Shortcut Owner Default

Status: Complete

Scope:

- [x] Allow Add Shortcut and Edit Shortcut to save without a typed owner.
- [x] Normalize blank custom shortcut owners to `General`.
- [x] Update form placeholder, helper copy, and tag preview to communicate the default.
- [x] Preserve storage/export shape by still saving a concrete owner name.

### Phase 10: Import/Export Validation Tests

Status: Complete

Scope:

- [x] Extract pure import/export format logic from Raycast file/storage APIs.
- [x] Add focused local tests for official Shortcut Vault import/export JSON.
- [x] Validate timestamp fields during import parsing.
- [x] Verify fallback shortcut display generation when `shortcutDisplay` is missing.
- [x] Keep the test harness local and dependency-light.

### Phase 11: Original Prompt Compliance Audit

Status: Complete

Scope:

- [x] Re-read the original product prompt and compare it against the current implementation.
- [x] Add duplicate custom shortcut confirmation for matching owner, scope, key, and modifiers.
- [x] Remove unused runtime dependencies.
- [x] Document accepted deviations introduced by later user requests.
- [x] Re-run validation, typecheck, lint, build, and Raycast dev compile.

### Phase 12: Search Filtering Regression Fix

Status: Complete

Scope:

- [x] Restore native Raycast search filtering in shortcut lists.
- [x] Keep search text tracking for polished empty-state copy.
- [x] Preserve source/scope/owner dropdown filtering.
- [x] Verify build, lint, typecheck, tests, and Raycast dev compile.

### Phase 13: Advanced Search and Owner Canonicalization

Status: Complete

Scope:

- [x] Add custom AND-based search across command, shortcut keys, owner, source, and scope.
- [x] Support shortcut aliases such as `cmd`, `command`, `option`, `alt`, `ctrl`, symbols, and plus-separated keys.
- [x] Support chained searches such as `Figma custom cmd p`.
- [x] Add focused search tests.
- [x] Add existing-owner selection in Add/Edit Shortcut.
- [x] Canonicalize typed owner names against existing bundled and custom owners.

### Phase 14: Import Conflict Preparation Hardening

Status: Complete

Scope:

- [x] Extract duplicate ID preparation from Raycast storage import flow.
- [x] Test importing unique IDs without regeneration.
- [x] Test ID conflicts with existing custom shortcuts.
- [x] Test duplicate IDs inside a single import file.
- [x] Test generated ID collision retries.
- [x] Keep `main` synchronized with completed work before starting the phase, then continue on `work`.

### Phase 15: Owner Field Simplification

Status: Complete

Scope:

- [x] Remove the separate Existing Owner control from Add/Edit Shortcut.
- [x] Keep a single Owner App/Webapp field.
- [x] Preserve canonicalization when typed owner text matches an existing owner.
- [x] Preserve custom owner creation for new typed owner names.
- [x] Add live owner match feedback in the form.

### Phase 16: Existing Owner Match Polish

Status: Superseded by Phase 17

Scope:

- [x] Keep the single `Owner App/Webapp` text field.
- [x] Show a stronger visual cue when typed owner text matches an existing owner.
- [x] Avoid reintroducing a separate existing-owner selector.
- [x] Preserve automatic canonical owner saving.

Outcome:

- The controlled tag token was rejected because it looked interactive. Phase 17 replaced it with non-interactive preview text.

### Phase 17: Final Pre-Submission Hardening

Status: Complete

Scope:

- [x] Replace the owner match token with non-interactive preview text.
- [x] Keep typed existing-owner canonicalization.
- [x] Prevent empty custom shortcut exports from being offered as an action.
- [x] Reject empty import files with a useful error.
- [x] Avoid imported shortcut ID collisions with bundled default shortcuts.
- [x] Remove unnecessary root list navigation title overrides.
- [x] Add final license and changelog files.
- [x] Update final user handoff documentation.

### Phase 18: Scope and Owner Kind Clarification

Status: Complete

Scope:

- [x] Clarify that scope means where a shortcut works.
- [x] Stop deriving named global shortcut owners as `other`.
- [x] Treat blank owners as `General`.
- [x] Treat named global and app shortcut owners as app owners by default.
- [x] Treat named webapp shortcut owners as webapp owners by default.
- [x] Remove owner kind from Add/Edit Shortcut owner match preview.
- [x] Add focused owner-kind inference tests.

### Phase 19: Default Library Expansion and Search Responsiveness

Status: Complete

Scope:

- [x] Add official-source macOS shortcut coverage.
- [x] Add official-source Apple app shortcut coverage.
- [x] Regenerate the bundled default shortcut dataset.
- [x] Keep owner/app name tag colors consistent across all owners.
- [x] Limit broad search list rendering so scrolling stays responsive as the library grows.

### Phase 20: Production Pruning

Status: Complete

Scope:

- [x] Remove test-only TypeScript files.
- [x] Remove test-only TypeScript config.
- [x] Remove placeholder screenshot assets.
- [x] Remove source/reference-only icon assets.
- [x] Keep the real extension icon.
- [x] Keep data generation and validation scripts required by the data-driven architecture.
- [x] Update package scripts for production verification.
- [x] Update README and plan for the pruned production surface.

### Phase 21: Default Library Depth and TypeScript Resolution

Status: Complete

Scope:

- [x] Fix TypeScript module resolution deprecation without relying on deprecated `node10` behavior.
- [x] Expand official-source shortcut coverage for existing low-count databases.
- [x] Regenerate the bundled default shortcut dataset.
- [x] Improve symbol-key search normalization.
- [x] Update README, changelog, and plan with current database size.
- [x] Verify data validation, typecheck, lint, and Raycast build.

### Phase 22: Repeated Add Shortcut Flow

Status: Complete

Scope:

- [x] Refresh existing owner options after saving a new custom shortcut.
- [x] Reset Add Shortcut values with a fresh form state after each successful save.
- [x] Remount the add form after save so Raycast form controls do not keep stale internal state.
- [x] Preserve edit behavior and existing Manage Custom Shortcuts save flow.
- [x] Verify data validation, typecheck, lint, Raycast build, and dev compile.

## Decisions Made

- Use Raycast `LocalStorage` for custom shortcuts because it is local, supported by Raycast, and does not introduce sync or account dependencies.
- Use JSON files for default shortcut databases to keep future expansion data-only.
- Use a single shared search/list component for default, custom, and combined search commands to keep behavior consistent.
- Make Enter copy the shortcut keys in search results because search-to-copy is the primary workflow.
- Make import start with an explanatory page before showing a file picker, so users understand the format before selecting a file.
- Use a versioned import/export envelope as the official Shortcut Vault interchange format.
- Generate new IDs for imported shortcuts when an ID conflicts with existing custom shortcuts.
- Keep placeholder screenshot assets simple and replaceable; final screenshot capture is deferred.
- Do not add GitHub Actions, CI/CD, release automation, or publishing scripts in Phase 1.
- Use a build-time generator for default shortcut JSON discovery. This keeps runtime code simple while allowing future default databases to be added by adding JSON files.
- Use Raycast `Form.FilePicker` for import because the API supports file selection as part of a Raycast form, and the product requirement asks for an information page before file selection.
- Export JSON to `environment.supportPath/exports` and offer copy/show actions because Raycast does not need cloud storage or external services for local export.
- Keep scope and owner kind separate. Scope describes where the shortcut works: Global works anywhere on the Mac, App works inside the owner app, and Webapp works inside the owner webapp.
- Infer custom owner kind from owner name plus scope: blank owners save as `General`/`other`, named Webapp owners save as `webapp`, and other named owners save as `mac-app` even when their scope is Global.
- Use the provided command-symbol artwork as the real extension icon.
- Preserve a generated reference variant separately instead of wiring it into the manifest, because the provided source image is the closest match to the requested exact icon.
- Apply transparent rounded corners directly to `assets/icon.png` so the icon presents cleanly even if a host surface does not mask square PNGs.
- Use Raycast accessory tag bubbles in shortcut lists instead of a single plain metadata string, so owner, source, and scope are easier to scan.
- Do not generate README/store screenshots artificially. Screenshots should come from the real Raycast UI when the user provides or captures them.
- Use a native Raycast `List.Dropdown` for source, scope, and owner filtering. This keeps filtering lightweight, accessible, keyboard-friendly, and consistent across all shortcut list commands.
- Use `General` as the concrete owner name for custom shortcuts saved without an owner. This keeps the owner field useful for search, filters, export, and list accessories while making general/system shortcuts faster to save.
- Keep import/export format validation in a pure module so edge cases can be tested without invoking Raycast UI, filesystem export paths, or local storage.
- Display shortcut modifiers in Command-first order to match the product examples and the way users commonly search for shortcuts.
- Treat blank owner input saving as `General` as an accepted product change from later user direction, superseding the original prompt's required owner field while preserving a concrete owner in stored data.
- Confirm duplicate custom shortcuts instead of blocking them. Legitimate duplicate key combinations can exist across contexts, but accidental duplicates should be visible before saving.
- Explicitly enable Raycast native `List` filtering whenever `onSearchTextChange` is used. Raycast otherwise treats filtering as extension-owned, which can make typing appear to do nothing.
- Use custom shortcut search for the main shortcut lists because Raycast's native fuzzy search cannot guarantee multi-term AND queries like `Figma custom cmd p`.
- Canonicalize owner names from the current default and custom shortcut dataset so typed owners like `figma` reuse `Figma` instead of creating duplicate owner spellings.
- Keep import conflict preparation pure and tested separately from Raycast `LocalStorage`; the command layer only reads, prepares, and saves.
- Keep Add/Edit Shortcut owner entry as one field. Raycast's current form API provides TextField and Dropdown, but not a native editable combobox that supports arbitrary text plus dropdown suggestions in the same control.
- Keep existing owner matches as non-interactive `Form.Description` text. Raycast's form description API does not support colored inline text, and using token/dropdown-like components for preview state creates misleading affordances.
- Use one muted owner tag color for all owner/app names so search result metadata is visually consistent. Source and scope tags still carry their own stable colors.
- Cap rendered search results for broad queries while still searching the full loaded library. This keeps initial search screens snappy after database expansion.
- Use `module: "ESNext"` with `moduleResolution: "bundler"` for TypeScript. `moduleResolution: "bundler"` is the right modern resolution mode for this Raycast/TypeScript setup, but it must be paired with an ES module output target rather than `commonjs`.
- Keep official-source expansion focused on owners already in the app instead of adding new app families during this pass. This improves depth without changing UI, storage, or search architecture.
- After a successful Add Shortcut save, refresh owner options from storage and remount only the add form. This matches the behavior of reopening the command without disturbing edit forms pushed from Manage Custom Shortcuts.

## Tradeoffs

- Default shortcut coverage in Phase 1 is intentionally narrow so the architecture and UX can be validated before expanding the database.
- Import conflict handling favors preserving imported content with new IDs instead of asking users to resolve conflicts interactively.
- Duplicate shortcut detection is advisory during manual entry but not a hard global blocker, because legitimate duplicate key combinations can exist in different apps or scopes.
- Placeholder screenshots are not final store screenshots; they exist to stabilize README and asset paths before final screenshot capture.
- The generated TypeScript dataset is checked into the source tree for transparent builds, but it should be regenerated after JSON database changes.
- Export writes to Raycast support storage instead of asking for a destination path. This is simpler, reliable, and local, but Phase 2 may revisit if a save-location UX becomes important.
- List filtering runs over already-loaded shortcut arrays. This avoids a heavier query layer and should remain fast for the expected Raycast shortcut-library scale.
- Blank owner input is normalized at save time instead of making `ownerName` optional in the data model. This avoids import/export compatibility churn.
- The import/export tests use Node's built-in `assert` plus a small TypeScript compile step instead of adding a full test framework. This keeps dependencies minimal, but the harness is intentionally narrow.
- Duplicate detection is scoped to custom shortcuts with the same normalized owner, scope, key, and modifiers. It does not block duplicates across different owners or scopes.
- Custom search gives up Raycast's native ranking in exchange for deterministic chained filtering across every shortcut field.
- Empty exports are not offered as an action. This avoids producing technically valid but user-unhelpful empty files.
- Empty imports are rejected. Shortcut Vault's official format is for transferable custom shortcuts, and an empty file usually indicates the wrong export was selected.
- Broad search lists show a limited number of rows. Users can still reach any bundled shortcut by typing a narrower query, owner, scope, source, or key combination.
- Gmail, Slack, Figma, and Notion include some single-key shortcuts because those products officially define single-key shortcut modes. This can look unusual next to macOS app shortcuts, but removing them would make those webapp datasets less accurate.
- Some products publish shortcut panels or broad shortcut docs rather than stable machine-readable shortcut tables. The bundled data remains curated from official documentation and common documented shortcut panels instead of trying to scrape or exhaustively mirror every app.

## Deferred Ideas

- Additional shortcut databases: Arc, iTerm, Linear, Apple Music, Preview, Photos, and other high-confidence sources.
- Bulk edit custom shortcuts.
- Optional duplicate detection views.
- Contribution guide for shortcut database JSON files.

## Future Improvements

- Add richer keyboard key normalization for international keyboard layouts.
- Add per-owner grouping or sections if large databases become hard to scan.
- Add migration helpers if the local custom shortcut format changes.

## Remaining Work

- Capture and add final Raycast Store screenshots.
- Review package metadata once the final Raycast Store author is known.
- Continue deepening shortcut databases when additional high-confidence shortcut sources are available.

## Phase 1 Completion Notes

Completed on 2026-07-04.

Created files:

- `.gitignore`
- `.prettierrc`
- `README.md`
- `assets/icon-placeholder.png`
- `assets/screenshot-add-shortcut-placeholder.png`
- `assets/screenshot-search-placeholder.png`
- `eslint.config.mjs`
- `package-lock.json`
- `package.json`
- `plan.md`
- `raycast-env.d.ts`
- `scripts/generate-default-shortcuts.mjs`
- `src/add-shortcut.tsx`
- `src/components/ShortcutDetails.tsx`
- `src/components/ShortcutForm.tsx`
- `src/components/ShortcutList.tsx`
- `src/data/default-shortcuts/finder.json`
- `src/data/default-shortcuts/gmail.json`
- `src/data/default-shortcuts/raycast.json`
- `src/data/default-shortcuts/safari.json`
- `src/data/default-shortcuts/vscode.json`
- `src/data/generated-default-shortcuts.ts`
- `src/export-shortcuts.tsx`
- `src/import-shortcuts.tsx`
- `src/lib/default-shortcuts.ts`
- `src/lib/import-export.ts`
- `src/lib/labels.ts`
- `src/lib/shortcut-data.ts`
- `src/lib/shortcut-format.ts`
- `src/lib/storage.ts`
- `src/lib/validation.ts`
- `src/manage-custom-shortcuts.tsx`
- `src/search-custom-shortcuts.tsx`
- `src/search-default-shortcuts.tsx`
- `src/search-shortcuts.tsx`
- `src/types/shortcut.ts`
- `tsconfig.json`

Modified files:

- None existed before Phase 1; this project was scaffolded from an empty folder.

Verification:

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.
- Code-level smoke review confirmed the primary command path is Search -> Enter -> Copy Shortcut, import starts from an information page, export creates versioned JSON, custom deletion requires confirmation, and empty states are present.

Expected behavior:

- Search Shortcuts shows default and custom shortcuts together.
- Search Default Shortcuts shows only bundled shortcuts.
- Search Custom Shortcuts and Manage Custom Shortcuts show only local custom shortcuts.
- Pressing Enter on a shortcut copies the shortcut keys and shows a toast with the shortcut as the title.
- Add Shortcut saves custom shortcuts locally.
- Import validates Shortcut Vault JSON before saving.
- Export writes a re-importable Shortcut Vault JSON file locally and can copy the JSON to the clipboard.

## Phase 2 Completion Notes

Completed on 2026-07-04.

Implemented:

- Replaced the extension icon placeholder with the provided command-symbol artwork.
- Added `assets/icon.png` as the manifest icon for the extension and all commands, with transparent rounded corners.
- Preserved `assets/icon-source.png` and `assets/icon-regenerated-reference.png` for future icon/design review.
- Removed `assets/icon-placeholder.png`.
- Improved Manage Custom Shortcuts so Edit Shortcut is the primary action in the manage command.
- Kept Search commands optimized for Search -> Enter -> Copy Shortcut.
- Improved empty states for manage-mode and default-only lists.
- Improved corrupt local-storage validation for custom shortcuts.
- Improved user-facing failure copy to be more actionable.
- Replaced plain search metadata accessories with colored tag bubbles for owner, source, and scope.
- Increased the icon corner radius so the rounded tile shape is clearly visible in Raycast-style surfaces.
- Reviewed README language and asset documentation.
- Confirmed no new shortcut databases were added during Phase 2.

Created files:

- `assets/icon.png`
- `assets/icon-source.png`
- `assets/icon-regenerated-reference.png`

Modified files:

- `README.md`
- `package.json`
- `plan.md`
- `src/components/ShortcutForm.tsx`
- `src/components/ShortcutList.tsx`
- `src/export-shortcuts.tsx`
- `src/lib/storage.ts`
- `src/manage-custom-shortcuts.tsx`

Deleted files:

- `assets/icon-placeholder.png`

Verification:

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Raycast uses the new command-symbol icon for Shortcut Vault and every command.
- The active icon has a strong rounded-corner alpha mask.
- Search Shortcuts still copies shortcut keys as the default Enter action.
- Shortcut rows show colored metadata bubbles: owner, Default/Custom, and Global/App/Webapp.
- Manage Custom Shortcuts now opens edit as the first action and still supports duplicate, delete, copy, and details.
- Custom shortcut storage failures show clearer messages instead of generic retry copy.
- README reflects the real icon and remaining screenshot placeholders.

Tradeoffs:

- The provided image was used for `assets/icon.png` because it matches the requested exact visual better than the regenerated variant.
- The generated variant is retained as a reference asset, not as the active icon.
- Final screenshot capture is still deferred because Phase 2 did not include replacing placeholder screenshots with real store screenshots.

Next phase:

- Phase 3 will expand shortcut coverage by adding more application and webapp JSON databases.
- Candidate Phase 3 databases: Chrome, Arc, Notion, Figma, Xcode, Gmail expansion, Finder expansion, Safari expansion, Terminal, and Slack.
- The data-driven architecture should remain unchanged; adding coverage should be JSON-first.

## Phase 3 Completion Notes

Completed on 2026-07-05.

Implemented:

- Added `Chrome` default shortcuts.
- Added `Figma` default shortcuts.
- Added `Notion` default shortcuts.
- Added `Slack` default shortcuts.
- Added `Terminal` default shortcuts.
- Added `Xcode` default shortcuts.
- Regenerated `src/data/generated-default-shortcuts.ts`.
- Updated README coverage notes.
- Confirmed the search, UI, and storage layers did not require app-specific changes.

Created files:

- `src/data/default-shortcuts/chrome.json`
- `src/data/default-shortcuts/figma.json`
- `src/data/default-shortcuts/notion.json`
- `src/data/default-shortcuts/slack.json`
- `src/data/default-shortcuts/terminal.json`
- `src/data/default-shortcuts/xcode.json`

Modified files:

- `README.md`
- `plan.md`
- `src/data/generated-default-shortcuts.ts`

Verification:

- `npm run generate-data` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Search Default Shortcuts includes 11 bundled shortcut owners.
- Search Shortcuts includes the expanded default database alongside custom shortcuts.
- Newly added shortcut rows inherit the existing colored owner/source/scope tag bubbles.
- Adding these databases required JSON files only; no search, UI, or storage logic changed.

Tradeoffs:

- Arc was deferred because the official page found during this phase documents shortcut customization rather than a complete stable default shortcut list.
- Phase 3 favored fewer, higher-confidence shortcuts per owner rather than broad low-confidence coverage.
- Some apps expose many shortcuts; this phase added practical starter coverage and leaves deep per-app expansion for future passes.

Next phase:

- Future work should deepen existing databases, especially Gmail, Figma, Xcode, Chrome, and Notion.
- Continue using the Phase 4 JSON validation guard before expanding much further.
- Capture real README screenshots after the database and search UI feel final.

## Phase 4 Completion Notes

Completed on 2026-07-05.

Implemented:

- Added `scripts/validate-default-shortcuts.mjs` to validate every bundled shortcut JSON file.
- Added `npm run validate-data` and `npm test` as lightweight data-quality checks.
- Wired `npm run generate-data` to validate datasets before generating TypeScript data.
- Cached normalized default shortcuts after first load so default-only search avoids repeated normalization work.
- Returned cached, pre-sorted default shortcuts for Search Default Shortcuts.
- Kept combined search sorting simple and deterministic while avoiding unnecessary custom-storage reads in default-only mode.
- Changed export filenames from date-only names to timestamped names so multiple exports in the same day do not overwrite each other.
- Tightened stored custom shortcut parsing so unsupported owner types are rejected instead of silently coerced.
- Updated README development/data-architecture notes for validation.

Created files:

- `scripts/validate-default-shortcuts.mjs`

Modified files:

- `README.md`
- `package.json`
- `plan.md`
- `src/data/generated-default-shortcuts.ts`
- `src/lib/default-shortcuts.ts`
- `src/lib/import-export.ts`
- `src/lib/shortcut-data.ts`
- `src/lib/storage.ts`

Verification:

- `npm run test` passed.
- `npm run validate-data` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.
- Manual code review completed for the hardening diff; no blocking issues found.

Expected behavior:

- Search Default Shortcuts should feel instant because default data is normalized once per command session.
- Search Shortcuts should remain smooth while combining custom and default shortcuts.
- Invalid bundled shortcut JSON fails during validation/generation instead of becoming a runtime issue.
- Export Shortcuts creates uniquely named JSON files even when exporting multiple times per day.
- Stored custom shortcut data keeps supported owner types intact and rejects unsupported owner types.

Tradeoffs:

- The validation check is intentionally lightweight and script-based instead of introducing a heavier test framework.
- Default shortcut caching is process-local, which is enough for Raycast command sessions and avoids unnecessary state complexity.
- Search still relies on Raycast's native list filtering rather than custom filtering, preserving native responsiveness and keyboard behavior.

Next phase:

- Add focused unit tests for import/export parsing if the project adopts a test runner.
- Capture real screenshots for README/store presentation.
- Deepen per-app shortcut databases once the validation guard has had more mileage.

## Phase 5 Completion Notes

Completed on 2026-07-05.

Implemented:

- Removed the generated screenshot workflow that was briefly introduced during this phase.
- Kept screenshot placeholders in README until user-provided screenshots are available.
- Polished the Add Shortcut form without changing save/edit behavior.
- Added colored native Raycast icons to modifier choices.
- Added colored native Raycast icons to scope dropdown choices.
- Added form `info` text for command name, modifiers, key, owner, and scope fields.
- Split the form into clearer sections with separators.
- Made the live preview more prominent with a dedicated `Live Preview` row.
- Added a secondary `Copy Preview` action when a shortcut preview exists.
- Left the Search Shortcuts UI unchanged, since it already feels good.

Created files:

- None.

Modified files:

- `README.md`
- `package.json`
- `plan.md`
- `src/components/ShortcutForm.tsx`

Deleted files:

- `scripts/generate-readme-screenshots.py`
- `assets/screenshot-search.png`
- `assets/screenshot-add-shortcut.png`

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Add Shortcut feels less bland while staying native to Raycast.
- Modifier selection shows colored option bubbles/icons.
- Scope selection shows colored Global/App/Webapp choices.
- The preview is easier to notice and can be copied directly from the action panel.
- Search Shortcuts remains unchanged.

Tradeoffs:

- Raycast forms do not support arbitrary custom styling, so the polish uses native form affordances: icons, field info text, separators, and action-panel structure.
- Real screenshots remain deferred until user-provided captures are available.

Next phase:

- Replace screenshot placeholders with the user-provided screenshots.
- Consider focused import/export tests if the project adopts a test runner.
- Continue small UI polish only where it improves the native Raycast experience.

## Phase 6 Completion Notes

Completed on 2026-07-06.

Implemented:

- Removed the extra `Copy result:` wording from the Add Shortcut live preview.
- Renamed the row back to `Preview`.
- Kept the preview content to the actual shortcut only.
- Kept the secondary `Copy Preview` action in the action panel because it does not clutter the form.
- Did not alter the Search Shortcuts UI.

Created files:

- None.

Modified files:

- `plan.md`
- `src/components/ShortcutForm.tsx`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Add Shortcut shows `Preview` with only the selected shortcut value.
- No helper phrase such as `Copy result` appears in the preview row.
- The form remains native, clean, and polished.

Tradeoffs:

- Raycast `Form.Description` does not support a custom colored preview bubble, so the preview uses the native description row rather than a fake styled surface.
- Real README/store screenshots remain waiting on user-provided captures.

Next phase:

- Replace screenshot placeholders once real screenshots are provided.
- Optionally add focused import/export tests if a test runner is introduced later.

## Phase 7 Completion Notes

Completed on 2026-07-06.

Implemented:

- Reduced the active icon corner radius so `assets/icon.png` presents as a rounded square instead of an almost circular tile.
- Preserved transparent corners and the original source artwork.

Created files:

- None.

Modified files:

- `assets/icon.png`
- `plan.md`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Raycast should show the icon with rounded-square edges, closer to normal app icons.
- The icon should no longer read as an almost circular tile.

Tradeoffs:

- The active icon uses a direct transparent rounded-corner mask rather than relying only on host app masking, because different macOS surfaces can display PNGs differently.

Next phase:

- Add practical functionality that improves discovery without making the search UI heavy.
- Keep screenshots deferred until user-provided screenshots are available.

## Phase 8 Completion Notes

Completed on 2026-07-06.

Implemented:

- Added a native Raycast filter dropdown to shared shortcut lists.
- Added dynamic filtering by source when both default and custom shortcuts are present.
- Added filtering by scope: Global, App, and Webapp.
- Added filtering by owner app/webapp/system from the loaded shortcut data.
- Added a `Show All Results` empty-state action when an active filter has no results.
- Preserved the Search -> Enter -> Copy Shortcut workflow.
- Kept screenshots deferred for the end, as requested.

Created files:

- None.

Modified files:

- `README.md`
- `plan.md`
- `src/components/ShortcutList.tsx`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Search Shortcuts can be narrowed by Default/Custom, Global/App/Webapp, or owner without leaving the list.
- Search Default Shortcuts, Search Custom Shortcuts, and Manage Custom Shortcuts also inherit relevant owner/scope filters.
- Typing search terms remains native to Raycast and should stay responsive.
- Pressing Enter on a result still copies the shortcut keys immediately.

Tradeoffs:

- Filtering is intentionally a single dropdown rather than multiple controls. This keeps the Raycast command compact and keyboard-friendly.
- Filter options are generated from currently loaded shortcuts. This avoids duplicate app registration or hardcoded owner lists.

Next phase:

- Add focused import/export validation tests or a small test harness.
- Keep real screenshots for the final store-readiness pass when user-provided screenshots are available.

## Phase 9 Completion Notes

Completed on 2026-07-06.

Implemented:

- Made Owner App/Webapp optional in the Add Shortcut and Edit Shortcut form.
- Saved blank owner input as `General`.
- Added `General` to the owner placeholder.
- Updated helper copy to explain that blank owner fields are for general/system-wide or uncategorized shortcuts.
- Updated the Search Tags preview to show the effective owner, including `General` before save.
- Removed the validation error that previously blocked blank owners.

Created files:

- None.

Modified files:

- `README.md`
- `plan.md`
- `src/components/ShortcutForm.tsx`
- `src/lib/storage.ts`
- `src/lib/validation.ts`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.

Expected behavior:

- Users can leave Owner App/Webapp blank when adding or editing a shortcut.
- Shortcut Vault saves the shortcut with owner `General`.
- Search results and filters show `General` as a normal owner bubble.
- Existing import/export structure remains unchanged.

Tradeoffs:

- The data model still requires `ownerName`; blank input is normalized before storage. This keeps search, filtering, and exports simpler than allowing missing owner names.

Next phase:

- Add focused import/export validation tests or a small test harness.
- Keep real screenshots for the final store-readiness pass when user-provided screenshots are available.

## Phase 10 Completion Notes

Completed on 2026-07-08.

Implemented:

- Extracted official Shortcut Vault import/export format creation and validation into `src/lib/import-export-format.ts`.
- Kept Raycast-specific file, support-path, and local-storage work in `src/lib/import-export.ts`.
- Added `scripts/test-import-export-format.ts` with focused tests for valid exports, official example validation, fallback shortcut display generation, invalid roots, unsupported versions, missing shortcut arrays, invalid modifiers, non-custom imports, and invalid timestamps.
- Added `tsconfig.test.json` so tests can compile TypeScript without adding a new test framework dependency.
- Updated `npm test` to run default database validation and import/export format tests.
- Hardened import validation so `exportedAt`, `createdAt`, and `updatedAt` must be valid date strings.
- Normalized shortcut display ordering to Command-first formatting, matching Shortcut Vault examples such as `⌘ + ⇧ + P`.
- Kept screenshots deferred for the end.

Created files:

- `scripts/test-import-export-format.ts`
- `src/lib/import-export-format.ts`
- `tsconfig.test.json`

Modified files:

- `.gitignore`
- `README.md`
- `eslint.config.mjs`
- `package.json`
- `plan.md`
- `src/data/generated-default-shortcuts.ts`
- `src/lib/import-export.ts`
- `src/lib/shortcut-format.ts`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Import validation now rejects invalid timestamp strings.
- Import validation still accepts official Shortcut Vault export JSON.
- Imports with missing or blank `shortcutDisplay` rebuild the display from modifiers and key.
- Export files remain re-importable without modification.
- Shortcut displays now use Command-first modifier ordering.

Tradeoffs:

- The test harness compiles a focused TypeScript subset into `.tmp/test-build` and runs it with Node. This avoids a dependency-heavy test stack while still giving useful regression coverage.
- Tests focus on pure format validation, not Raycast UI flows or LocalStorage integration.

Git workflow note:

- Commit and merge could not be completed in this folder because `/Users/hyder/Documents/Projects/Raycast Extensions/Shortcut Vault` is not currently a Git repository.

Next phase:

- Add storage-level or import workflow integration coverage if the project is moved into a Git-backed repo and a broader test harness is desired.
- Keep real screenshots for the final store-readiness pass when user-provided screenshots are available.

## Phase 11 Completion Notes

Completed on 2026-07-08.

Implemented:

- Re-read the original Shortcut Vault product prompt and audited the current implementation against it.
- Added duplicate custom shortcut detection before Add/Edit saves.
- Added a confirmation dialog when a custom shortcut already exists with the same normalized owner, scope, key, and modifiers.
- Removed unused `@raycast/utils` dependency to keep the extension dependency-light.
- Documented that blank owner input saving as `General` is an accepted later product change, not an accidental miss from the original prompt.
- Kept screenshots deferred for the final pass, as requested.

Created files:

- None.

Modified files:

- `README.md`
- `package-lock.json`
- `package.json`
- `plan.md`
- `src/components/ShortcutForm.tsx`
- `src/lib/storage.ts`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Add Shortcut and Edit Shortcut save normally when no matching custom shortcut exists.
- If a matching custom shortcut already exists for the same owner, scope, key, and modifiers, Shortcut Vault asks whether to save anyway.
- Users can still intentionally save duplicates after confirmation.
- The extension no longer ships the unused `@raycast/utils` package.

Tradeoffs:

- Duplicate checks are advisory instead of hard blocking. This preserves flexibility for legitimate duplicate shortcut setups.
- Duplicate checks compare custom shortcuts only, because bundled default shortcuts should not prevent users from recording personal overrides.

Original prompt audit result:

- The original prompt is materially covered by the current implementation.
- One original requirement was intentionally superseded by later user direction: Owner App/Webapp is no longer strictly required in the form; blank values save as `General`.

Next phase:

- Store-readiness final pass with user-provided screenshots when available.
- Optional broader storage/import integration tests if a Raycast API mocking approach is added.

## Phase 12 Completion Notes

Completed on 2026-07-08.

Implemented:

- Fixed Search Shortcuts, Search Default Shortcuts, Search Custom Shortcuts, and Manage Custom Shortcuts search input behavior.
- Added explicit native Raycast `List` filtering while keeping `onSearchTextChange` for empty-state text.
- Removed unnecessary search throttling from the shared shortcut list so empty-state feedback updates immediately.
- Kept dropdown filtering by source, scope, and owner unchanged.
- Kept screenshots deferred.

Created files:

- None.

Modified files:

- `plan.md`
- `src/components/ShortcutList.tsx`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Typing in Search Shortcuts immediately filters default and custom shortcuts.
- Typing in Search Default Shortcuts immediately filters bundled shortcuts.
- Typing in Search Custom Shortcuts immediately filters user shortcuts.
- Filtering still matches command name, shortcut keys, owner, scope, and source through Raycast native title/keyword indexing.
- Pressing Enter on a visible shortcut still copies the shortcut keys.

Tradeoffs:

- Search remains Raycast-native rather than custom-filtered in React. This keeps ranking, keyboard behavior, and responsiveness aligned with Raycast.

Next phase:

- Continue development-hardening passes only where user testing exposes real issues.
- Keep deployment, screenshots, and publishing for the user's final store-submission workflow.

## Phase 13 Completion Notes

Completed on 2026-07-08.

Implemented:

- Added `src/lib/shortcut-search.ts` for deterministic shortcut search.
- Added `scripts/test-shortcut-search.ts` and wired it into `npm test`.
- Search now treats space-separated terms as chained filters; every term must match at least one shortcut field.
- Search supports command names, owner names, source type, scope, modifier names, modifier symbols, and key text.
- Search supports inputs like `cmd p`, `cmd+shift+p`, `⌘⇧P`, `option 1`, `cmd slash`, `Figma custom command`, and `Safari app cmd t`.
- Replaced Raycast-native list search with custom search in shared shortcut lists.
- Added existing-owner dropdown in Add/Edit Shortcut.
- Canonicalized typed owners against existing default/custom owners.
- Preserved custom owner entry for owners that do not already exist.
- Kept screenshots and publishing out of scope.

Created files:

- `scripts/test-shortcut-search.ts`
- `src/lib/shortcut-search.ts`

Modified files:

- `README.md`
- `package.json`
- `plan.md`
- `src/components/ShortcutForm.tsx`
- `src/components/ShortcutList.tsx`
- `src/lib/shortcut-data.ts`
- `src/lib/storage.ts`
- `src/types/shortcut.ts`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Typing `Figma custom cmd p` filters to Figma custom shortcuts whose shortcut or metadata matches Command + P.
- Typing command names still works.
- Typing modifier aliases such as `cmd`, `command`, `option`, `alt`, `ctrl`, or symbols such as `⌘` works.
- Typing an existing owner name in Add/Edit Shortcut saves with canonical spelling and owner type.
- Choosing an owner from Existing Owner fills the Owner App/Webapp field.

Tradeoffs:

- Search ranking is deterministic and simple rather than Raycast-fuzzy. This makes chained narrowing predictable.
- Existing-owner selection is implemented with Raycast's native dropdown plus editable text field because Raycast forms do not expose a true editable combobox in this API version.

Next phase:

- Continue development hardening from real usage feedback.
- Keep screenshots, deployment, and publishing for the user's final workflow.

## Phase 14 Completion Notes

Completed on 2026-07-08.

Implemented:

- Created `prepareImportedShortcuts` as the pure import conflict-preparation step.
- Updated `importShortcuts` to reuse the pure preparation function before saving.
- Added import tests for unique imports, conflicts with existing custom shortcuts, duplicate IDs within a single import file, and generated-ID retry behavior.
- Updated README import/export notes.
- Synchronized completed work to `main` before starting this phase, then returned to `work`.

Created files:

- None.

Modified files:

- `README.md`
- `plan.md`
- `scripts/test-import-export-format.ts`
- `src/lib/import-export-format.ts`
- `src/lib/import-export.ts`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Imports with unique shortcut IDs keep those IDs.
- Imports with IDs that conflict with existing custom shortcuts receive new IDs.
- Imports with duplicate IDs inside the same file receive new IDs after the first occurrence.
- Generated IDs are retried if they collide.
- Imported shortcuts are still prepended before existing custom shortcuts.

Tradeoffs:

- This phase tests the import preparation logic rather than mocking Raycast `LocalStorage`. That keeps tests stable and dependency-light while covering the risky conflict behavior.

Next phase:

- Continue development hardening from real usage feedback.
- Keep screenshots, deployment, and publishing for the user's final workflow.

## Phase 15 Completion Notes

Completed on 2026-07-08.

Implemented:

- Removed the separate `Existing Owner` dropdown from Add/Edit Shortcut.
- Kept one `Owner App/Webapp` field for both existing and new owners.
- Preserved canonicalization: typing an existing owner with different casing still saves the existing canonical owner name and owner type.
- Added live `Owner Match` feedback to show whether the typed owner saves as `General`, reuses an existing owner, or creates a new owner.
- Updated README owner-entry language.

Created files:

- None.

Modified files:

- `README.md`
- `plan.md`
- `src/components/ShortcutForm.tsx`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Add/Edit Shortcut shows one owner entry field, not two owner controls.
- Blank owner saves as `General`.
- Typing `figma` saves as existing canonical `Figma` when that owner exists.
- Typing a new owner name saves it as a new owner.

Tradeoffs:

- Raycast's current form API does not expose a true editable combobox, so the extension uses a single text field with canonicalization and live match feedback instead of a combined text/dropdown control.

Next phase:

- Continue development hardening from real usage feedback.
- Keep screenshots, deployment, and publishing for the user's final workflow.

## Phase 16 Completion Notes

Completed on 2026-07-08.

Superseded on 2026-07-09 by Phase 17 after the token-style owner match preview was rejected for looking interactive.

Attempted:

- Added a token-style `Owner Match` preview when typed owner text exactly matched an existing owner.
- Kept Add/Edit Shortcut to one `Owner App/Webapp` text field for both existing and new owners.
- Preserved canonical saving so existing owner casing and owner type are reused.
- Updated README and project plan wording for the new owner-match behavior.

Created files:

- None.

Modified files:

- `README.md`
- `plan.md`
- `src/components/ShortcutForm.tsx`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Observed behavior:

- Typing an existing owner such as `figma` showed a token-style preview for `Figma`.
- The preview looked like an interactive picker, so it was not acceptable as final UI.
- Submitting still saved the shortcut to the canonical existing owner.
- Typing a new owner still showed creation text and saved a new owner name.
- Blank owner still saved as `General`.

Tradeoffs:

- Raycast forms do not support arbitrary colored inline text previews or a true editable combobox. The token attempt was visually stronger but created a misleading affordance, so Phase 17 replaced it with plain preview text.

Next phase:

- Continue development hardening from real usage feedback.
- Keep screenshots, deployment, and publishing for the user's final workflow.

## Phase 17 Completion Notes

Completed on 2026-07-09.

Implemented:

- Replaced the rejected owner token preview with non-interactive `Owner Match` description text.
- Kept existing owner canonicalization and new owner creation in one `Owner App/Webapp` field.
- Prevented empty exports from offering export/copy actions; the empty export screen now guides users to add a shortcut.
- Rejected empty import files with a clear validation error.
- Checked imported shortcut IDs against both existing custom shortcuts and bundled default shortcuts before saving.
- Made shortcut list item keys source-aware to avoid UI key collisions.
- Removed root list navigation title overrides so Raycast can use command titles naturally.
- Added `LICENSE` and `CHANGELOG.md`.
- Updated README with final store handoff steps and clarified that screenshots must be real Raycast captures.

Created files:

- `CHANGELOG.md`
- `LICENSE`

Modified files:

- `README.md`
- `plan.md`
- `scripts/test-import-export-format.ts`
- `src/components/ShortcutForm.tsx`
- `src/components/ShortcutList.tsx`
- `src/export-shortcuts.tsx`
- `src/lib/import-export-format.ts`
- `src/lib/import-export.ts`
- `src/manage-custom-shortcuts.tsx`
- `src/search-custom-shortcuts.tsx`
- `src/search-default-shortcuts.tsx`
- `src/search-shortcuts.tsx`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Typing an existing owner such as `figma` shows plain preview text: `Existing owner: Figma • Mac App`.
- The owner match preview no longer looks like a dropdown, picker, or editable token control.
- Empty export state no longer lets users export an empty JSON file.
- Empty import files fail with a useful message instead of importing zero shortcuts.
- Imported custom shortcut IDs cannot collide with bundled default shortcut IDs.

Tradeoffs:

- The owner match preview is text-only because Raycast `Form.Description` does not support colored inline text. This keeps the UI honest and non-interactive.
- Empty imports are rejected even though an empty JSON envelope could be structurally valid. This better matches the product promise that import/export is for actual shortcut transfer.

Remaining work:

- User must capture and add final real screenshots.
- User must run the final Raycast publish/store flow when ready.

## Phase 18 Completion Notes

Completed on 2026-07-09.

Implemented:

- Clarified scope semantics: Global means the shortcut works anywhere on the Mac; App means inside the owner app; Webapp means inside the owner webapp.
- Removed owner kind from the Add/Edit Shortcut `Owner Match` preview so it now shows text like `Existing owner: Aerospace`.
- Added `inferCustomOwnerType` to keep owner kind separate from scope.
- Updated custom shortcut creation/editing so named Global shortcuts default to `mac-app` ownership instead of `other`.
- Normalized stored custom shortcuts so older named shortcuts saved as `other` read back as app-owned unless they are `General`.
- Renamed the details label from `Owner Type` to `Owner Kind`.
- Changed the `other` owner-kind label to `General` for user-facing copy.
- Added focused owner-kind inference tests.

Created files:

- `scripts/test-owner-type.ts`
- `src/lib/owner-type.ts`

Modified files:

- `README.md`
- `package.json`
- `plan.md`
- `src/components/ShortcutDetails.tsx`
- `src/components/ShortcutForm.tsx`
- `src/lib/labels.ts`
- `src/lib/shortcut-format.ts`
- `src/lib/storage.ts`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Typing `Aerospace` in Add/Edit Shortcut shows `Existing owner: Aerospace`.
- A named global custom shortcut is still app-owned, while its scope remains Global.
- Blank owner still saves as `General`.
- Search tags continue to show owner, source, and scope separately.

Tradeoffs:

- Owner kind is still retained internally for import/export, search, and future filtering, but Add/Edit avoids showing it where it can be confused with scope.

Next:

- Final user screenshot capture and Raycast publishing steps remain the only expected human-owned tasks.

## Phase 19 Completion Notes

Completed on 2026-07-09.

Implemented:

- Added `macOS` default shortcuts sourced from Apple Support's Mac keyboard shortcuts article.
- Added `Mail`, `Calendar`, `Notes`, `Reminders`, `App Store`, and `Freeform` default shortcut datasets from official Apple user guides.
- Expanded bundled default coverage from 76 shortcuts across 11 datasets to 215 shortcuts across 18 datasets.
- Regenerated `src/data/generated-default-shortcuts.ts`.
- Changed owner/app name result tags to one consistent muted color.
- Kept Default and Custom source tags consistently colored by source type.
- Kept Global/App/Webapp scope tags consistently colored by scope.
- Limited rendered search results for search commands: initial broad views show a smaller set, and typed searches render a larger capped set while still searching the full library.

Created files:

- `src/data/default-shortcuts/app-store.json`
- `src/data/default-shortcuts/calendar.json`
- `src/data/default-shortcuts/freeform.json`
- `src/data/default-shortcuts/macos.json`
- `src/data/default-shortcuts/mail.json`
- `src/data/default-shortcuts/notes.json`
- `src/data/default-shortcuts/reminders.json`

Modified files:

- `CHANGELOG.md`
- `README.md`
- `plan.md`
- `src/components/ShortcutList.tsx`
- `src/data/generated-default-shortcuts.ts`

Deleted files:

- None.

Verification:

- `npm run test` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Owner/app name tags use the same muted color for every owner.
- Default source tags remain blue, and Custom source tags remain purple.
- Scope tags remain stable by scope.
- Search commands no longer render every shortcut row at once.
- Typing still searches the full default and custom library.
- Search Default Shortcuts includes 215 bundled shortcuts across 18 owners.

Sources used:

- Apple Support: Mac keyboard shortcuts.
- Apple Support: Keyboard shortcuts in Mail on Mac.
- Apple Support: Keyboard shortcuts in Calendar on Mac.
- Apple Support: Keyboard shortcuts and gestures in Notes on Mac.
- Apple Support: Keyboard shortcuts in Reminders on Mac.
- Apple Support: Keyboard shortcuts and gestures in App Store on Mac.
- Apple Support: Keyboard shortcuts and gestures in Freeform on Mac.

Tradeoffs:

- Search rendering is capped for responsiveness, so very broad queries show a representative subset. Narrowing by owner, command, source, scope, or shortcut keys remains the intended way to reach any shortcut quickly.

Next:

- Final user screenshot capture and Raycast publishing steps remain the only expected human-owned tasks.

## Phase 20 Completion Notes

Completed on 2026-07-09.

Implemented:

- Removed focused TypeScript test files from `scripts/`.
- Removed `tsconfig.test.json`.
- Removed placeholder screenshot assets.
- Removed source/reference-only icon assets.
- Kept `assets/icon.png` as the only production image asset.
- Kept `scripts/generate-default-shortcuts.mjs` and `scripts/validate-default-shortcuts.mjs` because they protect the production shortcut database and preserve the JSON-first architecture.
- Removed deleted test scripts from `package.json`.
- Added `npm run verify` for production readiness checks.
- Updated README and plan to remove references to deleted current assets and test commands.

Deleted files:

- `assets/icon-regenerated-reference.png`
- `assets/icon-source.png`
- `assets/screenshot-add-shortcut-placeholder.png`
- `assets/screenshot-search-placeholder.png`
- `scripts/test-import-export-format.ts`
- `scripts/test-owner-type.ts`
- `scripts/test-shortcut-search.ts`
- `tsconfig.test.json`

Modified files:

- `CHANGELOG.md`
- `README.md`
- `package.json`
- `plan.md`

Verification:

- `npm run validate-data` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run verify` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- The repository no longer contains test-only source files or placeholder screenshot assets.
- Production build, lint, typecheck, and data validation still work.
- The real extension icon remains at `assets/icon.png`.

Tradeoffs:

- Data generation and validation scripts remain because removing them would weaken the shortcut database workflow and make future data-only expansion more error-prone.

Next:

- User-owned final steps are screenshot capture, metadata review, and Raycast Store submission.

## Phase 21 Completion Notes

Completed on 2026-07-09.

Implemented:

- Fixed the TypeScript module-resolution deprecation by switching from `commonjs` + deprecated `node` resolution to `ESNext` + `bundler`.
- Expanded the bundled default shortcut database from 215 shortcuts to 530 shortcuts across the same 18 owners.
- Expanded existing low-count datasets for Chrome, Finder, Safari, Terminal, Xcode, VS Code, Gmail, Slack, Notion, Figma, and Raycast.
- Kept the expansion within the existing JSON-first architecture so search, UI, and storage did not need app-specific registration changes.
- Improved search normalization for symbol-heavy shortcuts such as `?`, `!`, `#`, `@`, brackets, quotes, grave accent, and tilde.
- Regenerated `src/data/generated-default-shortcuts.ts`.
- Updated README and changelog with the new shortcut count and TypeScript resolution decision.

Created files:

- None.

Modified files:

- `CHANGELOG.md`
- `README.md`
- `plan.md`
- `src/data/default-shortcuts/chrome.json`
- `src/data/default-shortcuts/figma.json`
- `src/data/default-shortcuts/finder.json`
- `src/data/default-shortcuts/gmail.json`
- `src/data/default-shortcuts/notion.json`
- `src/data/default-shortcuts/raycast.json`
- `src/data/default-shortcuts/safari.json`
- `src/data/default-shortcuts/slack.json`
- `src/data/default-shortcuts/terminal.json`
- `src/data/default-shortcuts/vscode.json`
- `src/data/default-shortcuts/xcode.json`
- `src/data/generated-default-shortcuts.ts`
- `src/lib/shortcut-search.ts`
- `tsconfig.json`

Deleted files:

- None.

Verification:

- `npm run generate-data` passed and validated 530 default shortcuts across 18 datasets.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run verify` passed.

Expected behavior:

- TypeScript no longer reports the deprecated `moduleResolution=node10` path.
- Search Default Shortcuts includes 530 bundled shortcuts across 18 owners.
- Broad shortcut lists remain capped for responsiveness, while typed searches still filter the full loaded library.
- Symbol-key searches are easier to discover with terms such as `question`, `hash`, `bracket`, `quote`, and `grave`.
- Gmail and other webapp datasets include official single-key shortcuts where the product itself defines them.

Sources used:

- Apple Support: Mac keyboard shortcuts and app-specific shortcut guides.
- Apple Developer: Xcode keyboard shortcuts archive.
- Google Help: Chrome and Gmail keyboard shortcut guides.
- Microsoft: VS Code keyboard shortcuts for macOS.
- Slack Help: Slack keyboard shortcuts.
- Notion Help Center: Notion keyboard shortcuts.
- Figma Help Center: Figma keyboard shortcut panel and documented shortcut articles.
- Raycast Manual: Keyboard shortcuts.

Tradeoffs:

- The database is much deeper but still curated; it does not attempt to mirror every shortcut from every app.
- Some official webapp shortcuts are single letters or punctuation. They are kept because accuracy matters more than making every shortcut look like a macOS modifier chord.
- The TypeScript fix uses modern ES module output because `bundler` resolution cannot be paired with `commonjs`.

Next:

- User-owned final steps are still screenshot capture, final metadata review, and Raycast Store submission.

## Phase 22 Completion Notes

Completed on 2026-07-09.

Implemented:

- Fixed the repeated Add Shortcut flow after saving a shortcut without closing the command.
- Refreshed existing owner options after each successful new shortcut save.
- Reset Add Shortcut values with a fresh object instead of reusing one shared empty values object.
- Remounted the Add Shortcut form after save so Raycast form controls do not retain stale internal field state.
- Kept edit-mode save behavior unchanged: editing still saves, calls the parent refresh callback, and pops back to the previous view.

Created files:

- None.

Modified files:

- `CHANGELOG.md`
- `plan.md`
- `src/components/ShortcutForm.tsx`

Deleted files:

- None.

Verification:

- `npm run verify` passed.
- `npm run dev` started successfully, compiled all seven command entry points, and was stopped after verification.

Expected behavior:

- Add Shortcut can be used repeatedly in one command session.
- After saving one shortcut, the next shortcut entry starts from a clean form.
- Newly created owners are available to the owner-match logic immediately on the next entry.
- The behavior should match closing and reopening Add Shortcut, without making the user leave the command.

Tradeoffs:

- The form remount is intentionally limited to add mode. Edit forms keep their existing navigation behavior to avoid unexpected field resets while editing an existing shortcut.

Next:

- User-owned final steps remain screenshot capture, final metadata review, and Raycast Store submission.
