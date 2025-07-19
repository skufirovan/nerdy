import path from "path";
import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "../scenes";
import { DemoController } from "@controller";
import { formatPaginated } from "../pagination/action";
import { PROFILE_BUTTONS } from "@bot/handlers";
import { demosKeyboard } from "./keyboard";
import { getRandomImage, handleError } from "@utils/index";

export const showDemosAction = (bot: Telegraf<MyContext>) => {
  bot.action(PROFILE_BUTTONS.DEMOS.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const demos = await DemoController.findByAccountId(ctx.user!.accountId);

      if (!demos || demos.length === 0) {
        return await ctx.reply("👮🏿‍♂️ Обнаружен лейм без демок");
      }

      const replyMarkup =
        demos.length > 1 ? demosKeyboard.reply_markup : undefined;

      const session = ctx.session as SessionData;
      session.pagination = {
        items: demos,
        currentIndex: 0,
        type: "demos",
        replyMarkup,
      };

      const imagePath = await getRandomImage(
        path.resolve(__dirname, "../../assets/images/DEMO"),
        path.resolve(__dirname, "../../assets/images/DEMO/1.jpg")
      );

      const first = demos[0];

      await ctx.replyWithPhoto(
        { source: imagePath },
        {
          caption: formatPaginated(first, "demos"),
          parse_mode: "HTML",
          reply_markup: replyMarkup,
        }
      );
    } catch (error) {
      await handleError(ctx, error, "showDemosAction");
    }
  });
};
