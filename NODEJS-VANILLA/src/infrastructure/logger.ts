import pino from "pino";

const nodeEnv = process.env.NODE_ENV ?? "development";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (nodeEnv === "production" ? "info" : "debug"),
  transport:
    nodeEnv !== "production"
      ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
      : undefined,
});
