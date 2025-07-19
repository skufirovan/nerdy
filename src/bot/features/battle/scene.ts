import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import { UserController } from "@controller";
import { battleManager, battleTimeoutService } from "@core/GameLogic/battle";
import { requireUser, handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const battleScene = new Scenes.BaseScene<MyContext>("battle");

battleScene.enter(async (ctx: MyContext) => {
  try {
    const user = await requireUser(ctx);

    if (!user) return ctx.scene.leave();

    const session = ctx.session as SessionData;

    if (session.battleId) {
      await ctx.reply(`${SECTION_EMOJI} Ты уже баттлишься`);
      return ctx.scene.leave();
    }

    await ctx.reply(
      `${SECTION_EMOJI} МС справа — ${user.nickname}, введи ник МС слева`
    );
  } catch (error) {
    await handleError(ctx, error, "battleScene.enter");
    return ctx.scene.leave();
  }
});

battleScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message))
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");

  const accountId = ctx.user!.accountId;
  const nickname = ctx.message.text.trim();

  try {
    const user = await UserController.findByAccountId(accountId);
    const user2 = await UserController.findByNickname(accountId, nickname);

    if (!user2) {
      await ctx.reply("❌ МС с таким ником не найден");
      return await ctx.scene.leave();
    }

    if (user2.accountId === user!.accountId) {
      await ctx.reply("❌ Ты не можешь вызвать сам себя");
      return await ctx.scene.leave();
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

    await ctx.reply(`🤜🏿 МС ${user2.nickname} получил приглашение..`);
    return ctx.scene.leave();
  } catch (error) {
    await handleError(ctx, error, "battleScene.on");
    return ctx.scene.leave();
  }
});
