import { MyContext } from "@bot/features/scenes";
import { Telegraf } from "telegraf";
import { EquipmentController } from "@controller";
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
      await ctx.answerCbQuery();

      const accountId = ctx.user!.accountId;
      const message = ctx.update.callback_query.message;
      const caption = hasCaption(message) ? message.caption : undefined;

      if (!caption) return await ctx.reply("❌ Не удалось закупить оборудку");

      const { brand, model } = extractEquipmenNameFromCaption(caption);

      if (!model || !brand)
        return await ctx.reply("❌ Название оборудки не найдено");

      const equipment = await EquipmentController.findEquipmentByBrandAndModel(
        accountId,
        brand,
        model
      );

      if (!equipment) return ctx.reply("🙍🏿‍♂️ Оборудка не найдена");

      await EquipmentController.equipUserEquipment(accountId, equipment.id);

      await ctx.deleteMessage();
      await ctx.reply(
        `${SECTION_EMOJI} Выбрана оборудка <b>${equipment.brand} ${equipment.model}</b>`,
        { parse_mode: "HTML" }
      );
    } catch (error) {
      handleError(ctx, error, "equipEquipmentAction");
    }
  });
};
