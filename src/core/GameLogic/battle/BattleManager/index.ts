import { MyContext } from "@bot/features/scenes";

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

    return battle;
  }

  acceptBattle(id: string, player2: Player): Battle | undefined {
    const battle = this.battles.get(id);
    if (!battle || battle.player2) return;

    battle.player2 = player2;
    battle.status = "preparing_combos";

    return battle;
  }

  cancelBattle(id: string) {
    const battle = this.battles.get(id);
    if (!battle) return;

    battle.status = "canceled";
    this.battles.delete(id);
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

    return battle;
  }

  finishBattle(id: string) {
    const battle = this.battles.get(id);
    if (!battle) return;

    battle.status = "finished";
    this.battles.delete(id);
  }

  getBattle(id: string): Battle | undefined {
    return this.battles.get(id);
  }

  deleteBattle(id: string) {
    this.battles.delete(id);
  }
}

export const battleManager = new BattleManager();
