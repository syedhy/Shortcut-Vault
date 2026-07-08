import {
  MODIFIERS,
  OWNER_TYPES,
  SCOPE_TYPES,
  SOURCE_TYPES,
  type Shortcut,
  type ShortcutExportFile,
} from "../types/shortcut";
import { formatShortcutDisplay } from "./shortcut-format";

export const EXPORT_FORMAT = "shortcut-vault";
export const EXPORT_VERSION = 1;

export function createExportFile(shortcuts: Shortcut[]): ShortcutExportFile {
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    shortcuts,
  };
}

export function validateExportFile(value: unknown): ShortcutExportFile {
  if (!isRecord(value)) {
    throw new Error("The import file must contain a JSON object.");
  }

  if (value.format !== EXPORT_FORMAT) {
    throw new Error("Unsupported import format. Expected shortcut-vault.");
  }

  if (value.version !== EXPORT_VERSION) {
    throw new Error(
      `Unsupported import version. Shortcut Vault currently supports version ${EXPORT_VERSION}.`,
    );
  }

  if (!Array.isArray(value.shortcuts)) {
    throw new Error("The import file is missing a shortcuts array.");
  }

  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: requireDateString(value.exportedAt, "exportedAt"),
    shortcuts: value.shortcuts.map((shortcut, index) => validateShortcut(shortcut, index)),
  };
}

function validateShortcut(value: unknown, index: number): Shortcut {
  const label = `shortcuts[${index}]`;

  if (!isRecord(value)) {
    throw new Error(`${label} must be an object.`);
  }

  const modifiers = value.modifiers;
  if (!Array.isArray(modifiers) || !modifiers.every((modifier) => MODIFIERS.includes(modifier))) {
    throw new Error(`${label}.modifiers contains an unsupported modifier.`);
  }

  const ownerType = requireString(value.ownerType, `${label}.ownerType`);
  if (!OWNER_TYPES.includes(ownerType as Shortcut["ownerType"])) {
    throw new Error(`${label}.ownerType is not supported.`);
  }

  const scope = requireString(value.scope, `${label}.scope`);
  if (!SCOPE_TYPES.includes(scope as Shortcut["scope"])) {
    throw new Error(`${label}.scope is not supported.`);
  }

  const sourceType = requireString(value.sourceType, `${label}.sourceType`);
  if (!SOURCE_TYPES.includes(sourceType as Shortcut["sourceType"])) {
    throw new Error(`${label}.sourceType is not supported.`);
  }

  if (sourceType !== "custom") {
    throw new Error(`${label}.sourceType must be custom.`);
  }

  const key = requireString(value.key, `${label}.key`);
  const typedModifiers = modifiers as Shortcut["modifiers"];

  return {
    id: requireString(value.id, `${label}.id`),
    commandName: requireString(value.commandName, `${label}.commandName`),
    modifiers: typedModifiers,
    key,
    shortcutDisplay:
      typeof value.shortcutDisplay === "string" && value.shortcutDisplay.trim()
        ? value.shortcutDisplay
        : formatShortcutDisplay(typedModifiers, key),
    ownerName: requireString(value.ownerName, `${label}.ownerName`),
    ownerType: ownerType as Shortcut["ownerType"],
    scope: scope as Shortcut["scope"],
    notes: typeof value.notes === "string" && value.notes.trim() ? value.notes : undefined,
    sourceType: "custom",
    sourceUrl:
      typeof value.sourceUrl === "string" && value.sourceUrl.trim() ? value.sourceUrl : undefined,
    createdAt: requireDateString(value.createdAt, `${label}.createdAt`),
    updatedAt: requireDateString(value.updatedAt, `${label}.updatedAt`),
  };
}

function requireDateString(value: unknown, fieldName: string): string {
  const text = requireString(value, fieldName);

  if (Number.isNaN(Date.parse(text))) {
    throw new Error(`${fieldName} must be a valid date string.`);
  }

  return text;
}

function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required.`);
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const EXAMPLE_EXPORT: ShortcutExportFile = {
  format: "shortcut-vault",
  version: 1,
  exportedAt: "2026-07-04T00:00:00.000Z",
  shortcuts: [
    {
      id: "example-custom-shortcut",
      commandName: "Open Command Menu",
      modifiers: ["command", "shift"],
      key: "P",
      shortcutDisplay: "⌘ + ⇧ + P",
      ownerName: "VS Code",
      ownerType: "mac-app",
      scope: "app",
      notes: "Example custom shortcut.",
      sourceType: "custom",
      createdAt: "2026-07-04T00:00:00.000Z",
      updatedAt: "2026-07-04T00:00:00.000Z",
    },
  ],
};
