import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { TradeController } from "@controller/index";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";
import { tradeValueMessage } from "../utils";

export const respondTradeAction = (bot: Telegraf<MyContext>) => {
  bot.action(/^TRADE_RESPOND_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const tradeId = BigInt(ctx.match[1]);
      const session = ctx.session as SessionData;

      const equipment = session.trade?.equipment;
      const racks = session.trade?.racks;

      if (!equipment && !racks) {
        return await ctx.reply("❌ Ты ничего не выбрал для трейда");
      }

      const trade = await TradeController.selectTradeItems(
        ctx.user!.accountId,
        tradeId,
        equipment,
        racks
      );

      await ctx.deleteMessage();
      await ctx.reply(
        `${SECTION_EMOJI} Ты предложил взамен игроку <b>${
          trade.initiator.nickname
        }</b> ${tradeValueMessage(equipment, racks)}`,
        { parse_mode: "HTML" }
      );
      await ctx.telegram.sendMessage(
        String(trade.initiatorId),
        `${SECTION_EMOJI} <b>${
          trade.receiver.nickname
        }</b> предлагает взамен ${tradeValueMessage(equipment, racks)}`,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "❌ Отказаться",
                  callback_data: `TRADE_CANCEL_${trade.id}`,
                },
                {
                  text: "✅ Согласиться",
                  callback_data: `TRADE_COMPLETE_${trade.id}`,
                },
              ],
            ],
          },
        }
      );

      delete session.trade;
    } catch (error) {
      handleError(ctx, error, "respondTradeAction");
    }
  });
};
