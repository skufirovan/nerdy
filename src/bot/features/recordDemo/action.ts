import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { ACTIVITIES_BUTTONS } from "@bot/markup/buttons";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const recordDemo = (bot: Telegraf<MyContext>) => {
  bot.action(ACTIVITIES_BUTTONS.RECORD_DEMO.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.enter("recordDemo");
    } catch (error) {
      userActionsLogger("error", "recordDemo", `${(error as Error).message}`, {
        accountId: ctx.user!.accountId,
      });
      await ctx.reply("❌ Не удалось открыть раздел. Попробуй позже.");
    }
  });
};
