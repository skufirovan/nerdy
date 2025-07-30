import { MyContext } from "@bot/features/scenes";
import { Telegraf } from "telegraf";
import { EquipmentController } from "@controller/index";
import { SHOW_EQUIPMENT_BUTTONS } from "../showAllEquipment/keyboard";
import {
  extractEquipmenNameFromCaption,
  handleError,
  hasCaption,
} from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const equipEquipmentAction = (bot: Telegraf<MyContext>) => {
  bot.action(SHOW_EQUIPMENT_BUTTONS.EQUIP_EQUIPMENT.callback, async (ctx) => {
    try {
      const accountId = ctx.user!.accountId;
      const message = ctx.update.callback_query.message;
      const caption = hasCaption(message) ? message.caption : undefined;

      if (!caption)
        return await ctx.answerCbQuery("❌ Не удалось активировать оборудку");

      const { brand, model } = extractEquipmenNameFromCaption(caption);

      if (!model || !brand)
        return await ctx.answerCbQuery("❌ Название оборудки не найдено");

      const equipment = await EquipmentController.findEquipmentByBrandAndModel(
        accountId,
        brand,
        model
      );

      if (!equipment) return ctx.answerCbQuery("🙍🏿‍♂️ Оборудка не найдена");

      await EquipmentController.equipUserEquipment(accountId, equipment.id);

      await ctx.answerCbQuery(
        `${SECTION_EMOJI} Выбрана оборудка ${equipment.brand} ${equipment.model}`
      );
    } catch (error) {
      handleError(ctx, error, "equipEquipmentAction");
    }
  });
};
