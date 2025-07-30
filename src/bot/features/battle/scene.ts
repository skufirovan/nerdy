import path from "path";
import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import { UserController } from "@controller/index";
import { battleManager, battleTimeoutService } from "@core/GameLogic/battle";
import { getRandomImage, requireUser, handleError } from "@utils/index";
import {
  SECTION_EMOJI,
  FAME_TO_BATTLE,
  RACKS_TO_BATTLE,
} from "@utils/constants";

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

    const imagePath = await getRandomImage(
      path.resolve(__dirname, `../../assets/images/BATTLE`),
      path.resolve(__dirname, `../../assets/images/BATTLE/1.jpg`)
    );
    await ctx.replyWithPhoto(
      { source: imagePath },
      {
        caption: `${SECTION_EMOJI} МС справа — <b>${user.nickname}</b>, введи ник МС слева\n\nПобедитель получает 500 фейма и 300 рексов проигравшего`,
        parse_mode: "HTML",
      }
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
      return ctx.scene.leave();
    }

    if (user2.seasonalFame < FAME_TO_BATTLE || user2.racks < RACKS_TO_BATTLE) {
      await ctx.reply(`❌ <b>${user2.nickname}</b> слишком лейм..`, {
        parse_mode: "HTML",
      });
      return ctx.scene.leave();
    }

    if (battleManager.getBattleByPlayer(user2.accountId)) {
      await ctx.reply("❌ <b>${user2.nickname}</b> уже баттлится");
      return ctx.scene.leave();
    }

    if (user2.accountId === user!.accountId) {
      await ctx.reply("❌ Ты не можешь вызвать сам себя");
      return ctx.scene.leave();
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
