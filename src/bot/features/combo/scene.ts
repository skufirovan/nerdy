import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import {
  battleManager,
  battleTimeoutService,
  formatResult,
  simulateBattle,
} from "@core/GameLogic/battle";
import { handleError, isValidCombo } from "@utils/index";

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
      return ctx.scene.leave();
    });

    await ctx.reply(
      [
        "🕸 Введи комбо из 4 команд\n",
        "1. Включить оппу макана",
        "2. Въебать со спины",
        "3. Надеть беруши",
        "4. Резко обернуться",
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
      return await ctx.reply("❌ Введи 4 цифры от 1 до 4 без пробелов");
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
