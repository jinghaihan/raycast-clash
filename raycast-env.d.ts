/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** App - The app to toggle proxy */
  "app": "Clash" | "ClashX" | "ClashX Pro",
  /** URL - The URL of the Clash API */
  "url": string,
  /** Secret - The secret of the Clash API */
  "secret": string,
  /** Benchmark Timeout - The timeout of the benchmark */
  "benchmarkTimeout": string,
  /** Benchmark URL - The URL of the benchmark */
  "benchmarkUrl": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `overview` command */
  export type Overview = ExtensionPreferences & {}
  /** Preferences accessible in the `mode` command */
  export type Mode = ExtensionPreferences & {}
  /** Preferences accessible in the `proxies` command */
  export type Proxies = ExtensionPreferences & {}
  /** Preferences accessible in the `logs` command */
  export type Logs = ExtensionPreferences & {}
  /** Preferences accessible in the `toggle` command */
  export type Toggle = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `overview` command */
  export type Overview = {}
  /** Arguments passed to the `mode` command */
  export type Mode = {}
  /** Arguments passed to the `proxies` command */
  export type Proxies = {}
  /** Arguments passed to the `logs` command */
  export type Logs = {}
  /** Arguments passed to the `toggle` command */
  export type Toggle = {}
}

