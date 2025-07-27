import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "../../scenes";
import { DemoController } from "@controller";
import { formatAudioDemo } from "./pagination";
import { SHOW_DEMOS_BUTTONS } from "../showDemosMenu/keyboard";
import { showAudioDemosKeyboard, showOneAudioDemosKeyboard } from "./keyboard";
import { handleError } from "@utils/index";

export const showAudioDemosAction = (bot: Telegraf<MyContext>) => {
  bot.action(SHOW_DEMOS_BUTTONS.AUDIO_DEMOS.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const allDemos = await DemoController.findByAccountId(
        ctx.user!.accountId
      );

      const audioDemos = allDemos.filter((d) => d.fileId !== null);

      if (!audioDemos || audioDemos.length === 0) {
        return await ctx.reply("👮🏿‍♂️ Обнаружен лейм без демок");
      }

      const replyMarkup =
        audioDemos.length > 1
          ? showAudioDemosKeyboard.reply_markup
          : showOneAudioDemosKeyboard.reply_markup;

      const session = ctx.session as SessionData;
      session.pagination = {
        items: audioDemos,
        currentIndex: 0,
        type: "audioDemos",
        replyMarkup,
      };

      const first = audioDemos[0];

      await ctx.replyWithAudio(first.fileId!, {
        caption: formatAudioDemo(first),
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      });
    } catch (error) {
      await handleError(ctx, error, "showAudioDemosAction");
    }
  });
};
