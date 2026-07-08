import { MODIFIERS, SCOPE_TYPES } from "../types/shortcut";
import type { ScopeType, ShortcutFormValues, ShortcutModifier } from "../types/shortcut";

export type FormErrors = Partial<Record<keyof ShortcutFormValues, string>>;

export function isShortcutModifier(value: string): value is ShortcutModifier {
  return MODIFIERS.includes(value as ShortcutModifier);
}

export function isScopeType(value: string): value is ScopeType {
  return SCOPE_TYPES.includes(value as ScopeType);
}

export function validateShortcutForm(values: ShortcutFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.commandName.trim()) {
    errors.commandName = "Enter a command name.";
  }

  if (!values.key.trim()) {
    errors.key = "Enter a key.";
  }

  if (!isScopeType(values.scope)) {
    errors.scope = "Choose a scope.";
  }

  return errors;
}

export function hasFormErrors(errors: FormErrors): boolean {
  return Object.values(errors).some(Boolean);
}
