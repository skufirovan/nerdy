import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { ACTIVITIES_BUTTONS } from "../showActivities/keyboard";

export const recordDemoAction = (bot: Telegraf<MyContext>) => {
  bot.action(ACTIVITIES_BUTTONS.RECORD_DEMO.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.enter("recordDemo");
    } catch (error) {
      userActionsLogger(
        "error",
        "recordDemoAction",
        `${(error as Error).message}`,
        {
          accountId: ctx.user!.accountId,
        }
      );
      await ctx.reply("❌ Не удалось открыть раздел. Попробуй позже.");
    }
  });
};
