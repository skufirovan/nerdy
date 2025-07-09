import path from "path";
import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "../scenes";
import { UserEquipmentController } from "@controller";
import { formatPaginated } from "../pagination/action";
import { keyboards } from "@bot/markup/keyboards";
import { PROFILE_BUTTONS } from "@bot/markup/buttons";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

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

      const imagePath = path.resolve(
        __dirname,
        "../../assets/images/EQUIPMENT.png"
      );
      const replyMarkup =
        equipment.length > 1 ? keyboards.pagination.reply_markup : undefined;
      const session = ctx.session as SessionData;
      session.pagination = {
        items: equipment,
        currentIndex: 0,
        type: "equipment",
        replyMarkup,
      };

      const first = equipment[0];

      await ctx.replyWithPhoto(
        { source: imagePath },
        {
          caption: formatPaginated(first, "equipment"),
          reply_markup: replyMarkup,
          parse_mode: "HTML",
        }
      );
    } catch (error) {
      userActionsLogger(
        "error",
        "showEquipmentAction",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("❌ Не удалось открыть раздел. Попробуй позже.");
    }
  });
};
