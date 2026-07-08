import {
  Action,
  ActionPanel,
  Color,
  Form,
  Icon,
  Toast,
  showToast,
  useNavigation,
} from "@raycast/api";
import { useState } from "react";
import { MODIFIER_LABELS, SCOPE_LABELS } from "../lib/labels";
import { GENERAL_OWNER_NAME, createCustomShortcut, updateCustomShortcut } from "../lib/storage";
import { formatShortcutDisplay } from "../lib/shortcut-format";
import { hasFormErrors, validateShortcutForm, type FormErrors } from "../lib/validation";
import {
  MODIFIERS,
  type Shortcut,
  type ShortcutFormValues,
  type ShortcutModifier,
} from "../types/shortcut";

type Props = {
  shortcut?: Shortcut;
  onSaved?: () => void;
};

const emptyValues: ShortcutFormValues = {
  commandName: "",
  modifiers: [],
  key: "",
  ownerName: "",
  scope: "global",
  notes: "",
};

export function ShortcutForm({ shortcut, onSaved }: Props) {
  const { pop } = useNavigation();
  const [values, setValues] = useState<ShortcutFormValues>(() =>
    shortcut
      ? {
          commandName: shortcut.commandName,
          modifiers: shortcut.modifiers,
          key: shortcut.key,
          ownerName: shortcut.ownerName,
          scope: shortcut.scope,
          notes: shortcut.notes ?? "",
        }
      : emptyValues,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const preview = formatShortcutDisplay(values.modifiers, values.key);
  const isEditing = Boolean(shortcut);
  const ownerPreview = values.ownerName.trim() || GENERAL_OWNER_NAME;

  async function handleSubmit() {
    const nextErrors = validateShortcutForm(values);
    setErrors(nextErrors);

    if (hasFormErrors(nextErrors)) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Shortcut needs attention",
        message: "Review the highlighted fields.",
      });
      return;
    }

    try {
      if (shortcut) {
        await updateCustomShortcut(shortcut.id, values);
        await showToast({ style: Toast.Style.Success, title: "Shortcut updated" });
        onSaved?.();
        pop();
        return;
      }

      await createCustomShortcut(values);
      await showToast({ style: Toast.Style.Success, title: "Shortcut saved", message: preview });
      setValues(emptyValues);
      setErrors({});
      onSaved?.();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Could not save shortcut",
        message: error instanceof Error ? error.message : "Review the fields and retry.",
      });
    }
  }

  return (
    <Form
      navigationTitle={isEditing ? "Edit Shortcut" : "Add Shortcut"}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.SubmitForm
              title={isEditing ? "Save Shortcut" : "Add Shortcut"}
              icon={isEditing ? Icon.CheckCircle : Icon.Plus}
              onSubmit={handleSubmit}
            />
          </ActionPanel.Section>
          {preview ? (
            <ActionPanel.Section title="Preview">
              <Action.CopyToClipboard title="Copy Preview" content={preview} />
            </ActionPanel.Section>
          ) : null}
        </ActionPanel>
      }
    >
      <Form.TextField
        id="commandName"
        title="Command Name"
        placeholder="New Tab"
        info="Use the exact action name you want to find later."
        value={values.commandName}
        error={errors.commandName}
        onChange={(commandName) => setValues((current) => ({ ...current, commandName }))}
      />
      <Form.Separator />
      <Form.TagPicker
        id="modifiers"
        title="Modifiers"
        info="Pick every modifier in the shortcut. The preview updates immediately."
        value={values.modifiers}
        onChange={(modifiers) =>
          setValues((current) => ({ ...current, modifiers: modifiers as ShortcutModifier[] }))
        }
      >
        {MODIFIERS.map((modifier) => (
          <Form.TagPicker.Item
            key={modifier}
            value={modifier}
            title={MODIFIER_LABELS[modifier]}
            icon={{ source: Icon.Circle, tintColor: getModifierColor(modifier) }}
          />
        ))}
      </Form.TagPicker>
      <Form.TextField
        id="key"
        title="Key"
        placeholder="T, E, Enter, Space, 1"
        info="Enter the final key only. Examples: T, Enter, Space, 1."
        value={values.key}
        error={errors.key}
        onChange={(key) => setValues((current) => ({ ...current, key }))}
      />
      <Form.Description title="Preview" text={preview} />
      <Form.Separator />
      <Form.TextField
        id="ownerName"
        title="Owner App/Webapp"
        placeholder="General, Safari, Gmail, Raycast"
        info="Leave blank to save as General for system-wide or uncategorized shortcuts."
        value={values.ownerName}
        error={errors.ownerName}
        onChange={(ownerName) => setValues((current) => ({ ...current, ownerName }))}
      />
      <Form.Dropdown
        id="scope"
        title="Scope"
        info="Scope controls the colored scope bubble shown in search results."
        value={values.scope}
        error={errors.scope}
        onChange={(scope) =>
          setValues((current) => ({ ...current, scope: scope as ShortcutFormValues["scope"] }))
        }
      >
        <Form.Dropdown.Item
          value="global"
          title={SCOPE_LABELS.global}
          icon={{ source: Icon.Circle, tintColor: Color.Red }}
          keywords={["system-wide", "everywhere"]}
        />
        <Form.Dropdown.Item
          value="app"
          title={SCOPE_LABELS.app}
          icon={{ source: Icon.Circle, tintColor: Color.Orange }}
          keywords={["mac app", "application"]}
        />
        <Form.Dropdown.Item
          value="webapp"
          title={SCOPE_LABELS.webapp}
          icon={{ source: Icon.Circle, tintColor: Color.Green }}
          keywords={["website", "web app", "browser"]}
        />
      </Form.Dropdown>
      <Form.Description
        title="Search Tags"
        text={`${ownerPreview} • Custom • ${values.scope === "global" ? "Global" : values.scope === "app" ? "App" : "Webapp"}`}
      />
      <Form.TextArea
        id="notes"
        title="Notes"
        placeholder="Optional context, caveats, or where this shortcut is configured."
        value={values.notes}
        onChange={(notes) => setValues((current) => ({ ...current, notes }))}
      />
    </Form>
  );
}

function getModifierColor(modifier: ShortcutModifier): Color.ColorLike {
  switch (modifier) {
    case "command":
      return Color.Blue;
    case "option":
      return Color.Purple;
    case "control":
      return Color.Green;
    case "shift":
      return Color.Orange;
    case "fn":
      return Color.SecondaryText;
  }
}
