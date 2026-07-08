import {
  Action,
  ActionPanel,
  Alert,
  Color,
  Form,
  Icon,
  Toast,
  confirmAlert,
  showToast,
  useNavigation,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { MODIFIER_LABELS, SCOPE_LABELS } from "../lib/labels";
import { getShortcutOwnerOptions, type ShortcutOwnerOption } from "../lib/shortcut-data";
import {
  GENERAL_OWNER_NAME,
  createCustomShortcut,
  findDuplicateCustomShortcut,
  updateCustomShortcut,
} from "../lib/storage";
import { formatShortcutDisplay } from "../lib/shortcut-format";
import { hasFormErrors, validateShortcutForm, type FormErrors } from "../lib/validation";
import {
  MODIFIERS,
  type OwnerType,
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
  ownerType: "other",
  scope: "global",
  notes: "",
};

const GENERAL_OWNER_VALUE = "__general";
const CUSTOM_OWNER_VALUE = "__custom";

export function ShortcutForm({ shortcut, onSaved }: Props) {
  const { pop } = useNavigation();
  const [values, setValues] = useState<ShortcutFormValues>(() =>
    shortcut
      ? {
          commandName: shortcut.commandName,
          modifiers: shortcut.modifiers,
          key: shortcut.key,
          ownerName: shortcut.ownerName,
          ownerType: shortcut.ownerType,
          scope: shortcut.scope,
          notes: shortcut.notes ?? "",
        }
      : emptyValues,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [ownerOptions, setOwnerOptions] = useState<ShortcutOwnerOption[]>([]);
  const preview = formatShortcutDisplay(values.modifiers, values.key);
  const isEditing = Boolean(shortcut);
  const submittedValues = getCanonicalOwnerValues(values, ownerOptions);
  const ownerPreview = submittedValues.ownerName.trim() || GENERAL_OWNER_NAME;
  const selectedKnownOwnerValue = getSelectedKnownOwnerValue(values.ownerName, ownerOptions);

  useEffect(() => {
    void getShortcutOwnerOptions()
      .then(setOwnerOptions)
      .catch(async (error) => {
        await showToast({
          style: Toast.Style.Failure,
          title: "Could not load owners",
          message: error instanceof Error ? error.message : "You can still type an owner manually.",
        });
      });
  }, []);

  async function handleSubmit() {
    const nextErrors = validateShortcutForm(submittedValues);
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
      const duplicate = await findDuplicateCustomShortcut(submittedValues, shortcut?.id);
      if (duplicate) {
        const confirmed = await confirmAlert({
          title: "Save duplicate shortcut?",
          message: `${preview} already exists for ${ownerPreview} as ${duplicate.commandName}.`,
          primaryAction: {
            title: "Save Anyway",
            style: Alert.ActionStyle.Default,
          },
        });

        if (!confirmed) {
          return;
        }
      }

      if (shortcut) {
        await updateCustomShortcut(shortcut.id, submittedValues);
        await showToast({ style: Toast.Style.Success, title: "Shortcut updated" });
        onSaved?.();
        pop();
        return;
      }

      await createCustomShortcut(submittedValues);
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
      <Form.Dropdown
        id="knownOwner"
        title="Existing Owner"
        info="Choose an existing owner to keep app names consistent, or type a custom owner below."
        value={selectedKnownOwnerValue}
        onChange={(ownerValue) => {
          if (ownerValue === GENERAL_OWNER_VALUE) {
            setValues((current) => ({ ...current, ownerName: "", ownerType: "other" }));
            return;
          }

          if (ownerValue === CUSTOM_OWNER_VALUE) {
            return;
          }

          const option = ownerOptions.find((owner) => owner.ownerName === ownerValue);
          if (option) {
            setValues((current) => ({
              ...current,
              ownerName: option.ownerName,
              ownerType: option.ownerType,
            }));
          }
        }}
      >
        <Form.Dropdown.Item
          value={GENERAL_OWNER_VALUE}
          title={GENERAL_OWNER_NAME}
          icon={{ source: Icon.Circle, tintColor: Color.SecondaryText }}
          keywords={["system", "general", "global"]}
        />
        {ownerOptions.length > 0 ? (
          <Form.Dropdown.Section title="Known Owners">
            {ownerOptions.map((owner) => (
              <Form.Dropdown.Item
                key={owner.ownerName}
                value={owner.ownerName}
                title={owner.ownerName}
                icon={{ source: Icon.AppWindow, tintColor: getOwnerColor(owner.ownerType) }}
                keywords={[owner.ownerType]}
              />
            ))}
          </Form.Dropdown.Section>
        ) : null}
        <Form.Dropdown.Item
          value={CUSTOM_OWNER_VALUE}
          title="Custom Owner"
          icon={{ source: Icon.Pencil, tintColor: Color.PrimaryText }}
          keywords={["new", "custom"]}
        />
      </Form.Dropdown>
      <Form.TextField
        id="ownerName"
        title="Owner App/Webapp"
        placeholder="General, Safari, Gmail, Raycast"
        info="Type a custom owner, or type an existing owner name to save it with the canonical spelling."
        value={values.ownerName}
        error={errors.ownerName}
        onChange={(ownerName) =>
          setValues((current) => ({
            ...current,
            ownerName,
          }))
        }
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

function getCanonicalOwnerValues(
  values: ShortcutFormValues,
  ownerOptions: ShortcutOwnerOption[],
): ShortcutFormValues {
  const ownerName = values.ownerName.trim();

  if (!ownerName) {
    return { ...values, ownerName: GENERAL_OWNER_NAME, ownerType: "other" };
  }

  const option = ownerOptions.find(
    (owner) => owner.ownerName.toLocaleLowerCase() === ownerName.toLocaleLowerCase(),
  );

  if (option) {
    return { ...values, ownerName: option.ownerName, ownerType: option.ownerType };
  }

  return { ...values, ownerName, ownerType: inferFormOwnerType(values.scope) };
}

function getSelectedKnownOwnerValue(
  ownerName: string,
  ownerOptions: ShortcutOwnerOption[],
): string {
  const trimmedOwnerName = ownerName.trim();

  if (!trimmedOwnerName) {
    return GENERAL_OWNER_VALUE;
  }

  const option = ownerOptions.find(
    (owner) => owner.ownerName.toLocaleLowerCase() === trimmedOwnerName.toLocaleLowerCase(),
  );

  return option?.ownerName ?? CUSTOM_OWNER_VALUE;
}

function inferFormOwnerType(scope: ShortcutFormValues["scope"]): OwnerType {
  switch (scope) {
    case "app":
      return "mac-app";
    case "webapp":
      return "webapp";
    case "global":
      return "other";
  }
}

function getOwnerColor(ownerType: OwnerType): Color.ColorLike {
  switch (ownerType) {
    case "mac-app":
      return Color.Magenta;
    case "webapp":
      return Color.Green;
    case "system":
      return Color.Yellow;
    case "other":
      return Color.SecondaryText;
  }
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
