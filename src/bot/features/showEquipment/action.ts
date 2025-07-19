import path from "path";
import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "../scenes";
import { UserEquipmentController } from "@controller";
import { formatPaginated } from "../pagination/action";
import { paginationKeyboard } from "../pagination/keyboard";
import { PROFILE_BUTTONS } from "@bot/handlers";
import { getRandomImage, handleError } from "@utils/index";

export const showEquipmentAction = (bot: Telegraf<MyContext>) => {
  bot.action(PROFILE_BUTTONS.EQUIPMENT.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const equipment = await UserEquipmentController.findByAccountId(
        ctx.user!.accountId
      );

      if (!equipment || equipment.length === 0) {
        return await ctx.reply("👮🏿‍♂️ Обнаружен лейм без оборудки");
      }

      const replyMarkup =
        equipment.length > 1 ? paginationKeyboard.reply_markup : undefined;

      const session = ctx.session as SessionData;
      session.pagination = {
        items: equipment,
        currentIndex: 0,
        type: "equipment",
        replyMarkup,
      };

      const imagePath = await getRandomImage(
        path.resolve(__dirname, "../../assets/images/EQUIPMENT"),
        path.resolve(__dirname, "../../assets/images/EQUIPMENT/1.jpg")
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
