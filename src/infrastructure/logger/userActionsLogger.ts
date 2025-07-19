import logWithContext, { LogMeta } from "./logWithContext";
import { userActionsLoggerInstance } from "./instance";

export const userActionsLogger = (
  level: "info" | "warn" | "error",
  scope: string,
  message: string,
  meta?: LogMeta
) => {
  logWithContext(userActionsLoggerInstance, level, scope, message, meta);
};
