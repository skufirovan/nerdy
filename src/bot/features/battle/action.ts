import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "../scenes";
import { battleManager, battleTimeoutService } from "@core/GameLogic/battle";
import { ACTIVITIES_BUTTONS } from "../showActivities/keyboard";
import { handleError } from "@utils/index";

export const battleActions = (bot: Telegraf<MyContext>) => {
  bot.action(ACTIVITIES_BUTTONS.BATTLE.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.enter("battle");
    } catch (error) {
      await handleError(ctx, error, "battleAction");
    }
  });

  bot.action(/^BATTLE_ACCEPT_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const battleId = ctx.match[1];
      const user = ctx.user!;
      const battle = battleManager.getBattle(battleId);

      if (!battle)
        return await ctx.reply("❌ Баттл не найден или уже завершен");

      const accepted = battleManager.acceptBattle(battleId, {
        accountId: user.accountId,
        username: user.username,
        ctx,
      });

      if (!accepted) return await ctx.reply("❌ Баттл не найден");

      battleTimeoutService.clearInvitationTimeout(battleId);

      const session = ctx.session as SessionData;
      session.battleId = battleId;

      await ctx.deleteMessage();
      await ctx.scene.enter("combo");

      const player1Session = accepted.player1.ctx.session as SessionData;
      player1Session.battleId = battleId;
      await accepted.player1.ctx.scene.enter("combo");
    } catch (error) {
      await handleError(ctx, error, "battleAction_accept");
    }
  });

  bot.action(/^BATTLE_DECLINE_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const battleId = ctx.match[1];
      const battle = battleManager.getBattle(battleId);

      if (!battle)
        return await ctx.answerCbQuery("❌ Баттл не найден или уже завершен");

      await ctx.telegram.sendMessage(
        String(battle.player1.accountId),
        "👎🏿 МС слева дал заднюю.."
      );

      battleManager.cancelBattle(battleId);
      battleTimeoutService.clearInvitationTimeout(battleId);

      await ctx.editMessageText("👎🏿 Ты дал заднюю.. лейм мув..");
    } catch (error) {
      await handleError(ctx, error, "battleAction_decline");
    }
  });
};
