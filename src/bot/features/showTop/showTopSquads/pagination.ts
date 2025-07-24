import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { paginate } from "@bot/features/pagination/action";
import { TOP_SQUADS_BUTTON } from "./keyboard";
import { SquadMemberWithUserAndSquadDto } from "@domain/dtos";
import { handleError, formatSquad } from "@utils/index";
import { updateFileIdIfNeeded } from "@utils/fileId";
import { SquadController } from "@controller";

export const paginateTopSquadsActions = (bot: Telegraf<MyContext>) => {
  bot.action(TOP_SQUADS_BUTTON.NEXT.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const session = ctx.session as SessionData;
      let pagination = session.pagination;

      if (!pagination) return;

      pagination = paginate(pagination, "NEXT");

      const currentItem = pagination.items[
        pagination.currentIndex
      ] as SquadMemberWithUserAndSquadDto[];

      const newCaption = formatSquad(currentItem);

      const squad = currentItem[0].squad;

      const fileId = await updateFileIdIfNeeded({
        currentFileId: squad.photo,
        localPath: `public/squads/${squad.name}.jpg`,
        telegram: ctx.telegram,
        chatId: process.env.PRIVATE_CHAT!,
        onUpdate: async (newFileId) => {
          await SquadController.updateSquadInfo(
            ctx.user!.accountId,
            squad.name,
            { photo: newFileId }
          );
        },
      });

      await ctx.editMessageMedia(
        {
          type: "photo",
          media: fileId,
          caption: newCaption,
          parse_mode: "HTML",
        },
        { reply_markup: pagination.replyMarkup }
      );

      session.pagination = pagination;
    } catch (error) {
      await handleError(ctx, error, "paginateTopSquadsActions_next");
    }
  });

  bot.action(TOP_SQUADS_BUTTON.PREV.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const session = ctx.session as SessionData;
      let pagination = session.pagination;

      if (!pagination) return;

      pagination = paginate(pagination, "PREV");

      const currentItem = pagination.items[
        pagination.currentIndex
      ] as SquadMemberWithUserAndSquadDto[];

      const newCaption = formatSquad(currentItem);

      const squad = currentItem[0].squad;

      const fileId = await updateFileIdIfNeeded({
        currentFileId: squad.photo,
        localPath: `public/squads/${squad.name}.jpg`,
        telegram: ctx.telegram,
        chatId: process.env.PRIVATE_CHAT!,
        onUpdate: async (newFileId) => {
          await SquadController.updateSquadInfo(
            ctx.user!.accountId,
            squad.name,
            { photo: newFileId }
          );
        },
      });

      await ctx.editMessageMedia(
        {
          type: "photo",
          media: fileId,
          caption: newCaption,
          parse_mode: "HTML",
        },
        { reply_markup: pagination.replyMarkup }
      );

      session.pagination = pagination;
    } catch (error) {
      await handleError(ctx, error, "paginateTopSquadsActions_prev");
    }
  });
};
