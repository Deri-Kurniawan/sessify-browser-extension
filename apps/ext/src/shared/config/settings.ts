import z from "zod";

const hexColorSchema = z.string().regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);

export const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("light"),
  confirmBeforeDelete: z.boolean().default(true),
  confirmBeforeSwitch: z.boolean().default(false),
  confirmBeforeNewSession: z.boolean().default(false),
  showBadge: z.boolean().default(true),
  badgeColor: hexColorSchema.default("#000000"),
  badgeTextColor: hexColorSchema.default("#FFFFFF"),
  badgeMaxCount: z.number().int().min(1).max(999).default(99),
});

export type Settings = z.infer<typeof settingsSchema>;

export const defaultSettings: Settings = settingsSchema.parse({});
