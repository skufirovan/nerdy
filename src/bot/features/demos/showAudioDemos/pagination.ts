import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { paginate } from "@bot/features/pagination/action";
import { AUDIO_DEMOS_BUTTONS } from "./keyboard";
import { DemoDto } from "@domain/dtos";
import { handleError, formatDateToDDMMYYYY } from "@utils/index";

export const formatAudioDemo = (demo: DemoDto) => {
  return [
    `📝 <b>${demo.name}</b>`,
    `📅 ${formatDateToDDMMYYYY(demo.recordedAt)}`,
  ].join("\n");
};

export const paginateAudioDemosActions = (bot: Telegraf<MyContext>) => {
  bot.action(AUDIO_DEMOS_BUTTONS.NEXT.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const session = ctx.session as SessionData;
      let pagination = session.pagination;

      if (!pagination) return;

      pagination = paginate(pagination, "NEXT");

      const currentItem = pagination.items[pagination.currentIndex] as DemoDto;

      const newCaption = formatAudioDemo(currentItem);

      await ctx.editMessageMedia(
        {
          type: "audio",
          media: currentItem.fileId!,
          caption: newCaption,
          parse_mode: "HTML",
        },
        { reply_markup: pagination.replyMarkup }
      );

      session.pagination = pagination;
    } catch (error) {
      await handleError(ctx, error, "paginateAudioDemosActions_next");
    }
  });

  bot.action(AUDIO_DEMOS_BUTTONS.PREV.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const session = ctx.session as SessionData;
      let pagination = session.pagination;

      if (!pagination) return;

      pagination = paginate(pagination, "PREV");

      const currentItem = pagination.items[pagination.currentIndex] as DemoDto;

      const newCaption = formatAudioDemo(currentItem);

      await ctx.editMessageMedia(
        {
          type: "audio",
          media: currentItem.fileId!,
          caption: newCaption,
          parse_mode: "HTML",
        },
        { reply_markup: pagination.replyMarkup }
      );

      session.pagination = pagination;
    } catch (error) {
      await handleError(ctx, error, "paginateAudioDemosActions_prev");
    }
  });
};
