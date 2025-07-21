import path from "path";
import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "../../scenes";
import { EquipmentController } from "@controller";
import { formatPaginated } from "../../pagination/action";
import { showEquipmentKeyboard, showOneEquipmentKeyboard } from "./keyboard";
import { PROFILE_BUTTONS } from "@bot/handlers";
import { getRandomImage, handleError } from "@utils/index";

export const showEquipmentAction = (bot: Telegraf<MyContext>) => {
  bot.action(PROFILE_BUTTONS.EQUIPMENT.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const userEquipment =
        await EquipmentController.findUserEquipmentsByAccountId(
          ctx.user!.accountId
        );

      if (!userEquipment || userEquipment.length === 0) {
        return await ctx.reply("👮🏿‍♂️ Обнаружен лейм без оборудки");
      }

      const equipment = userEquipment.map((e) => e.equipment);

      const replyMarkup =
        equipment.length > 1
          ? showEquipmentKeyboard.reply_markup
          : showOneEquipmentKeyboard.reply_markup;

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
      await handleError(ctx, error, "showEquipmentAction");
    }
  });
};
