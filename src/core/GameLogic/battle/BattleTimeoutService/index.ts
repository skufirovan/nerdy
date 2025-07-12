import { battleManager } from "../BattleManager";

type TimeoutMap = Map<string, NodeJS.Timeout>;

class BattleTimeoutService {
  private invitationTimeouts: TimeoutMap = new Map();
  private comboTimeouts: TimeoutMap = new Map();

  startInvitationTimeout(
    battleId: string,
    onTimeout: (battleId: string) => void,
    delay = 60000
  ) {
    this.clearInvitationTimeout(battleId);

    const timeout = setTimeout(() => {
      const battle = battleManager.getBattle(battleId);
      if (battle && battle.status === "waiting_opponent") {
        battle.status = "timeout_opponent";
        battleManager.deleteBattle(battleId);
        onTimeout(battleId);
      }
    }, delay);

    this.invitationTimeouts.set(battleId, timeout);
  }

  startComboTimeout(
    battleId: string,
    onTimeout: (battleId: string) => void,
    delay = 30000
  ) {
    this.clearComboTimeout(battleId);

    const timeout = setTimeout(() => {
      const battle = battleManager.getBattle(battleId);
      if (
        battle &&
        battle.status === "preparing_combos" &&
        (!battle.player1.combo || !battle.player2?.combo)
      ) {
        battle.status = "timeout_combos";
        battleManager.deleteBattle(battleId);
        onTimeout(battleId);
      }
    }, delay);

    this.comboTimeouts.set(battleId, timeout);
  }

  clearInvitationTimeout(battleId: string) {
    const timeout = this.invitationTimeouts.get(battleId);
    if (timeout) {
      clearTimeout(timeout);
      this.invitationTimeouts.delete(battleId);
    }
  }

  clearComboTimeout(battleId: string) {
    const timeout = this.comboTimeouts.get(battleId);
    if (timeout) {
      clearTimeout(timeout);
      this.comboTimeouts.delete(battleId);
    }
  }

  clearAll(battleId: string) {
    this.clearInvitationTimeout(battleId);
    this.clearComboTimeout(battleId);
  }
}

export const battleTimeoutService = new BattleTimeoutService();
