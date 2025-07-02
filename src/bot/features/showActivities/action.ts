import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { MENU_BUTTONS } from "@bot/markup/buttons";
import { SECTION_EMOJI } from "@bot/markup/constants";
import { keyboards } from "@bot/markup/keyboards";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const showActivitiesAction = (bot: Telegraf<MyContext>) => {
  bot.action(MENU_BUTTONS.ACTIVITIES.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.reply(`${SECTION_EMOJI} Фаа, тут ты можешь раздобыть фейма..`, {
        reply_markup: keyboards.activities.reply_markup,
      });
    } catch (error) {
      userActionsLogger(
        "error",
        "showActivitiesAction",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("❌ Не удалось открыть раздел. Попробуй позже.");
    }
  });
};
