import type z from "zod";
import type { EnumBackgroundAction } from "@/constants";

export type EnumBackgroundActionType = z.infer<typeof EnumBackgroundAction>;
