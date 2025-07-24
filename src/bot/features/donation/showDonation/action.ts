import { Telegraf } from "telegraf";
import { MyContext } from "../../scenes";
import { MENU_BUTTONS } from "@bot/handlers";
import { handleError } from "@utils/index";
import { donationKeyboard } from "./keyboard";

export const showDonationAction = (bot: Telegraf<MyContext>) => {
  bot.action(MENU_BUTTONS.DONAT.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const text = [
        `👨🏿‍🎨 NERD PASS - это игровой пропуск, который дает преимущества, такие как:\n`,
        `1. Свой лейбл`,
        `2. Халявная оборудка`,
        `3. Чаще записывай демки и снимай тт и получай больше фейма`,
        `4. Скидка на оборудку в шопе\n`,
        `🧖🏿 И это всего лишь за <b>129</b> ₽`,
      ].join("\n");

      await ctx.reply(text, {
        parse_mode: "HTML",
        link_preview_options: {
          is_disabled: true,
        },
        reply_markup: donationKeyboard.reply_markup,
      });
    } catch (error) {
      handleError(ctx, error, "showDonationAction");
    }
  });
};
