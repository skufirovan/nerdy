import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { TradeController } from "@controller/index";
import { UserError } from "@infrastructure/error";
import { handleError } from "@utils/index";
import { renderTradeEquipment } from "../utils";

export const acceptTradeAction = (bot: Telegraf<MyContext>) => {
  bot.action(/^TRADE_ACCEPT_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const tradeId = BigInt(ctx.match[1]);

      await TradeController.acceptTrade(ctx.user!.accountId, tradeId);
      await renderTradeEquipment(ctx, false, tradeId);
    } catch (error) {
      handleError(ctx, error, "acceptTradeAction");
      if (error instanceof UserError) {
        try {
          const tradeId = BigInt(ctx.match[1]);

          const trade = await TradeController.findById(
            ctx.user!.accountId,
            tradeId
          );
          if (!trade) return;

          await ctx.telegram.sendMessage(
            String(trade.initiatorId),
            `⚠️ Игрок <b>${trade.receiver.nickname}</b> не может принять трейд`,
            { parse_mode: "HTML" }
          );
        } catch (error) {
          handleError(ctx, error, "acceptTradeAction_catch");
        }
      }
    }
  });
};
