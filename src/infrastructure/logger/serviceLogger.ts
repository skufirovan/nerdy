import logWithContext, { LogMeta } from "./logWithContext";
import { serviceLoggerInstance } from "./instance";

export const serviceLogger = (
  level: "info" | "warn" | "error",
  scope: string,
  message: string,
  meta?: LogMeta
) => {
  logWithContext(serviceLoggerInstance, level, scope, message, meta);
};
