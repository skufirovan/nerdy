import winston from "winston";

const baseFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
  )
);

const colorizedFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
  )
);

export const userActionsLoggerInstance = winston.createLogger({
  level: "info",
  format: baseFormat,
  transports: [
    new winston.transports.Console({
      format: colorizedFormat,
    }),
    new winston.transports.File({ filename: "logs/user-actions.log" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
});

export const serviceLoggerInstance = winston.createLogger({
  level: "info",
  format: baseFormat,
  transports: [
    new winston.transports.Console({
      format: colorizedFormat,
    }),
    new winston.transports.File({ filename: "logs/services.log" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
});
