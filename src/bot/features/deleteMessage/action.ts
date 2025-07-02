import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const registerDeleteMessageAction = (bot: Telegraf<MyContext>) => {
  bot.action("DELETE_MESSAGE", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
    } catch (error) {
      userActionsLogger(
        "error",
        "deleteDemoAction",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
    }
  });
};
