import path from "path";
import { Telegraf } from "telegraf";
import { DemoController } from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { MyContext, SessionData } from "../scenes";
import { formatPaginated } from "../pagination/action";
import { keyboards } from "@bot/markup/keyboards";
import { PROFILE_BUTTONS } from "@bot/markup/buttons";

export const showDemosAction = (bot: Telegraf<MyContext>) => {
  bot.action(PROFILE_BUTTONS.DEMOS.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const demos = await DemoController.findByAccountId(ctx.user!.accountId);

      if (!demos) {
        return await ctx.reply("👮🏿‍♂️ Обнаружен лейм без демок");
      }

      const imagePath = path.resolve(
        __dirname,
        "../../assets/images/DEMOS.png"
      );
      const session = ctx.session as SessionData;
      session.pagination = {
        items: demos,
        currentIndex: 0,
        type: "demos",
      };

      const first = demos[0];
      const replyMarkup =
        demos.length > 1 ? keyboards.demos.reply_markup : undefined;

      await ctx.replyWithPhoto(
        { source: imagePath },
        {
          caption: formatPaginated(first, "demos"),
          reply_markup: replyMarkup,
          parse_mode: "HTML",
        }
      );
    } catch (error) {
      userActionsLogger(
        "error",
        "showDemosAction",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("❌ Не удалось открыть раздел. Попробуй позже.");
    }
  });
};
