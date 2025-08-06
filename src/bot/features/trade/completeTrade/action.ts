import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { TradeController } from "@controller/index";
import { UserError } from "@infrastructure/error";
import { handleError } from "@utils/index";

export const completeTradeAction = (bot: Telegraf<MyContext>) => {
  bot.action(/^TRADE_COMPLETE_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const tradeId = BigInt(ctx.match[1]);

      const trade = await TradeController.completeTrade(
        ctx.user!.accountId,
        tradeId
      );

      await ctx.editMessageReplyMarkup(undefined);
      await ctx.reply(`👨🏿‍💼 Трейд завершен`);
      await ctx.telegram.sendMessage(
        String(trade.receiverId),
        `👨🏿‍💼 Трейд завершен`
      );
    } catch (error) {
      handleError(ctx, error, "completeTradeAction");
      if (error instanceof UserError) {
        try {
          const tradeId = BigInt(ctx.match[1]);

          const trade = await TradeController.findById(
            ctx.user!.accountId,
            tradeId
          );
          if (!trade) return;

          await ctx.telegram.sendMessage(
            String(trade.receiverId),
            `⚠️ Игрок <b>${trade.initiator.nickname}</b> не может принять трейд`,
            { parse_mode: "HTML" }
          );
        } catch (error) {
          handleError(ctx, error, "completeTradeAction_catch");
        }
      }
    }
  });
};
