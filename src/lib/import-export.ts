import { environment } from "@raycast/api";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ShortcutExportFile } from "../types/shortcut";
import { createExportFile, validateExportFile } from "./import-export-format";
import { formatShortcutDisplay, normalizeKey, normalizeModifiers } from "./shortcut-format";
import { getCustomShortcuts, saveCustomShortcuts } from "./storage";
export {
  EXAMPLE_EXPORT,
  EXPORT_FORMAT,
  EXPORT_VERSION,
  createExportFile,
} from "./import-export-format";

export type ImportResult = {
  importedCount: number;
  regeneratedIds: number;
};

export async function writeExportFile(): Promise<{
  filePath: string;
  count: number;
  json: string;
}> {
  const shortcuts = await getCustomShortcuts();
  const exportFile = createExportFile(shortcuts);
  const json = JSON.stringify(exportFile, null, 2);
  const exportDir = path.join(environment.supportPath, "exports");
  const exportTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(exportDir, `shortcut-vault-${exportTimestamp}.json`);

  await mkdir(exportDir, { recursive: true });
  await writeFile(filePath, json, "utf8");

  return { filePath, count: shortcuts.length, json };
}

export async function readImportFile(filePath: string): Promise<ShortcutExportFile> {
  const raw = await readFile(filePath, "utf8");
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }

  return validateExportFile(parsed);
}

export async function importShortcuts(filePath: string): Promise<ImportResult> {
  const exportFile = await readImportFile(filePath);
  const existing = await getCustomShortcuts();
  const seenIds = new Set(existing.map((shortcut) => shortcut.id));
  let regeneratedIds = 0;

  const imported = exportFile.shortcuts.map((shortcut) => {
    const id = seenIds.has(shortcut.id) ? crypto.randomUUID() : shortcut.id;
    if (id !== shortcut.id) {
      regeneratedIds += 1;
    }

    seenIds.add(id);

    return {
      ...shortcut,
      id,
      modifiers: normalizeModifiers(shortcut.modifiers),
      key: normalizeKey(shortcut.key),
      shortcutDisplay: formatShortcutDisplay(shortcut.modifiers, shortcut.key),
      sourceType: "custom" as const,
      updatedAt: new Date().toISOString(),
    };
  });

  await saveCustomShortcuts([...imported, ...existing]);

  return { importedCount: imported.length, regeneratedIds };
}
