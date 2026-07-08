import { environment } from "@raycast/api";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ShortcutExportFile } from "../types/shortcut";
import {
  createExportFile,
  prepareImportedShortcuts,
  validateExportFile,
} from "./import-export-format";
import { getDefaultShortcuts } from "./default-shortcuts";
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
  const imported = prepareImportedShortcuts(exportFile.shortcuts, [
    ...existing,
    ...getDefaultShortcuts(),
  ]);

  await saveCustomShortcuts([...imported.shortcuts, ...existing]);

  return { importedCount: imported.shortcuts.length, regeneratedIds: imported.regeneratedIds };
}
