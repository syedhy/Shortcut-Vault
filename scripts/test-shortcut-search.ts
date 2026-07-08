import assert from "node:assert/strict";
import { searchShortcuts, tokenizeSearchQuery } from "../src/lib/shortcut-search";
import type { Shortcut } from "../src/types/shortcut";

const shortcuts: Shortcut[] = [
  shortcut({
    id: "figma-default-open-search",
    commandName: "Open Search",
    modifiers: ["command"],
    key: "/",
    shortcutDisplay: "⌘ + /",
    ownerName: "Figma",
    ownerType: "webapp",
    scope: "webapp",
    sourceType: "default",
  }),
  shortcut({
    id: "figma-custom-command-menu",
    commandName: "Open Command Menu",
    modifiers: ["command", "shift"],
    key: "P",
    shortcutDisplay: "⌘ + ⇧ + P",
    ownerName: "Figma",
    ownerType: "webapp",
    scope: "global",
    sourceType: "custom",
  }),
  shortcut({
    id: "safari-default-new-tab",
    commandName: "New Tab",
    modifiers: ["command"],
    key: "T",
    shortcutDisplay: "⌘ + T",
    ownerName: "Safari",
    ownerType: "mac-app",
    scope: "app",
    sourceType: "default",
  }),
  shortcut({
    id: "raycast-custom-open-vault",
    commandName: "Open Shortcut Vault",
    modifiers: ["option"],
    key: "1",
    shortcutDisplay: "⌥ + 1",
    ownerName: "Raycast",
    ownerType: "mac-app",
    scope: "global",
    sourceType: "custom",
  }),
];

run("tokenizes modifier aliases and plus separators", () => {
  assert.deepEqual(tokenizeSearchQuery("cmd + shift + p"), ["command", "shift", "p"]);
  assert.deepEqual(tokenizeSearchQuery("⌘⇧P"), ["command", "shift", "p"]);
  assert.deepEqual(tokenizeSearchQuery("alt plus 1"), ["option", "1"]);
});

run("matches command names", () => {
  assert.deepEqual(ids("open command menu"), ["figma-custom-command-menu"]);
});

run("matches shortcut key aliases", () => {
  assert.deepEqual(ids("cmd p"), ["figma-custom-command-menu"]);
  assert.deepEqual(ids("cmd+shift+p"), ["figma-custom-command-menu"]);
  assert.deepEqual(ids("cmd slash"), ["figma-default-open-search"]);
  assert.deepEqual(ids("option 1"), ["raycast-custom-open-vault"]);
});

run("chains owner, source, scope, and command terms", () => {
  assert.deepEqual(ids("figma custom global command"), ["figma-custom-command-menu"]);
  assert.deepEqual(ids("figma default search"), ["figma-default-open-search"]);
  assert.deepEqual(ids("safari app cmd t"), ["safari-default-new-tab"]);
});

run("requires every search term to match", () => {
  assert.deepEqual(ids("figma safari"), []);
  assert.deepEqual(ids("figma custom new tab"), []);
});

function ids(query: string): string[] {
  return searchShortcuts(shortcuts, query).map((item) => item.id);
}

function run(name: string, test: () => void) {
  test();
  console.log(`ok - ${name}`);
}

function shortcut(overrides: Partial<Shortcut>): Shortcut {
  return {
    id: "shortcut",
    commandName: "Shortcut",
    modifiers: [],
    key: "K",
    shortcutDisplay: "K",
    ownerName: "General",
    ownerType: "other",
    scope: "global",
    sourceType: "custom",
    createdAt: "2026-07-08T00:00:00.000Z",
    updatedAt: "2026-07-08T00:00:00.000Z",
    ...overrides,
  };
}
