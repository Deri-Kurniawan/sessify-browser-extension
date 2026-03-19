import z from "zod";

export const persistedCookieSchema = z.object({
  domain: z.string(),
  expirationDate: z.number().optional(),
  hostOnly: z.boolean().optional(),
  httpOnly: z.boolean(),
  name: z.string(),
  path: z.string(),
  sameSite: z
    .enum(["no_restriction", "lax", "strict", "unspecified"])
    .optional(),
  secure: z.boolean(),
  session: z.boolean().optional(),
  storeId: z.string().optional(),
  value: z.string(),
});

export const sessionDomainSchema = z.object({
  domain: z.string(),
  sld: z.string(),
  subdomain: z.string(),
  fqdn: z.string(),
  tld: z.string(),
  isIp: z.boolean(),
  isIcann: z.boolean(),
  port: z.number().int().nullable(),
});

export const sessionStateSchema = z.object({
  localStorage: z.record(z.string(), z.string()),
  sessionStorage: z.record(z.string(), z.string()),
  cookies: z.array(persistedCookieSchema),
});

export const sessionSchema = z.object({
  id: z.string().uuid(),
  appIconUrl: z.string(),
  title: z.string().min(1).max(100),
  domain: sessionDomainSchema,
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
  state: sessionStateSchema,
});

export const sessionListSchema = z.array(sessionSchema);

export const activeSessionIdSchema = z
  .union([z.string().uuid(), z.null()])
  .transform((value) => value ?? null);
