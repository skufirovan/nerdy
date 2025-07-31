import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { InvoiceController, UserController } from "@controller/index";
import { handleError } from "@utils/index";
import { handlePurchase } from "../donation/handlePurchase";

export function paymentEvents(bot: Telegraf<MyContext>) {
  bot.on("pre_checkout_query", async (ctx) => {
    try {
      const { id, invoice_payload } = ctx.preCheckoutQuery;

      await ctx.telegram.answerPreCheckoutQuery(id, true);
    } catch (error) {
      handleError(ctx, error, "pre_checkout_query");
    }
  });

  bot.on("message", async (ctx) => {
    try {
      if ("successful_payment" in ctx.message) {
        const successful_payment = ctx.message.successful_payment;
        const { total_amount, invoice_payload, telegram_payment_charge_id } =
          successful_payment;

        const accountId = BigInt(invoice_payload.split("_")[1]);
        const product = invoice_payload.split("_")[0];

        const invoice = await InvoiceController.findInvoiceByPayload(
          accountId,
          invoice_payload
        );

        await handlePurchase(accountId, product);

        await InvoiceController.createPayment(
          accountId,
          telegram_payment_charge_id,
          invoice!.id,
          total_amount
        );
      }
    } catch (error) {
      handleError(ctx, error, "succesful_payment");
    }
  });
}
