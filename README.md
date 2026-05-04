# llama.cpp Command Builder (Windows)

A local, schema-driven webpage that generates `llama.cpp` launch commands and PowerShell scripts.

## What This Page Does

This page is a local command builder for `llama.cpp` on Windows.

Instead of manually typing long command lines, you select options in a form and the app generates:

- a one-line PowerShell command
- a multi-line PowerShell script

It is designed to reduce flag mistakes, make launch profiles reusable, and keep command construction consistent.

## Core Features

- Dynamic UI from a central flag schema
- Main model and draft model file selection (browser-safe pickers)
- PowerShell command + multi-line script generation
- Copy command/script buttons
- Executable-aware filtering (`llama-cli` vs `llama-server`)
- Preset save/load/delete via browser local storage

## How It Works

### 1. Schema-driven form rendering

All configurable options are defined in a metadata schema in `app.js` (`FLAG_SCHEMA`).

Each schema entry describes:

- field key
- label
- input type (`text`, `number`, `select`, `checkbox`, `textarea`)
- mapped CLI flag(s)
- optional aliases
- category grouping
- help text and placeholders

The UI is rendered from this schema at runtime, so adding new flags is mostly a schema update rather than manual HTML wiring.

### 2. Path and model handling

The page includes dedicated path controls for:

- executable path
- main model path (`--model`)
- draft model path (`--spec-draft-model`)

The picker is browser-safe and helps select files quickly, but because browsers restrict filesystem access, full Windows paths are often entered manually.

### 3. Executable-aware behavior

The app inspects the executable path to detect mode:

- `llama-server*` => server mode
- `llama-cli*` (and related CLI binaries) => CLI mode
- unknown => auto mode

Based on mode, incompatible fields are hidden and excluded from command generation.

### 4. Command/script generation

When you click **Generate Script**:

1. The form values are collected.
2. Validation runs (required fields and format checks).
3. Only enabled or populated fields are converted to args.
4. The app emits two outputs:
   - a single-line PowerShell command (`& 'path\\to\\exe' ...`)
   - a multi-line PowerShell script with line continuations.

Quoting is handled for PowerShell so paths and string values are emitted safely.

### 5. Presets

Presets let you store form states under custom names.

- **Save** stores the current values.
- **Load** restores a saved profile.
- **Delete** removes a saved profile.

Presets are stored in browser local storage (not in files in this repo).

## Command Generation Rules

- Executable path is required.
- Main model path is required.
- Prompt source is mutually exclusive: prompt text, prompt file, and binary prompt file cannot be used together.
- Boolean or select toggles with positive/negative forms use only the selected variant.
- Multi-value flags (for example fields requiring exactly two values) are validated and emitted as separate CLI tokens.
- Hidden fields due to executable mode are not emitted.

## Project Files

- `index.html`: App markup
- `styles.css`: App styling
- `app.js`: Flag schema, rendering, validation, generation logic

## Flag Coverage

The schema has been expanded using local help output from Windows binaries such as `llama-cli` and `llama-server`.

Coverage is broad, but not guaranteed to be complete for every future `llama.cpp` release. New releases may introduce, rename, or remove flags.

## Run Locally

No build step is required.

1. Open `index.html` directly in a browser
2. Fill in paths and options
3. Click **Generate Script**

## Notes

- Browsers usually do not expose full local file paths from file pickers.
- For runnable commands, enter full Windows paths manually when needed.
- Presets are browser-local, so they are tied to the browser profile used.
- If your local `llama.cpp` build changes, review and update schema flags in `app.js`.
