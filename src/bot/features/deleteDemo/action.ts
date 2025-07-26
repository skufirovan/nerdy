import { Markup, Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { DemoController } from "@controller";
import { DEMOS_BUTTONS } from "../showDemos/keyboard";
import { handleError, hasCaption } from "@utils/index";

function extractDemoNameFromCaption(caption: string): string | null {
  const match = caption.match(/🎤 (.+?)(?=\n|$)/);
  return match ? match[1] : null;
}

export const deleteDemoAction = (bot: Telegraf<MyContext>) => {
  bot.action(DEMOS_BUTTONS.DELETE_DEMO.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const message = ctx.update.callback_query.message;
      const caption = hasCaption(message) ? message.caption : undefined;

      if (!caption) return await ctx.reply("❌ Не удалось определить демку");

      const demoName = extractDemoNameFromCaption(caption);
      if (!demoName) return await ctx.reply("❌ Название демки не найдено");

      return await ctx.reply(`🗑️ Удалить демку <b>${demoName}</b>?`, {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          Markup.button.callback("✅ Да", `CONFIRM_DELETE_DEMO_${demoName}`),
          Markup.button.callback("❌ Нет", "DELETE_MESSAGE"),
        ]).reply_markup,
      });
    } catch (error) {
      await handleError(ctx, error, "deleteDemoAction");
    }
  });

  bot.action(/^CONFIRM_DELETE_DEMO_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const demoName = ctx.match[1];
      const accountId = ctx.user!.accountId;

      await DemoController.delete(accountId, demoName);

      return await ctx.reply(`🙎🏿‍♂️ Демка <b>${demoName}</b> удалена`, {
        parse_mode: "HTML",
      });
    } catch (error) {
      await handleError(ctx, error, "deleteDemoAction_confirm");
    }
  });
};
