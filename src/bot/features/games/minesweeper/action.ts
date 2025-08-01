import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { ACTIVITIES_BUTTONS } from "@bot/features/showActivities/keyboard";
import { handleError } from "@utils/index";

export const minesweeperGameAction = (bot: Telegraf<MyContext>) => {
  bot.action(ACTIVITIES_BUTTONS.SAPPER.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      await ctx.scene.enter("minesweeperGame");
    } catch (error) {
      handleError(ctx, error, "minesweeperGameAction");
    }
  });
};
