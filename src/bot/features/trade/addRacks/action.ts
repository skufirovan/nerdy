import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { TRADE_BUTTONS } from "../keyboard";
import { handleError } from "@utils/index";

export const addRacksAction = (bot: Telegraf<MyContext>) => {
  bot.action(TRADE_BUTTONS.ADD_RACKS.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.enter("addRacksToTrade");
    } catch (error) {
      handleError(ctx, error, "addRacksAction");
    }
  });
};
