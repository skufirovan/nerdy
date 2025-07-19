import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { handleError } from "@utils/index";

export const deleteMessageAction = (bot: Telegraf<MyContext>) => {
  bot.action("DELETE_MESSAGE", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
    } catch (error) {
      await handleError(ctx, error, "deleteMessageAction");
    }
  });
};
