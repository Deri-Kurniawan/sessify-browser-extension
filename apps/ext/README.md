# Sessify

Browser extension for managing and switching between multiple browser sessions efficiently.

---

## 🚀 Features

- 🔄 Quickly switch between multiple sessions/accounts
- 🐛 Dynamic session by current active tab
- ⚡ Built with [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) and [Tailwind CSS](https://tailwindcss.com/)
- 🧩 Powered by [WXT](http://wxt.dev/) for smooth Cross browser extension development

---

## 🛠️ Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/Deri-Kurniawan/sessify-browser-extension.git
cd sessify-browser-extension
bun install
```

Run the development server:

```bash
bun dev
```

Build the extension for chrome & firefox:

```bash
# chrome
bun run build

# firefox
bun run build:firefox
```

Load the extension manually in your chrome browser:

1. Open Chrome and go to:
   ```
   chrome://extensions/
   ```
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist/chrome-mv3/` folder.
4. Enjoy managing your sessions!

or for firefox browser:

1. Open Firefox and go to:
   ```
   about:debugging#/runtime/this-firefox
   ```
2. Click "Load Temporary Add-on" and select the `dist/firefox-mv2/manifest.json` file.
3. Enjoy managing your sessions!

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/license/mit/). See the [LICENSE](LICENSE) file for details.
