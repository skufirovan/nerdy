import { MyContext } from "@bot/features/scenes";
import { serviceLogger } from "@infrastructure/logger";

export type Player = {
  accountId: bigint;
  username: string | null;
  combo?: string;
  ctx: MyContext;
};

export type BattleStatus =
  | "waiting_opponent"
  | "preparing_combos"
  | "resolving_battle"
  | "timeout_opponent"
  | "timeout_combos"
  | "canceled"
  | "finished";

export type Battle = {
  id: string;
  status: BattleStatus;
  player1: Player;
  player2?: Player;
  createdAt: number;
};

class BattleManager {
  private battles = new Map<string, Battle>();

  createBattle(player1: Player): Battle {
    const id = `${player1.accountId.toString()}_${Date.now()}`;
    const battle: Battle = {
      id,
      status: "waiting_opponent",
      player1,
      createdAt: Date.now(),
    };
    this.battles.set(id, battle);

    serviceLogger(
      "info",
      "BattleManager.createBattle",
      `${battle?.id} - ${battle?.player1.username}`
    );

    return battle;
  }

  acceptBattle(id: string, player2: Player): Battle | undefined {
    const battle = this.battles.get(id);
    if (!battle || battle.player2) return;

    battle.player2 = player2;
    battle.status = "preparing_combos";

    serviceLogger(
      "info",
      "BattleManager.acceptBattle",
      `${battle?.id} - ${battle?.player1.username} VS ${battle?.player2?.username}`
    );

    return battle;
  }

  cancelBattle(id: string) {
    const battle = this.battles.get(id);
    if (!battle) return;

    battle.status = "canceled";
    this.battles.delete(id);

    serviceLogger(
      "info",
      "BattleManager.cancelBattle",
      `${battle?.id} - ${battle?.player1.username} VS ${battle?.player2?.username}`
    );
  }

  setCombo(id: string, accountId: bigint, combo: string): Battle | null {
    const battle = this.battles.get(id);
    if (!battle) return null;

    if (battle.player1.accountId === accountId) {
      battle.player1.combo = combo;
    } else if (battle.player2?.accountId === accountId) {
      battle.player2.combo = combo;
    }

    if (battle.player1.combo && battle.player2?.combo) {
      battle.status = "resolving_battle";
    }

    serviceLogger(
      "info",
      "BattleManager.setCombo",
      `${battle?.id} - ${battle?.player1.username} VS ${battle?.player2?.username}`
    );

    return battle;
  }

  finishBattle(id: string) {
    const battle = this.battles.get(id);
    if (!battle) return;

    battle.status = "finished";
    this.battles.delete(id);

    serviceLogger(
      "info",
      "BattleManager.finishBattle",
      `${battle?.id} - ${battle?.player1.username} VS ${battle?.player2?.username}`
    );
  }

  getBattle(id: string): Battle | undefined {
    const battle = this.battles.get(id);

    serviceLogger(
      "info",
      "BattleManager.getBattle",
      `${battle?.id} - ${battle?.player1.username} VS ${battle?.player2?.username}`
    );
    return battle;
  }

  getBattleByPlayer(accountId: bigint): Battle | undefined {
    for (const [, battle] of this.battles) {
      if (
        battle.player1.accountId === accountId ||
        (battle.player2 && battle.player2.accountId === accountId)
      ) {
        return battle;
      }
    }
    return undefined;
  }

  deleteBattle(id: string) {
    const battle = this.battles.get(id);

    serviceLogger(
      "info",
      "BattleManager.getBattle",
      `${battle?.id} - ${battle?.player1.username} VS ${battle?.player2?.username}`
    );

    this.battles.delete(id);
  }
}

export const battleManager = new BattleManager();
