import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { UserController } from "@controller";
import { MENU_BUTTONS } from "@bot/handlers";
import { TOP_BUTTONS, topKeyboard } from "./keyboard";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const showTopAction = (bot: Telegraf<MyContext>) => {
  bot.action(MENU_BUTTONS.TOP.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const seasonTop = await UserController.findTopUsersByField(
        ctx.user!.accountId,
        "seasonalFame"
      );

      const text = seasonTop
        .map(
          (u) =>
            `☁️ [${u.nickname}](https://t.me/${u.username}) ${u.level} lvl — ${u.seasonalFame} Fame`
        )
        .join("\n");

      await ctx.reply(
        `${SECTION_EMOJI} Ну-ка, кто тут метит на вершину айсберга..\n\n${text}`,
        {
          parse_mode: "Markdown",
          link_preview_options: {
            is_disabled: true,
          },
          reply_markup: topKeyboard.reply_markup,
        }
      );
    } catch (error) {
      await handleError(ctx, error, "showTopAction");
    }
  });

  bot.action(TOP_BUTTONS.ALL_TIME_TOP.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const allTimeTop = await UserController.findTopUsersByField(
        ctx.user!.accountId,
        "fame"
      );

      const text = allTimeTop
        .map(
          (u) =>
            `☁️ [${u.nickname}](https://t.me/${u.username}) ${u.level} lvl — ${u.fame} Fame`
        )
        .join("\n");

      await ctx.reply(
        `${SECTION_EMOJI} Это даже не вершина айсберга, это уже..\n\n${text}`,
        {
          parse_mode: "Markdown",
          link_preview_options: {
            is_disabled: true,
          },
        }
      );
    } catch (error) {
      await handleError(ctx, error, "showTopAction_allTime");
    }
  });
};
