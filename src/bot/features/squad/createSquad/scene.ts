import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "@bot/features/scenes";
import { SquadController } from "@controller";
import { ValidationError, validate, handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const createSquadScene = new Scenes.BaseScene<MyContext>("createSquad");

createSquadScene.enter(async (ctx: MyContext) => {
  await ctx.reply("👨🏿‍🏫 Введи название объединения");
});

createSquadScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message))
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");

  const accountId = ctx.user!.accountId;
  const name = ctx.message.text.trim();
  const validation = validate(name);

  if (!validation.isValid) {
    const errorMessages: Record<ValidationError, string> = {
      TOO_SHORT: "В названии должно быть минимум 3 символа",
      TOO_LONG: "В названии должно быть максимум 40 символов",
      INVALID_CHARS: "Можно использовать только буквы, цифры и _-.,!?",
    };

    return await ctx.reply(
      `⚠️ ${errorMessages[validation.error!]}\n➖ Давай заново`
    );
  }

  try {
    const existed = await SquadController.findSquadByName(accountId, name);

    if (existed) {
      return await ctx.reply(
        `❌ Оппы были быстрее и заняли это название, попробуй другой вариант`
      );
    }

    await SquadController.createSquad(accountId, name);

    await ctx.reply(
      `${SECTION_EMOJI} Объединение создано, теперь ты можешь наебывать на роялти`
    );
    return ctx.scene.leave();
  } catch (error) {
    await handleError(ctx, error, "createSquadScene.on");
    return ctx.scene.leave();
  }
});
