import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { ACTIVITIES_BUTTONS } from "../showActivities/keyboard";
import { handleError } from "@utils/index";

export const recordDemoAction = (bot: Telegraf<MyContext>) => {
  bot.action(ACTIVITIES_BUTTONS.RECORD_DEMO.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.enter("recordDemo");
    } catch (error) {
      await handleError(ctx, error, "recordDemoAction");
    }
  });
};
