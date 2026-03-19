import { defaultSettings } from "./settings";
import { storageKeys } from "./storage";

export const extensionConfig = {
  keys: storageKeys,
  settings: {
    default: defaultSettings,
  },
} as const;
