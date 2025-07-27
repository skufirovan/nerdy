import { MyContext } from "@bot/features/scenes";
import { PROFILE_BUTTONS } from "@bot/handlers";
import { handleError } from "@utils/index";
import { Telegraf } from "telegraf";
import { showDemosKeyboard } from "./keyboard";
import { SECTION_EMOJI } from "@utils/constants";

export const showDemosMenuAction = (bot: Telegraf<MyContext>) => {
  bot.action(PROFILE_BUTTONS.DEMOS.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.reply(
        `${SECTION_EMOJI} Здесь все твои демки`,
        showDemosKeyboard
      );
    } catch (error) {
      handleError(ctx, error, "showDemosMenuAction");
    }
  });
};
