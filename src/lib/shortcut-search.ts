import type { Shortcut } from "../types/shortcut";
import { OWNER_TYPE_LABELS, SCOPE_LABELS, SOURCE_LABELS } from "./labels";

export function searchShortcuts(shortcuts: Shortcut[], query: string): Shortcut[] {
  const terms = tokenizeSearchQuery(query);

  if (terms.length === 0) {
    return shortcuts;
  }

  return shortcuts.filter((shortcut) => {
    const index = buildShortcutSearchIndex(shortcut);
    return terms.every((term) => index.some((value) => matchesSearchTerm(value, term)));
  });
}

export function tokenizeSearchQuery(query: string): string[] {
  const normalized = normalizeSearchValue(query);
  return normalized
    .split(" ")
    .map((term) => term.trim())
    .filter((term) => term && term !== "plus");
}

function buildShortcutSearchIndex(shortcut: Shortcut): string[] {
  return [
    shortcut.commandName,
    shortcut.shortcutDisplay,
    shortcut.ownerName,
    shortcut.ownerType,
    OWNER_TYPE_LABELS[shortcut.ownerType],
    shortcut.scope,
    SCOPE_LABELS[shortcut.scope],
    shortcut.sourceType,
    SOURCE_LABELS[shortcut.sourceType],
    shortcut.key,
    ...shortcut.modifiers,
  ].map(normalizeSearchValue);
}

function normalizeSearchValue(value: string): string {
  return value
    .toLocaleLowerCase()
    .replaceAll("⌘", " command ")
    .replaceAll("⌥", " option ")
    .replaceAll("⌃", " control ")
    .replaceAll("⇧", " shift ")
    .replaceAll("/", " slash ")
    .replaceAll("\\", " backslash ")
    .replaceAll(".", " dot ")
    .replaceAll(",", " comma ")
    .replaceAll("-", " minus ")
    .replaceAll("=", " equals ")
    .replace(/\bcmd\b/g, "command")
    .replace(/\bcommand\b/g, "command")
    .replace(/\bopt\b/g, "option")
    .replace(/\balt\b/g, "option")
    .replace(/\boption\b/g, "option")
    .replace(/\bctrl\b/g, "control")
    .replace(/\bctl\b/g, "control")
    .replace(/\bcontrol\b/g, "control")
    .replace(/\bshift\b/g, "shift")
    .replace(/\bfn\b/g, "fn")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function matchesSearchTerm(value: string, term: string): boolean {
  if (term.length === 1) {
    return value.split(" ").includes(term);
  }

  return value.includes(term);
}
