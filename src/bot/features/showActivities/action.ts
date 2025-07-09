import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { MENU_BUTTONS } from "@bot/handlers";
import { activitiesKeyboard } from "./keyboard";
import { SECTION_EMOJI } from "@utils/constants";

export const showActivitiesAction = (bot: Telegraf<MyContext>) => {
  bot.action(MENU_BUTTONS.ACTIVITIES.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.reply(`${SECTION_EMOJI} Фаа, тут ты можешь раздобыть фейма..`, {
        reply_markup: activitiesKeyboard.reply_markup,
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
