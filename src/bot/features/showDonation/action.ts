import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { MENU_BUTTONS } from "@bot/handlers";
import { handleError } from "@utils/index";

export const showDonationAction = (bot: Telegraf<MyContext>) => {
  bot.action(MENU_BUTTONS.DONAT.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const text = [
        `👨🏿‍🎨 Купи NERD PASS, просто напиши <a href="https://t.me/skufirovann">админу</a>, попроси номер карты и переведи ему деньги\n`,
        `➖ Ты спрашиваешь "Нахуя?", ниггер, ты че ахуел, купи NERD PASS, сука\n`,
        `1. Свой лейбл`,
        `2. Халявная оборудка`,
        `3. Чаще записывай демки и снимай тт и получай больше фейма`,
        `4. Скидка на оборудку в шопе\n`,
        `🧖🏿 И это всего лишь за <b>99р</b>, закупай пока цены не взлетели`,
      ].join("\n");

      await ctx.reply(text, {
        parse_mode: "HTML",
        link_preview_options: {
          is_disabled: true,
        },
      });
    } catch (error) {
      handleError(ctx, error, "showDonationAction");
    }
  });
};
