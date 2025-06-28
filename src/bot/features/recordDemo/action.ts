import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { ACTIVITIES_BUTTONS } from "@bot/markup/buttons";

export const recordDemo = (bot: Telegraf<MyContext>) => {
  bot.action(ACTIVITIES_BUTTONS.RECORD_DEMO.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.enter("recordDemo");
    } catch (err) {
      console.error("Ошибка при открытии раздела активностей:", err);
      await ctx.reply("❌ Не удалось открыть раздел. Попробуй позже.");
    }
  });
};
