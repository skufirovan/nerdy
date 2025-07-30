import path from "path";
import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { EquipmentController } from "@controller/index";
import { SHOW_EQUIPMENT_BUTTONS } from "../showAllEquipment/keyboard";
import { getRandomImage, handleError } from "@utils/index";
import { formatPaginated } from "@bot/features/pagination/action";
import { showEquippedKeyboard, showOneEquippedKeyboard } from "./keyboard";

export const showEquippedAction = (bot: Telegraf<MyContext>) => {
  bot.action(
    SHOW_EQUIPMENT_BUTTONS.EQUIPPED_EQUIPMENT.callback,
    async (ctx) => {
      try {
        await ctx.answerCbQuery();

        const equippedEquipment = await EquipmentController.findUserEquipped(
          ctx.user!.accountId
        );

        if (!equippedEquipment || equippedEquipment.length === 0) {
          return await ctx.reply("👮🏿‍♂️ Обнаружен лейм без оборудки");
        }

        const equipment = equippedEquipment.map((e) => e.equipment);

        const replyMarkup =
          equipment.length > 1
            ? showEquippedKeyboard.reply_markup
            : showOneEquippedKeyboard.reply_markup;

        const session = ctx.session as SessionData;
        session.pagination = {
          items: equipment,
          currentIndex: 0,
          type: "equipment",
          replyMarkup,
        };

        const imagePath = await getRandomImage(
          path.resolve(__dirname, "../../../assets/images/EQUIPMENT"),
          path.resolve(__dirname, "../../../assets/images/EQUIPMENT/1.jpg")
        );

        const first = equipment[0];

        await ctx.replyWithPhoto(
          { source: imagePath },
          {
            caption: formatPaginated(first, "equipment"),
            parse_mode: "HTML",
            reply_markup: replyMarkup,
          }
        );
      } catch (error) {
        handleError(ctx, error, "showEquippedEqipmentAction");
      }
    }
  );
};
