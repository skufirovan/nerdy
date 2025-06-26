import { Telegraf } from "telegraf";
import { MyContext } from "@bot/scenes";

export const registerDeleteMessageAction = (bot: Telegraf<MyContext>) => {
  bot.action("DELETE_MESSAGE", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
    } catch (err) {
      throw new Error(`❌ Не удалось удалить сообщение`);
    }
  });
};
