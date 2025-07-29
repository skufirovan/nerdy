import { Telegraf } from "telegraf";
import { MyContext } from "../../scenes";
import { shopButtons } from "./keyboard";
import { MENU_BUTTONS } from "@bot/handlers";
import { handleError, requireUser } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const showShopMenuAction = (bot: Telegraf<MyContext>) => {
  bot.action(MENU_BUTTONS.SHOP.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const user = await requireUser(ctx);
      if (!user) return;

      await ctx.reply(
        `${SECTION_EMOJI} Уходи в рэп, уходи в музыку, тебе музыку надо писать. Ищи, покупай звуковую карту, микрофон, наушники, давай быстрее. Давай биты пиши, давай пора дропаться на площадки\n\n🪙 Баланс: ${user.racks}`,
        { reply_markup: shopButtons.reply_markup }
      );
    } catch (error) {
      await handleError(ctx, error, "showShopAction");
    }
  });
};
