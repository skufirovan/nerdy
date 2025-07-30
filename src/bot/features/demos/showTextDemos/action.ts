import path from "path";
import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "../../scenes";
import { DemoController } from "@controller/index";
import { formatPaginated } from "../../pagination/action";
import { SHOW_DEMOS_BUTTONS } from "../showDemosMenu/keyboard";
import { paginateDemosKeyboard } from "./keyboard";
import { getRandomImage, handleError, getESMPaths } from "@utils/index";

export const showTextDemosAction = (bot: Telegraf<MyContext>) => {
  bot.action(SHOW_DEMOS_BUTTONS.TEXT_DEMOS.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const allDemos = await DemoController.findByAccountId(
        ctx.user!.accountId
      );

      const textDemos = allDemos.filter((d) => d.text !== null);

      if (!textDemos || textDemos.length === 0) {
        return await ctx.reply("👮🏿‍♂️ Обнаружен лейм без демок");
      }

      const replyMarkup =
        textDemos.length > 1 ? paginateDemosKeyboard.reply_markup : undefined;

      const session = ctx.session as SessionData;
      session.pagination = {
        items: textDemos,
        currentIndex: 0,
        type: "textDemos",
        replyMarkup,
      };

      const { __dirname } = getESMPaths(import.meta.url);
      const imagePath = await getRandomImage(
        path.resolve(__dirname, "../../../assets/images/DEMO"),
        path.resolve(__dirname, "../../../assets/images/DEMO/1.jpg")
      );

      const first = textDemos[0];

      await ctx.replyWithPhoto(
        { source: imagePath },
        {
          caption: formatPaginated(first, "textDemos"),
          parse_mode: "HTML",
          reply_markup: replyMarkup,
        }
      );
    } catch (error) {
      await handleError(ctx, error, "showTextDemosAction");
    }
  });
};
