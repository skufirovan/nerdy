import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { EquipmentController } from "@controller/EquipmentController";
import { TRADE_BUTTONS } from "../keyboard";
import {
  extractEquipmenNameFromCaption,
  handleError,
  hasCaption,
} from "@utils/index";

export const chooseEquipmentAction = (bot: Telegraf<MyContext>) => {
  bot.action(TRADE_BUTTONS.CHOOSE_EQUIPMENT.callback, async (ctx) => {
    try {
      const accountId = ctx.user!.accountId;
      const session = ctx.session as SessionData;
      const message = ctx.update.callback_query.message;
      const caption = hasCaption(message) ? message.caption : undefined;

      if (!caption)
        return await ctx.answerCbQuery("❌ Не удалось активировать оборудку");

      const { brand, model } = extractEquipmenNameFromCaption(caption);

      if (!model || !brand)
        return await ctx.answerCbQuery("❌ Название оборудки не найдено");

      const equipment =
        await EquipmentController.findUserEquipmentByBrandAndModel(
          accountId,
          brand,
          model
        );

      if (!equipment) return ctx.answerCbQuery("🙍🏿‍♂️ Оборудка не найдена");

      session.trade = {
        ...session.trade,
        equipment,
      };

      await ctx.answerCbQuery(
        `🎙 Ты выбрал ${equipment.equipment.brand} ${equipment.equipment.model}`
      );
    } catch (error) {
      handleError(ctx, error, "chooseEquipmentAction");
    }
  });
};
