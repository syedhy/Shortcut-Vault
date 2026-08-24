/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `search-shortcuts` command */
  export type SearchShortcuts = ExtensionPreferences & {}
  /** Preferences accessible in the `add-shortcut` command */
  export type AddShortcut = ExtensionPreferences & {}
  /** Preferences accessible in the `export-shortcuts` command */
  export type ExportShortcuts = ExtensionPreferences & {}
  /** Preferences accessible in the `import-shortcuts` command */
  export type ImportShortcuts = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `search-shortcuts` command */
  export type SearchShortcuts = {}
  /** Arguments passed to the `add-shortcut` command */
  export type AddShortcut = {}
  /** Arguments passed to the `export-shortcuts` command */
  export type ExportShortcuts = {}
  /** Arguments passed to the `import-shortcuts` command */
  export type ImportShortcuts = {}
}

