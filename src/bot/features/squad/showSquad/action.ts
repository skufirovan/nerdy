import path from "path";
import { Telegraf } from "telegraf";
import { MyContext } from "../../scenes";
import { MENU_BUTTONS } from "@bot/handlers";
import { SquadController, UserController } from "@controller";
import { SECTION_EMOJI } from "@utils/constants";
import { createSquadKeyboard } from "./keyboard";
import {
  formatSquadMembers,
  getSquadKeyboardByRole,
  handleError,
} from "@utils/index";

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

      const members = await SquadController.findSquadMembers(
        accountId,
        membership.squadName
      );

      const title = `🧌 ${membership.squadName} - ${membership.squad.seasonalFame} Fame\n`;
      const body = formatSquadMembers(members);
      const squadText = [title, ...body];

      const squadKeyboard = getSquadKeyboardByRole(
        membership.role,
        membership.squadName
      );

      const dir = path.resolve("public", "squads");
      const imagePath = path.resolve(dir, `${membership.squadName}.jpg`);

      await ctx.replyWithPhoto(
        { source: imagePath },
        {
          caption: squadText.join("\n"),
          parse_mode: "HTML",
          reply_markup: squadKeyboard.reply_markup,
        }
      );
    } catch (error) {
      await handleError(ctx, error, "showSquadAction");
    }
  });
};
