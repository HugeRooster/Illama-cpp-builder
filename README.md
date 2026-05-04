# llama.cpp Command Builder (Windows)

A local, schema-driven webpage that generates `llama.cpp` launch commands and PowerShell scripts.

## Features

- Dynamic UI from a central flag schema
- Main model and draft model file selection (browser-safe pickers)
- PowerShell command + multi-line script generation
- Copy command/script buttons
- Executable-aware filtering (`llama-cli` vs `llama-server`)
- Preset save/load/delete via browser local storage

## Project Files

- `index.html`: App markup
- `styles.css`: App styling
- `app.js`: Flag schema, rendering, validation, generation logic

## Run Locally

No build step is required.

1. Open `index.html` directly in a browser
2. Fill in paths and options
3. Click **Generate Script**

## Notes

- Browsers usually do not expose full local file paths from file pickers.
- For runnable commands, enter full Windows paths manually when needed.

## Push To GitHub

From this project directory:

```powershell
git init -b main
git add .
git commit -m "Initial commit: llama.cpp command builder"
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

If your Git version does not support `-b main`, use:

```powershell
git init
git branch -M main
```
