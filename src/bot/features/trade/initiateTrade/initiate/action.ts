import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { TRADE_BUTTONS } from "../../keyboard";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const initiateTradeAction = (bot: Telegraf<MyContext>) => {
  bot.action(TRADE_BUTTONS.INITIATE.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      await ctx.deleteMessage();
      await ctx.reply(`${SECTION_EMOJI} Введи ник игрока`);
      await ctx.scene.enter("chooseTradeReceiver");
    } catch (error) {
      handleError(ctx, error, "initiateTradeAction");
    }
  });
};
