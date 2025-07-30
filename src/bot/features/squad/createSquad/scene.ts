import { Scenes } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { SquadController } from "@controller/index";
import { ValidationError, validate, handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const createSquadScene = new Scenes.BaseScene<MyContext>("createSquad");

createSquadScene.enter(async (ctx: MyContext) => {
  await ctx.reply("👨🏿‍🏫 Введи название объединения");
});

createSquadScene.on("message", async (ctx: MyContext) => {
  const accountId = ctx.user!.accountId;

  try {
    const session = ctx.session as SessionData;
    const message = ctx.message;

    if (message && "text" in message && !session.createSquad?.name) {
      const name = message.text.trim();
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

      const existed = await SquadController.findSquadByName(accountId, name);
      if (existed) {
        return await ctx.reply(
          `❌ Оппы были быстрее и заняли это название, попробуй другой вариант`
        );
      }

      session.createSquad = { name };
      await ctx.reply(`🦸🏿 Название выбрано, теперь отправь фото лейбла`);
    }

    if (message && "photo" in message && session.createSquad?.name) {
      const squadName = session.createSquad.name;
      const photo = message.photo.at(-1);
      const fileId = photo!.file_id;
      const fileLink = await ctx.telegram.getFileLink(photo!.file_id);

      if (!fileLink.href.startsWith("http")) {
        throw new Error(`Невалидная ссылка на фото ${fileLink.href}`);
      }

      await SquadController.createSquad(
        accountId,
        squadName,
        fileId,
        fileLink.href
      );

      await ctx.reply(
        `${SECTION_EMOJI} Объединение создано, теперь ты можешь наебывать на роялти`
      );
      delete session.createSquad;
      return ctx.scene.leave();
    }
  } catch (error) {
    await handleError(ctx, error, "createSquadScene.on");
    return ctx.scene.leave();
  }
});
