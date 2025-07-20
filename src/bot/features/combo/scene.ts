import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import {
  battleManager,
  battleTimeoutService,
  formatResult,
  simulateBattle,
} from "@core/GameLogic/battle";
import { UserController } from "@controller";
import { handleError, isValidCombo } from "@utils/index";
import { FAME_TO_BATTLE, RACKS_TO_BATTLE } from "@utils/constants";

export const comboScene = new Scenes.BaseScene<MyContext>("combo");

comboScene.enter(async (ctx: MyContext) => {
  try {
    const session = ctx.session as SessionData;
    const battle = battleManager.getBattle(session.battleId!);

    if (!battle) {
      await ctx.reply("❌ Баттл не найден или уже завершен");
      return ctx.scene.leave();
    }

    battleTimeoutService.startComboTimeout(battle!.id, async () => {
      await battle.player1.ctx.reply(
        `❌ Один из игроков не отправил комбо вовремя. Баттл отменен`
      );
      await battle.player2!.ctx.reply(
        `❌ Один из игроков не отправил комбо вовремя. Баттл отменен`
      );

      await battle.player1.ctx.scene.leave();
      await battle.player2!.ctx.scene.leave();
    });

    await ctx.reply(
      [
        "🕸 Введи комбо из 6 команд\n",
        "1. Включить оппу макана",
        "2. Надеть беруши",
        "3. Въебать со спины",
        "4. Резко обернуться",
        "5. Написать донос",
        "6. Улететь в Дубай",
      ].join("\n")
    );
  } catch (error) {
    await handleError(ctx, error, "comboScene.enter");
    return ctx.scene.leave();
  }
});

comboScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message)) {
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");
  }

  const user = ctx.user;
  const session = ctx.session as SessionData;
  const combo = ctx.message.text.trim();

  try {
    if (!isValidCombo(combo)) {
      return await ctx.reply("❌ Введи 6 цифр от 1 до 6 без пробелов");
    }

    const battle = battleManager.setCombo(
      session.battleId!,
      user!.accountId,
      combo
    );

    if (!battle) {
      await ctx.reply("❌ Баттл не найден");
      return ctx.scene.leave();
    }

    const player1 = await UserController.findByAccountId(
      battle.player1.accountId
    );
    const player2 = await UserController.findByAccountId(
      battle.player2!.accountId
    );

    if (battle.status === "resolving_battle") {
      battleTimeoutService.clearComboTimeout(battle.id);

      const result = simulateBattle(
        battle.player1.combo!,
        battle.player2!.combo!
      );

      const results1 = formatResult(result, "player1");
      const results2 = formatResult(result, "player2");

      results1.forEach((line, i) => {
        setTimeout(async () => {
          await battle.player1.ctx.reply(line);
        }, i * 1000);
      });

      results2.forEach((line, i) => {
        setTimeout(async () => {
          await battle.player2!.ctx.reply(line);
        }, i * 1000);
      });

      battleManager.finishBattle(battle.id);
      const delay = Math.max(results1.length, results2.length) * 1500;

      setTimeout(async () => {
        if (result.winner !== "draw") {
          const winner = result.winner === "player1" ? player1 : player2;
          const loser = result.winner === "player1" ? player2 : player1;
          const winnerCtx =
            result.winner === "player1"
              ? battle.player1.ctx
              : battle.player2!.ctx;
          const loserCtx =
            result.winner === "player1"
              ? battle.player2!.ctx
              : battle.player1.ctx;

          await UserController.updateUserInfo(winner!.accountId, {
            racks: winner!.racks + RACKS_TO_BATTLE,
          });
          await UserController.addFame(winner!.accountId, FAME_TO_BATTLE);

          await UserController.updateUserInfo(loser!.accountId, {
            fame: loser!.fame - FAME_TO_BATTLE,
            seasonalFame: loser!.seasonalFame - FAME_TO_BATTLE,
            racks: loser!.racks - RACKS_TO_BATTLE,
          });

          await winnerCtx.reply(
            `✅ Обоссано\n\n🧌 +${FAME_TO_BATTLE} фейма\n🪙 +${RACKS_TO_BATTLE} рэксов`
          );
          await loserCtx.reply(
            `👎🏿 Пасасал\n\n🧌 -${FAME_TO_BATTLE} фейма\n🪙 -${RACKS_TO_BATTLE} рэксов`
          );
        }
      }, delay);

      await battle.player1.ctx.scene.leave();
      await battle.player2!.ctx.scene.leave();
    }
  } catch (error) {
    await handleError(ctx, error, "comboScene.on");
    return ctx.scene.leave();
  }
});

comboScene.leave((ctx) => {
  const session = ctx.session as SessionData;
  delete session.battleId;
});
