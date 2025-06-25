import winston from "winston";

export interface LogMeta {
  accountId: bigint | null;
  username?: string | null;
  text?: string;
}

const logWithContext = (
  logger: winston.Logger,
  level: "info" | "warn" | "error",
  scope: string,
  message: string,
  meta?: LogMeta
) => {
  const parts = [`[${scope}]`];

  if (meta?.accountId) parts.push(`ID: ${meta.accountId}`);
  if (meta?.username) parts.push(`@${meta.username}`);
  if (meta?.text) parts.push(`📩 "${meta.text}"`);

  logger.log(level, `${parts.join(" ")} — ${message}`);
};

export default logWithContext;
