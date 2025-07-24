import { bot } from "@bot/index";

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

(async () => {
  try {
    await bot.launch();
  } catch (error) {
    console.error("Bot launch error:", error);
  }
})();
