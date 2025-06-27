import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "@bot/scenes";
import { keyboards } from "@bot/markup/keyboards";
import UserController from "@controller/UserController";
import { validateNickname } from "@utils/index";

const chooseNicknameScene = new Scenes.BaseScene<MyContext>("chooseNickname");

chooseNicknameScene.enter((ctx: MyContext) => {
  ctx.reply(
    "👨🏿‍🏫 Введи свой никнейм. У тебя только 1 попытка\n➖ Поспешишь – оппов насмешишь, подойди к этому с умом"
  );
});

chooseNicknameScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message)) {
    await ctx.reply("⚠️  Пожалуйста, введите текст.");
    return;
  }
    
  const nickname = ctx.message.text.trim();
  const session = ctx.session as SessionData;

  const validation = validateNickname(nickname);
  if (!validation.isValid) {
    const errorMessages = {
      TOO_SHORT: "Ник короткий, прям как твой..",
      TOO_LONG: "Ник слишком длинный (максимум 40 символов)",
      CONTAINS_AT: "Никнейм не должен содержать символ @",
      EMOJI: "Никнейм не может содержать эмодзи",
      INVALID_CHARS: "Можно использовать только буквы, цифры и _-.,!?",
    };

    await ctx.reply(`⚠️ ${errorMessages[validation.error!]}\n➖ Давай заново`);
    return;
  }

  try {
    const existedUser = await UserController.getByNickname(nickname);

    if (existedUser) {
      await ctx.reply(
        `❌ Оппы были быстрее и заняли этот ник, попробуй другой вариант`
      );
      return;
    }

    session.nickname = nickname;

    await ctx.reply(`☁️ Теперь в ск на одного игрока больше`, keyboards.main);
    return ctx.scene.leave();
  } catch (error) {}
});

export default chooseNicknameScene;
