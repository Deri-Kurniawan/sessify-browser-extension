# Changelog


## v0.1.1


### 🚀 Enhancements

- Integrate TailwindCSS and cleanup unused components/styles - add markdown contents ([de7bf1a](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/de7bf1a))
- Add background service worker and update permissions in manifest ([f4be141](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/f4be141))
- Update manifest and package configuration with new icons and descriptions ([bdee219](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/bdee219))
- Add initial component structure, types, helpers, and utilities - add UI components & themes variables - add author info and url in manifest - add data type declaration - add helpers (BrowserTabs, Cookie, SiteStorage, & Storage) ([103ea34](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/103ea34))
- Add core layout & page components ([1d2e9b3](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/1d2e9b3))
- Refactor App component structure and add routing for popup and sidepanel ([09167d8](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/09167d8))
- **core:** Implement background script with session management ([995018b](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/995018b))
- **session:** Improve filtering and domain handling ([ec21796](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/ec21796))
- Add moment.js for improved date handling - implement moment.js as default session titles ([d05dca3](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/d05dca3))
- **session:** Enhance error handling and validation for session operations ([dac6574](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/dac6574))
- **session:** Add session update & details functionality and add related UI components ([8123b42](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/8123b42))
- **badge:** Implement dynamic badge updates for active sessions ([a814b45](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/a814b45))
- **session:** Enhance session switching with active tab navigation handling ([7acab55](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/7acab55))
- **session:** Enhance session navigation handling by including port comparison and update UI to display session port ([ac86825](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/ac86825))
- **web:** Add landing page with initial design and content ([a05f37b](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/a05f37b))
- **manifest:** Add unlimitedStorage permission to manifest configuration ([a29b900](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/a29b900))
- **web:** Add feedback page & firefox support - add navbar and footer to layout - update middleware matcher more wider ([3ac1be8](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/3ac1be8))
- Add command to toggle feature and configure keyboard shortcut ([bd5ceab](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/bd5ceab))
- Add GitHub Actions workflows for submission and validation ([b9c4803](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/b9c4803))

### 🩹 Fixes

- **session:** Improve active session behavior on session creation and deletion ([c709308](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/c709308))
- Unchanged session retrieval for unsupported protocols ([6556df4](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/6556df4))
- **session:** Ensure update handler updates the first saved session correctly ([410b454](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/410b454))
- **vite:** Remove crx prefix from file names in the build configuration. ([fb5f9b5](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/fb5f9b5))
- **web:** Improve browser support handling ([26958b0](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/26958b0))
- **web:** Update environment variable prefixes to NEXT_PUBLIC for consistency ([cab72d2](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/cab72d2))
- **web:** Adjust styles for consistency ([0ccf81e](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/0ccf81e))
- Update development server port to 3001 and add favicon icon to metadata ([bf4ff48](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/bf4ff48))
- Remove unused permission 'contentSettings' from manifest ([cd0bad8](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/cd0bad8))
- Update configuration errors to facilitate Firefox publication ([8a10ca9](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/8a10ca9))
- **web:** Update Firefox store URL and enhance mobile support handling in HeroSection ([68f6e8a](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/68f6e8a))
- **web:** Remove firefox mobileSupport property ([e29662a](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/e29662a))

### 💅 Refactors

- Disable global CSS in content and update container id ([408224f](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/408224f))
- Update message handling with improved response structure and error handling ([e1dc2df](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/e1dc2df))
- **core:** Move SessifyExtension class and background script to /background ([20624a7](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/20624a7))
- Update navbar to accept dynamic navigation links as props ([a37d03f](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/a37d03f))
- Background script and helper classes for improved error handling and code organization - clear the badge if no session is active in the current tab - add comment docs ([8a192ad](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/8a192ad))
- Changing the project structure to a feature-based structure ([01d9bd0](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/01d9bd0))
- Rename sendMessage to sendToBackground for clarity ([ee0f1f3](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/ee0f1f3))
- Replace handleError with traceError for clarity ([39b1f77](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/39b1f77))
- Update cross-browser-support ([1b87aeb](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/1b87aeb))
- Implement background service for action handling and update EnumBackgroundAction usage - fix storage watcher - add bg action to use zod ([bacf8fe](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/bacf8fe))
- **web:** Remove unused & fix lint, format ([13ebf84](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/13ebf84))
- Correct UI component casing and imports ([f08af5e](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/f08af5e))
- **web:** Move browser support data to a separate config file and update URLs ([f7df211](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/f7df211))

### 📖 Documentation

- Add MIT License to the project ([9d02cb5](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/9d02cb5))
- Add URL field to author information ([2b0c543](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/2b0c543))
- Update README for clarity and accuracy in extension details ([5be0946](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/5be0946))

### 🏡 Chore

- Init project with crxjs app ([e7ce69b](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/e7ce69b))
- Implement shadow DOM for webview container to isolate styles ([29ba2c5](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/29ba2c5))
- Integrate Biome for linting & formatting ([d2ff9b2](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/d2ff9b2))
- Add chrome type reference to helper files ([ac9c290](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/ac9c290))
- **web:** Enhance layout and styling of Hero and Footer sections ([bd1ceca](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/bd1ceca))
- **web:** Add device search params & condition ([59e716c](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/59e716c))
- **web:** Improve SEO for home & feedback page ([9100d61](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/9100d61))
- Update description ([3fe1e5e](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/3fe1e5e))
- **web:** Update published chrome store URL ([54523c6](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/54523c6))
- Update version to 1.0.0 and version_name to 1.0.0 ([fc8473b](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/fc8473b))
- Revert version and version_name to 0.0.0 in package.json ([276ab62](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/276ab62))
- **release:** V0.0.1 ([bd38a3d](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/bd38a3d))
- **release:** Bump version to 0.1.0 ([f3366a9](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/f3366a9))

### 🤖 CI

- Move submit and validate workflow files ([2018faf](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/2018faf))
- Auto update package.json version_name during version bump ([4bd8aa6](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/4bd8aa6))
- Add docs & re-enable submission step in workflow with necessary environment variables ([12ddbe3](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/12ddbe3))
- Disable validation workflow on push trigger ([27b5868](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/27b5868))
- Add missing bun-version field to package.json ([7fd9d19](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/7fd9d19))

### ❤️ Contributors

- Deri Kurniawan ([@Deri-Kurniawan](https://github.com/Deri-Kurniawan))
- GitHub Actions ([@github-actions-up-and-running](https://github.com/github-actions-up-and-running))

## v0.0.1

[compare changes](https://github.com/Deri-Kurniawan/sessify-browser-extension/compare/0.0.1...v0.0.1)

### 🚀 Enhancements

- Add GitHub Actions workflows for submission and validation ([b9c4803](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/b9c4803))

### 💅 Refactors

- Correct UI component casing and imports ([f08af5e](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/f08af5e))

### 🏡 Chore

- Update version to 1.0.0 and version_name to 1.0.0 ([fc8473b](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/fc8473b))
- Revert version and version_name to 0.0.0 in package.json ([276ab62](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/276ab62))

### 🤖 CI

- Move submit and validate workflow files ([2018faf](https://github.com/Deri-Kurniawan/sessify-browser-extension/commit/2018faf))

### ❤️ Contributors

- Deri Kurniawan ([@Deri-Kurniawan](https://github.com/Deri-Kurniawan))

