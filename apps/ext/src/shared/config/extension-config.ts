export const extensionConfig = {
  keys: {
    extensionId: "sessify_extension_id_v1",
    sessions: "sessify_sessions_v1",
    activeSessionId: "sessify_active_session_id_v1",
    settings: "sessify_settings_v1",
  },
  settings: {
    default: {
      theme: "light",
      confirmBeforeDelete: true,
      confirmBeforeSwitch: false,
      confirmBeforeNewSession: false,
      showBadge: true,
      badgeColor: "#000000",
      badgeTextColor: "#FFFFFF",
      badgeMaxCount: 99,
    },
  },
} as const;
