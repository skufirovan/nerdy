import { Telegraf } from "telegraf";

export const registerDeleteMessageAction = (bot: Telegraf) => {
  bot.action("DELETE_MESSAGE", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
    } catch (err) {
      throw new Error(`❌ Не удалось удалить сообщение`);
    }
  });
};
