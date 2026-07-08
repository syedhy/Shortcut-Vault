import type { Shortcut, ShortcutFilter } from "../types/shortcut";
import { getDefaultShortcuts } from "./default-shortcuts";
import { getCustomShortcuts } from "./storage";

export async function getShortcuts(filter: ShortcutFilter): Promise<Shortcut[]> {
  if (filter === "default") {
    return getDefaultShortcuts();
  }

  const defaults = filter === "custom" ? [] : getDefaultShortcuts();
  const custom = await getCustomShortcuts();

  return [...custom, ...defaults].sort(sortShortcuts);
}

function sortShortcuts(a: Shortcut, b: Shortcut): number {
  const ownerCompare = a.ownerName.localeCompare(b.ownerName);
  if (ownerCompare !== 0) {
    return ownerCompare;
  }

  return a.commandName.localeCompare(b.commandName);
}
