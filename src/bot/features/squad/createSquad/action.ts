import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { CREATE_SQUAD_BUTTONS } from "../showSquad/keyboard";
import { handleError } from "@utils/index";

export const createSquadAction = (bot: Telegraf<MyContext>) => {
  bot.action(CREATE_SQUAD_BUTTONS.CREATE_SQUAD.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.enter("createSquad");
    } catch (error) {
      await handleError(ctx, error, "createSquadAction");
    }
  });
};
