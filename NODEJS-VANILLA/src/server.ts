import { createServer } from "http";
import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { redis } from "./config/redis";
import { logger } from "./infrastructure/logger";

const redisClient = redis;

const PORT = env.PORT || 3000;

const server = createServer(app);

// Graceful shutdown
const shutdown = async () => {
  logger.info("Shutting down gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    if (redisClient) redisClient.disconnect();
    logger.info("Server closed. Goodbye!");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

server.listen(PORT, () => {
  logger.info({ port: PORT, env: env.NODE_ENV }, "Server running");
});
