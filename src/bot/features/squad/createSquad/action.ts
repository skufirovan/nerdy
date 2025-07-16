import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { CREATE_SQUAD_BUTTONS } from "../showSquad/keyboard";

export const createSquadAction = (bot: Telegraf<MyContext>) => {
  bot.action(CREATE_SQUAD_BUTTONS.CREATE_SQUAD.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.enter("createSquad");
    } catch (error) {
      userActionsLogger(
        "error",
        "createSquadAction",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("❌ Сервис временно недоступен. Попробуй позже.");
    }
  });
};
