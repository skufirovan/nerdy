import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import { mainKeyboard } from "@bot/handlers/handleStart/keyboard";
import { UserController } from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { NicknameError, validateNickname } from "@utils/index";

const chooseNicknameScene = new Scenes.BaseScene<MyContext>("chooseNickname");

chooseNicknameScene.enter(async (ctx: MyContext) => {
  await ctx.reply(
    "👨🏿‍🏫 Введи свой никнейм. У тебя только 1 попытка\n➖ Поспешишь – оппов насмешишь, подойди к этому с умом"
  );
});

chooseNicknameScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message)) {
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");
  }

  const nickname = ctx.message.text.trim();
  const session = ctx.session as SessionData;

  const validation = validateNickname(nickname);
  if (!validation.isValid) {
    const errorMessages: Record<NicknameError, string> = {
      TOO_SHORT: "Ник короткий, прям как твой..",
      TOO_LONG: "Ник слишком длинный (максимум 40 символов)",
      INVALID_CHARS: "Можно использовать только буквы, цифры и _-.,!?",
    };

    return await ctx.reply(
      `⚠️ ${errorMessages[validation.error!]}\n➖ Давай заново`
    );
  }

  try {
    const existedUser = await UserController.findByNickname(
      ctx.user!.accountId,
      nickname
    );

    if (existedUser) {
      return await ctx.reply(
        `❌ Оппы были быстрее и заняли этот ник, попробуй другой вариант`
      );
    }

    session.nickname = nickname;

    await ctx.reply(`☁️ Теперь в ск на одного игрока больше`, mainKeyboard);
    return ctx.scene.leave();
  } catch (error) {
    userActionsLogger(
      "error",
      "chooseNicknameScene",
      `${(error as Error).message}`,
      { accountId: ctx.user!.accountId }
    );
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
  }
});

export default chooseNicknameScene;
