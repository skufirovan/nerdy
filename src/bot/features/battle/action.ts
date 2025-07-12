import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "../scenes";
import { ACTIVITIES_BUTTONS } from "../showActivities/keyboard";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { battleManager, battleTimeoutService } from "@core/GameLogic/battle";

export const battleActions = (bot: Telegraf<MyContext>) => {
  bot.action(ACTIVITIES_BUTTONS.BATTLE.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.enter("battle");
    } catch (error) {
      userActionsLogger(
        "error",
        "battleAction",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
    }
  });

  bot.action(/^BATTLE_ACCEPT_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const battleId = ctx.match[1];
      const user = ctx.user!;
      const battle = battleManager.getBattle(battleId);

      if (!battle) {
        return await ctx.reply("❌ Баттл не найден или уже завершен");
      }

      const acceptedBattle = battleManager.acceptBattle(battleId, {
        accountId: user.accountId,
        username: user.username,
        ctx,
      });

      if (!acceptedBattle) {
        return await ctx.reply("❌ Баттл не найден");
      }

      battleTimeoutService.clearInvitationTimeout(battleId);
      (ctx.session as SessionData).battleId = battleId;

      await ctx.scene.enter("combo");
      await acceptedBattle.player1.ctx.scene.enter("combo");
    } catch (error) {
      userActionsLogger(
        "error",
        "battleAction_ACCEPT",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
    }
  });

  bot.action(/^BATTLE_DECLINE_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const battleId = ctx.match[1];
      const battle = battleManager.getBattle(battleId);

      if (!battle) {
        return await ctx.answerCbQuery("❌ Баттл не найден или уже завершен");
      }

      await ctx.telegram.sendMessage(
        String(battle.player1.accountId),
        "👎🏿 МС слева дал заднюю.."
      );

      battleManager.cancelBattle(battleId);
      battleTimeoutService.clearInvitationTimeout(battleId);

      await ctx.reply("👎🏿 Ты дал заднюю.. лейм мув..");
    } catch (error) {
      userActionsLogger(
        "error",
        "battleAction_DECLINE",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
    }
  });
};
