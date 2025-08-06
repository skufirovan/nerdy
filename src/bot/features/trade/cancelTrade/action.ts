import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { TradeController } from "@controller/index";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const cancelTradeAction = (bot: Telegraf<MyContext>) => {
  bot.action(/^TRADE_CANCEL_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const accountId = ctx.user!.accountId;
      const tradeId = BigInt(ctx.match[1]);

      const trade = await TradeController.cancelTrade(accountId, tradeId);

      const isInitiator = trade.initiatorId === accountId;

      await ctx.editMessageReplyMarkup(undefined);
      await ctx.reply(`${SECTION_EMOJI} Ты отказался от трейда`);
      await ctx.telegram.sendMessage(
        String(isInitiator ? trade.receiverId : trade.initiatorId),
        `❌ Игрок <b>${
          isInitiator ? trade.initiator.nickname : trade.receiver.nickname
        }</b> отказался от трейда`,
        { parse_mode: "HTML" }
      );
    } catch (error) {
      handleError(ctx, error, "cancelTradeAction");
    }
  });
};
