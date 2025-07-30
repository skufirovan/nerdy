import { MyContext } from "@bot/features/scenes";
import { Telegraf } from "telegraf";
import { DONATION_BUTTONS } from "../showDonation/keyboard";
import { handleError } from "@utils/index";
import { InvoiceController } from "@controller/index";

export const buyNerdPassAction = (bot: Telegraf<MyContext>) => {
  bot.action(DONATION_BUTTONS.NERD_PASS.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const accountId = ctx.user!.accountId;
      const amount = 12900;
      const product = "NERD PASS";
      const payload = `${product}_${accountId}_${Date.now()}`;

      await ctx.sendInvoice({
        title: product,
        description: "К оплате",
        payload,
        provider_token: process.env.PROVIDER_TOKEN!,
        currency: "RUB",
        prices: [{ label: product, amount }],
      });

      await InvoiceController.createInvoice(
        accountId,
        product,
        amount,
        payload
      );
    } catch (error) {
      handleError(ctx, error, "buyNerdPassAction");
    }
  });
};
