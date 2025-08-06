import { Scenes } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { message } from "telegraf/filters";
import { UserController, TradeController } from "@controller/index";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";
import { tradeValueMessage } from "../../utils";

export const chooseTradeReceiverScene = new Scenes.BaseScene<MyContext>(
  "chooseTradeReceiver"
);

chooseTradeReceiverScene.on(message("text"), async (ctx: MyContext) => {
  try {
    if (!ctx.message || !("text" in ctx.message))
      return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");

    const accountId = ctx.user!.accountId;
    const session = ctx.session as SessionData;
    const nickname = ctx.message.text.trim();

    const receiver = await UserController.findByNickname(accountId, nickname);

    if (!receiver) {
      await ctx.reply("❌ Игрок с таким ником не найден");
      return ctx.scene.leave();
    }

    const equipment = session.trade?.equipment;
    const racks = session.trade?.racks;

    if (!equipment && !racks) {
      await ctx.reply("❌ Ты ничего не выбрал для трейда");
      return ctx.scene.leave();
    }

    const trade = await TradeController.initiateTrade(
      accountId,
      receiver.accountId,
      equipment,
      racks
    );

    await ctx.reply(
      `${SECTION_EMOJI} Ты отправил трейд игроку <b>${
        receiver.nickname
      }</b> на ${tradeValueMessage(equipment, racks)}`,
      { parse_mode: "HTML" }
    );
    await ctx.telegram.sendMessage(
      String(receiver.accountId),
      `${SECTION_EMOJI} <b>${
        trade.initiator.nickname
      }</b> предлагает трейд на ${tradeValueMessage(equipment, racks)}`,
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
                callback_data: `TRADE_ACCEPT_${trade.id}`,
              },
            ],
          ],
        },
      }
    );
    await ctx.scene.leave();
  } catch (error) {
    await handleError(ctx, error, "chooseTradeReceiverScene_on");
    return ctx.scene.leave();
  }
});

chooseTradeReceiverScene.leave((ctx) => {
  const session = ctx.session as SessionData;
  delete session.trade;
});
