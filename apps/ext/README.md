# Sessify Extension

Browser extension for managing and switching between multiple browser sessions efficiently.

## Features

- Quickly switch between multiple sessions and accounts
- Filter sessions based on the current active tab
- Built with React 19, TypeScript, Tailwind CSS, and WXT

## Architecture

- [Architecture](./docs/ARCHITECTURE.md)

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/Deri-Kurniawan/sessify-browser-extension.git
cd sessify-browser-extension
bun install
```

Run the extension in development:

```bash
bun dev
```

Build the extension:

```bash
# Chrome
bun run build

# Firefox
bun run build:firefox
```

## Load Unpacked

Chrome:

1. Open `chrome://extensions/`
2. Enable Developer mode
3. Click Load unpacked
4. Select `dist/chrome-mv3/`

Firefox:

1. Open `about:debugging#/runtime/this-firefox`
2. Click Load Temporary Add-on
3. Select `dist/firefox-mv2/manifest.json`

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit/).
