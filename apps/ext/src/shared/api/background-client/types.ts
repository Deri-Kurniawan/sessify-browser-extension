import type { BackgroundAction } from "@/shared/config";

export type MessageResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export type BackgroundMessage<TPayload = unknown> = {
  action: BackgroundAction;
  payload?: TPayload;
};
