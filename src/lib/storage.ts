import { LocalStorage } from "@raycast/api";
import {
  MODIFIERS,
  OWNER_TYPES,
  SCOPE_TYPES,
  type Shortcut,
  type ShortcutFormValues,
} from "../types/shortcut";
import { formatShortcutDisplay, normalizeKey, normalizeModifiers } from "./shortcut-format";
import { GENERAL_OWNER_NAME, inferCustomOwnerType } from "./owner-type";

const CUSTOM_SHORTCUTS_KEY = "shortcut-vault.custom-shortcuts";
export { GENERAL_OWNER_NAME };

export async function getCustomShortcuts(): Promise<Shortcut[]> {
  const raw = await LocalStorage.getItem<string>(CUSTOM_SHORTCUTS_KEY);
  if (!raw) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Custom shortcut storage contains invalid JSON.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Stored custom shortcuts are not in the expected format.");
  }

  return parsed.map(parseStoredShortcut);
}

export async function saveCustomShortcuts(shortcuts: Shortcut[]): Promise<void> {
  await LocalStorage.setItem(CUSTOM_SHORTCUTS_KEY, JSON.stringify(shortcuts));
}

export async function createCustomShortcut(values: ShortcutFormValues): Promise<Shortcut> {
  const shortcuts = await getCustomShortcuts();
  const now = new Date().toISOString();
  const shortcut: Shortcut = {
    id: crypto.randomUUID(),
    commandName: values.commandName.trim(),
    modifiers: normalizeModifiers(values.modifiers),
    key: normalizeKey(values.key),
    shortcutDisplay: formatShortcutDisplay(values.modifiers, values.key),
    ownerName: normalizeOwnerName(values.ownerName),
    ownerType: values.ownerType ?? inferCustomOwnerType(values.ownerName, values.scope),
    scope: values.scope,
    notes: values.notes.trim() || undefined,
    sourceType: "custom",
    createdAt: now,
    updatedAt: now,
  };

  await saveCustomShortcuts([shortcut, ...shortcuts]);
  return shortcut;
}

export async function updateCustomShortcut(
  id: string,
  values: ShortcutFormValues,
): Promise<Shortcut> {
  const shortcuts = await getCustomShortcuts();
  const existing = shortcuts.find((shortcut) => shortcut.id === id);

  if (!existing) {
    throw new Error("That custom shortcut could not be found.");
  }

  const updated: Shortcut = {
    ...existing,
    commandName: values.commandName.trim(),
    modifiers: normalizeModifiers(values.modifiers),
    key: normalizeKey(values.key),
    shortcutDisplay: formatShortcutDisplay(values.modifiers, values.key),
    ownerName: normalizeOwnerName(values.ownerName),
    ownerType: values.ownerType ?? inferCustomOwnerType(values.ownerName, values.scope),
    scope: values.scope,
    notes: values.notes.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };

  await saveCustomShortcuts(shortcuts.map((shortcut) => (shortcut.id === id ? updated : shortcut)));
  return updated;
}

export async function findDuplicateCustomShortcut(
  values: ShortcutFormValues,
  excludedId?: string,
): Promise<Shortcut | undefined> {
  const shortcuts = await getCustomShortcuts();
  const ownerName = normalizeOwnerName(values.ownerName).toLocaleLowerCase();
  const key = normalizeKey(values.key);
  const modifiers = normalizeModifiers(values.modifiers);

  return shortcuts.find((shortcut) => {
    if (shortcut.id === excludedId) {
      return false;
    }

    return (
      shortcut.ownerName.toLocaleLowerCase() === ownerName &&
      shortcut.scope === values.scope &&
      shortcut.key === key &&
      areModifiersEqual(shortcut.modifiers, modifiers)
    );
  });
}

export function normalizeOwnerName(ownerName: string): string {
  return ownerName.trim() || GENERAL_OWNER_NAME;
}

function areModifiersEqual(left: Shortcut["modifiers"], right: Shortcut["modifiers"]): boolean {
  return left.length === right.length && left.every((modifier, index) => modifier === right[index]);
}

export async function deleteCustomShortcut(id: string): Promise<void> {
  const shortcuts = await getCustomShortcuts();
  await saveCustomShortcuts(shortcuts.filter((shortcut) => shortcut.id !== id));
}

export async function duplicateCustomShortcut(id: string): Promise<Shortcut> {
  const shortcuts = await getCustomShortcuts();
  const existing = shortcuts.find((shortcut) => shortcut.id === id);

  if (!existing) {
    throw new Error("That custom shortcut could not be found.");
  }

  const now = new Date().toISOString();
  const duplicate: Shortcut = {
    ...existing,
    id: crypto.randomUUID(),
    commandName: `${existing.commandName} Copy`,
    createdAt: now,
    updatedAt: now,
  };

  await saveCustomShortcuts([duplicate, ...shortcuts]);
  return duplicate;
}

function parseStoredShortcut(value: unknown): Shortcut {
  if (!isRecord(value)) {
    throw new Error("Stored custom shortcuts include an invalid item.");
  }

  const modifiers = value.modifiers;
  if (!Array.isArray(modifiers) || !modifiers.every((modifier) => MODIFIERS.includes(modifier))) {
    throw new Error("Stored custom shortcuts include unsupported modifiers.");
  }

  if (value.sourceType !== "custom") {
    throw new Error("Stored shortcuts must be custom shortcuts.");
  }

  const scope = requireString(value.scope, "scope");
  if (!SCOPE_TYPES.includes(scope as Shortcut["scope"])) {
    throw new Error("Stored custom shortcuts include an unsupported scope.");
  }

  const ownerType = typeof value.ownerType === "string" ? value.ownerType : undefined;
  if (ownerType !== undefined && !OWNER_TYPES.includes(ownerType as Shortcut["ownerType"])) {
    throw new Error("Stored custom shortcuts include an unsupported owner type.");
  }

  const key = requireString(value.key, "key");
  const typedModifiers = modifiers as Shortcut["modifiers"];

  const ownerName = requireString(value.ownerName, "ownerName");
  const typedScope = scope as Shortcut["scope"];
  const typedOwnerType = ownerType as Shortcut["ownerType"] | undefined;

  return {
    id: requireString(value.id, "id"),
    commandName: requireString(value.commandName, "commandName"),
    modifiers: normalizeModifiers(typedModifiers),
    key: normalizeKey(key),
    shortcutDisplay: formatShortcutDisplay(typedModifiers, key),
    ownerName,
    ownerType: normalizeStoredOwnerType(ownerName, typedScope, typedOwnerType),
    scope: typedScope,
    notes: typeof value.notes === "string" && value.notes.trim() ? value.notes : undefined,
    sourceType: "custom",
    sourceUrl:
      typeof value.sourceUrl === "string" && value.sourceUrl.trim() ? value.sourceUrl : undefined,
    createdAt: requireString(value.createdAt, "createdAt"),
    updatedAt: requireString(value.updatedAt, "updatedAt"),
  };
}

function normalizeStoredOwnerType(
  ownerName: string,
  scope: Shortcut["scope"],
  ownerType: Shortcut["ownerType"] | undefined,
): Shortcut["ownerType"] {
  if (!ownerType || ownerType === "other") {
    return inferCustomOwnerType(ownerName, scope);
  }

  return ownerType;
}

function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Stored custom shortcut ${fieldName} is missing.`);
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
