import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { MENU_BUTTONS } from "@bot/handlers";
import { handleError } from "@utils/index";
import { renderTradeEquipment } from "../../utils";

export const entryTradeAction = (bot: Telegraf<MyContext>) => {
  bot.action(MENU_BUTTONS.TRADE.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await renderTradeEquipment(ctx, true);
    } catch (error) {
      handleError(ctx, error, "entryTradeAction");
    }
  });
};
