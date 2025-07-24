import { Telegraf } from "telegraf";
import { MyContext } from "../../scenes";
import { MENU_BUTTONS } from "@bot/handlers";
import { SquadController, UserController } from "@controller";
import { SECTION_EMOJI } from "@utils/constants";
import { createSquadKeyboard } from "./keyboard";
import { formatSquad, getSquadKeyboardByRole, handleError } from "@utils/index";
import { updateFileIdIfNeeded } from "@utils/fileId";

export const showSquadAction = (bot: Telegraf<MyContext>) => {
  bot.action(MENU_BUTTONS.SQUAD.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const accountId = ctx.user!.accountId;

      const user = await UserController.findByAccountId(accountId);
      const membership = await SquadController.findMembershipByUserId(
        accountId
      );

      if (!membership) {
        if (!user!.hasPass) {
          return await ctx.reply(
            `${SECTION_EMOJI} Ни пасса, ни объединения.. Ты внатуре лейм`
          );
        }
        return await ctx.reply(
          `${SECTION_EMOJI} Ты не состоишь в объединении, но можешь его создать`,
          { reply_markup: createSquadKeyboard.reply_markup }
        );
      }

      const squad = membership.squad;

      const members = await SquadController.findSquadMembers(
        accountId,
        squad.name
      );

      const squadText = formatSquad(members);

      const squadKeyboard = getSquadKeyboardByRole(
        membership.role,
        squad.adminId
      );

      const fileId = await updateFileIdIfNeeded({
        currentFileId: squad.photo,
        localPath: `public/squads/${squad.name}.jpg`,
        telegram: ctx.telegram,
        chatId: process.env.PRIVATE_CHAT!,
        onUpdate: async (newFileId) => {
          await SquadController.updateSquadInfo(accountId, squad.name, {
            photo: newFileId,
          });
        },
      });

      await ctx.replyWithPhoto(fileId, {
        caption: squadText,
        parse_mode: "HTML",
        reply_markup: squadKeyboard.reply_markup,
      });
    } catch (error) {
      await handleError(ctx, error, "showSquadAction");
    }
  });
};
