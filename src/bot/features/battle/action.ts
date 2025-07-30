import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "../scenes";
import { battleManager, battleTimeoutService } from "@core/GameLogic/battle";
import { UserController } from "@controller/index";
import { ACTIVITIES_BUTTONS } from "../showActivities/keyboard";
import { handleError } from "@utils/index";
import { FAME_TO_BATTLE, RACKS_TO_BATTLE } from "@utils/constants";

export const battleActions = (bot: Telegraf<MyContext>) => {
  bot.action(ACTIVITIES_BUTTONS.BATTLE.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const user = await UserController.findByAccountId(ctx.user!.accountId);
      if (
        !user ||
        user.seasonalFame < FAME_TO_BATTLE ||
        user.racks < RACKS_TO_BATTLE
      )
        return ctx.reply(
          "🤚🏿 Для участия в баттле нужно 500 фейма и 300 рексов"
        );

      await ctx.scene.enter("battle");
    } catch (error) {
      await handleError(ctx, error, "battleAction");
    }
  });

  bot.action(/^BATTLE_ACCEPT_(.+)$/, async (ctx) => {
    try {
      const battleId = ctx.match[1];
      const user = ctx.user!;
      const battle = battleManager.getBattle(battleId);

      if (!battle)
        return await ctx.answerCbQuery("❌ Баттл не найден или уже завершен");

      if (battleManager.getBattleByPlayer(user.accountId))
        return await ctx.answerCbQuery("❌ Ты уже баттлишься");

      const accepted = battleManager.acceptBattle(battleId, {
        accountId: user.accountId,
        username: user.username,
        ctx,
      });

      if (!accepted) return await ctx.answerCbQuery("❌ Баттл не найден");

      await ctx.answerCbQuery();
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
      const battleId = ctx.match[1];
      const battle = battleManager.getBattle(battleId);

      if (!battle)
        return await ctx.answerCbQuery("❌ Баттл не найден или уже завершен");

      await ctx.answerCbQuery();

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
