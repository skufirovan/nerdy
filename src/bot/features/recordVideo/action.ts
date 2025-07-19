import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { ACTIVITIES_BUTTONS } from "../showActivities/keyboard";
import { handleError } from "@utils/index";

export const recordVideoAction = (bot: Telegraf<MyContext>) => {
  bot.action(ACTIVITIES_BUTTONS.RECORD_VIDEO.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.enter("recordVideo");
    } catch (error) {
      await handleError(ctx, error, "recordVideoAction");
    }
  });
};
