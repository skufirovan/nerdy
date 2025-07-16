import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import { UserController } from "@controller";
import { battleManager, battleTimeoutService } from "@core/GameLogic/battle";
import { UserDto } from "@domain/dtos";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const battleScene = new Scenes.BaseScene<MyContext>("battle");

battleScene.enter(async (ctx: MyContext) => {
  if ((ctx.session as SessionData).battleId) {
    await ctx.reply(`👨🏻‍🦲 Ты уже баттлишься`);
    return ctx.scene.leave();
  }
  const user = ctx.user as UserDto;
  await ctx.reply(`👨🏻‍🦲 МС справа — ${user.nickname}, введи ник МС слева`);
});

battleScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message)) {
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");
  }
  const player2Nickname = ctx.message.text.trim();

  try {
    const user = await UserController.findByAccountId(ctx.user!.accountId);
    const user2 = await UserController.findByNickname(
      user!.accountId,
      player2Nickname
    );

    if (!user2) {
      await ctx.reply("❌ МС с таким ником не найден");
      return await ctx.scene.leave();
    }
    if (user2.accountId === user!.accountId) {
      return await ctx.reply("❌ Ты не можешь вызвать сам себя");
    }

    const battle = battleManager.createBattle({
      accountId: user!.accountId,
      username: user!.username,
      ctx,
    });
    battleTimeoutService.startInvitationTimeout(battle.id, async () => {
      await ctx.reply("⏰ МС слева слоупок..");
      return ctx.scene.leave();
    });
    (ctx.session as SessionData).battleId = battle.id;

    await ctx.telegram.sendMessage(
      String(user2.accountId),
      `🎤 МС ${user!.nickname} поставил твою чоткость под сомнение`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "❌Слиться",
                callback_data: `BATTLE_DECLINE_${battle.id}`,
              },
              {
                text: "🔥Выскочить",
                callback_data: `BATTLE_ACCEPT_${battle.id}`,
              },
            ],
          ],
        },
      }
    );
    await ctx.reply(`✅ МС ${user2.nickname} получил приглашение..`);
  } catch (error) {
    userActionsLogger(
      "error",
      "battleScene",
      `Ошибка при вызове на баттл игрока ${player2Nickname}: ${
        (error as Error).message
      }`,
      { accountId: ctx.user!.accountId }
    );
    return await ctx.reply(
      "🚫 Произошла ошибка при созданни баттла. Попробуй еще раз"
    );
  }

  await ctx.scene.leave();
});
