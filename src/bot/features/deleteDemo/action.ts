import { Markup, Telegraf } from "telegraf";
import DemoController from "@controller/DemoController";
import { MyContext } from "../scenes";
import { DEMOS_BUTTONS } from "@bot/markup/buttons";
import { hasCaption } from "@utils/index";

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

      if (!caption) return ctx.reply("❌ Не удалось определить демку");

      const demoName = extractDemoNameFromCaption(caption);
      if (!demoName) return ctx.reply("❌ Название демки не найдено");

      await ctx.reply(`🗑️ Удалить демку <b>${demoName}</b>?`, {
        reply_markup: Markup.inlineKeyboard([
          Markup.button.callback("✅ Да", `CONFIRM_DELETE:${demoName}`),
          Markup.button.callback("❌ Нет", `CANCEL_DELETE`),
        ]).reply_markup,
        parse_mode: "HTML",
      });
    } catch (error) {
      console.error(error);
    }
  });

  bot.action(/^CONFIRM_DELETE:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    const demoName = ctx.match[1];
    const accountId = ctx.user!.accountId;

    try {
      await DemoController.delete(accountId, demoName);
      await ctx.reply(`✅ Демка <b>${demoName}</b> удалена`, {
        parse_mode: "HTML",
      });
    } catch (err) {
      console.error(err);
      await ctx.reply("🚫 Ошибка при удалении демки");
    }
  });

  bot.action("CANCEL_DELETE", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply("❌ Демка жива (пока что)");
  });
};
