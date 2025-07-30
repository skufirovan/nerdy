import { MyContext } from "@bot/features/scenes";
import { Markup, Telegraf } from "telegraf";
import { UserController } from "@controller/index";
import { EQUIPMENT_SHOP_BUTTONS } from "../showEquipmentShop/keyboard";
import {
  handleError,
  hasCaption,
  extractEquipmenNameFromCaption,
} from "@utils/index";

export const buyEquipmentAction = (bot: Telegraf<MyContext>) => {
  bot.action(EQUIPMENT_SHOP_BUTTONS.BUY_EQUIPMENT.callback, async (ctx) => {
    try {
      const message = ctx.update.callback_query.message;
      const caption = hasCaption(message) ? message.caption : undefined;

      if (!caption)
        return await ctx.answerCbQuery("❌ Не удалось закупить оборудку");

      const { brand, model } = extractEquipmenNameFromCaption(caption);

      if (!model || !brand)
        return await ctx.answerCbQuery("❌ Название оборудки не найдено");

      await ctx.answerCbQuery();
      await ctx.reply(`🧾 Подтвердить покупку <b>${brand} ${model}</b>?`, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback("❌ Отменить", "DELETE_MESSAGE"),
            Markup.button.callback(
              "✅ Подтвердить",
              `CONFIRM_BUY_EQUIPMENT_${brand}_${model}`
            ),
          ],
        ]).reply_markup,
      });
    } catch (error) {
      handleError(ctx, error, "buyEquipmentAction");
    }
  });

  bot.action(/^CONFIRM_BUY_EQUIPMENT_(.+)_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const brand = ctx.match[1];
      const model = ctx.match[2];
      const accountId = ctx.user!.accountId;

      await UserController.buyEquipment(accountId, brand, model);

      await ctx.reply(`📦 Ты приобрёл <b>${brand} ${model}</b>`, {
        parse_mode: "HTML",
      });
    } catch (error) {
      handleError(ctx, error, "buyEquipmentAction_confirm");
    }
  });
};
