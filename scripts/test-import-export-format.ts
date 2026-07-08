import assert from "node:assert/strict";
import {
  createExportFile,
  EXAMPLE_EXPORT,
  validateExportFile,
} from "../src/lib/import-export-format";
import type { Shortcut, ShortcutExportFile } from "../src/types/shortcut";

const baseShortcut: Shortcut = {
  id: "custom-open-command-menu",
  commandName: "Open Command Menu",
  modifiers: ["command", "shift"],
  key: "P",
  shortcutDisplay: "⌘ + ⇧ + P",
  ownerName: "VS Code",
  ownerType: "mac-app",
  scope: "app",
  sourceType: "custom",
  createdAt: "2026-07-04T00:00:00.000Z",
  updatedAt: "2026-07-04T00:00:00.000Z",
};

run("validates the official example export", () => {
  const result = validateExportFile(EXAMPLE_EXPORT);

  assert.equal(result.format, "shortcut-vault");
  assert.equal(result.version, 1);
  assert.equal(result.shortcuts.length, 1);
  assert.equal(result.shortcuts[0]?.shortcutDisplay, "⌘ + ⇧ + P");
});

run("creates a re-importable export envelope", () => {
  const exportFile = createExportFile([baseShortcut]);
  const result = validateExportFile(exportFile);

  assert.equal(result.shortcuts[0]?.id, baseShortcut.id);
  assert.equal(result.shortcuts[0]?.sourceType, "custom");
  assert.doesNotThrow(() => Date.parse(result.exportedAt));
});

run("rebuilds missing shortcut display from modifiers and key", () => {
  const exportFile = withShortcut({ shortcutDisplay: undefined });
  const result = validateExportFile(exportFile);

  assert.equal(result.shortcuts[0]?.shortcutDisplay, "⌘ + ⇧ + P");
});

run("rejects invalid JSON root values", () => {
  assert.throws(() => validateExportFile([]), /must contain a JSON object/);
});

run("rejects unsupported format versions", () => {
  assert.throws(
    () => validateExportFile({ ...EXAMPLE_EXPORT, version: 999 }),
    /Unsupported import version/,
  );
});

run("rejects missing shortcut arrays", () => {
  assert.throws(
    () => validateExportFile({ format: "shortcut-vault", version: 1, exportedAt: now() }),
    /missing a shortcuts array/,
  );
});

run("rejects unsupported modifiers", () => {
  assert.throws(
    () => validateExportFile(withShortcut({ modifiers: ["hyper"] })),
    /unsupported modifier/,
  );
});

run("rejects default shortcuts in import files", () => {
  assert.throws(
    () => validateExportFile(withShortcut({ sourceType: "default" })),
    /sourceType must be custom/,
  );
});

run("rejects invalid timestamp fields", () => {
  assert.throws(() => validateExportFile(withShortcut({ createdAt: "not a date" })), /valid date/);
});

function run(name: string, test: () => void) {
  test();
  console.log(`ok - ${name}`);
}

function withShortcut(overrides: Record<string, unknown>): ShortcutExportFile {
  return {
    format: "shortcut-vault",
    version: 1,
    exportedAt: now(),
    shortcuts: [
      {
        ...baseShortcut,
        ...overrides,
      } as Shortcut,
    ],
  };
}

function now(): string {
  return "2026-07-04T00:00:00.000Z";
}
