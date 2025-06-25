import { bot } from "@bot/index";

(async () => {
  try {
    await bot.launch();
  } catch (error) {
    console.error("Bot launch error:", error);
  }
})();
