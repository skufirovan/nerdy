import { Markup, Telegraf } from "telegraf";
import { MyContext } from "../../scenes";
import { DemoController } from "@controller";
import { DELETE_DEMO_BUTTON } from "./keyboard";
import { extractDemoNameFromCaption } from "../utils";
import { handleError, hasCaption } from "@utils/index";

export const deleteDemoAction = (bot: Telegraf<MyContext>) => {
  bot.action(DELETE_DEMO_BUTTON.DELETE_DEMO.callback, async (ctx) => {
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
