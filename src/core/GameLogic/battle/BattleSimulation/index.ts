type Action = 1 | 2 | 3 | 4;

type RoundLog = {
  round: number;
  move: Action;
  damage: number;
};

const damageTable: Record<string, number> = {
  "1-1": 10,
  "1-2": 10,
  "1-3": -10,
  "1-4": 10,

  "2-1": 8,
  "2-2": 8,
  "2-3": 8,
  "2-4": -8,

  "3-1": 10,
  "3-2": 0,
  "3-3": 0,
  "3-4": 0,

  "4-1": 0,
  "4-2": 8,
  "4-3": 0,
  "4-4": 0,
};

export type BattleResult = {
  rounds: {
    player1: RoundLog;
    player2: RoundLog;
  }[];
  player1Score: number;
  player2Score: number;
  winner: "player1" | "player2" | "draw";
};

export function simulateBattle(combo1: string, combo2: string): BattleResult {
  const actions1 = combo1.split("").map((c) => Number(c) as Action);
  const actions2 = combo2.split("").map((c) => Number(c) as Action);

  const rounds: BattleResult["rounds"] = [];
  let score1 = 0;
  let score2 = 0;

  for (let i = 0; i < 4; i++) {
    const a1 = actions1[i];
    const a2 = actions2[i];

    const key1 = `${a1}-${a2}`;
    const key2 = `${a2}-${a1}`;

    const d1 = damageTable[key1] ?? 0;
    const d2 = damageTable[key2] ?? 0;

    score1 += d1;
    score2 += d2;

    rounds.push({
      player1: {
        round: i + 1,
        move: a1,
        damage: d1,
      },
      player2: {
        round: i + 1,
        move: a2,
        damage: d2,
      },
    });
  }

  let winner: "player1" | "player2" | "draw" = "draw";
  if (score1 > score2) winner = "player1";
  else if (score2 > score1) winner = "player2";

  return {
    rounds,
    player1Score: score1,
    player2Score: score2,
    winner,
  };
}

const commandMap: Record<Action, string> = {
  1: "включил оппу макана",
  2: "въебал со спины",
  3: "надел беруши",
  4: "резко обернулся",
};

const outcomeMap: Record<string, string> = {
  "1-1": "Почему так качает? Это макан",
  "1-2": "Вот и думай, кому хуже..",
  "1-3": "Как открытую книгу прочитали",
  "1-4": "Он явно что-то знал",

  "2-1": "Вот и думай, кому хуже..",
  "2-2": "Встретлись как-то два фаната облы",
  "2-3": "Ёбнул оппу, он был в биркенштоках",
  "2-4": "Бро, подучись у облы как это делается",

  "3-1": "С такой удачой надо депать срочно",
  "3-2": "Зря, а мог ведь услышать",
  "3-3": "Макана тут нет",
  "3-4": "Допустим..",

  "4-1": "Чтоб лучше расслышать",
  "4-2": "Обла больше не страшен",
  "4-3": "Допустим..",
  "4-4": "Пососитесь теперь епта",
};

export function formatResult(
  result: BattleResult,
  player: "player1" | "player2"
): string[] {
  const lines: string[] = ["📊 Результаты баттла"];
  const opponent = player === "player1" ? "player2" : "player1";

  for (let i = 0; i < result.rounds.length; i++) {
    const { [player]: self, [opponent]: enemy } = result.rounds[i];
    const key = `${self.move}-${enemy.move}`;

    lines.push(
      [
        `Раунд ${i + 1}:`,
        `Ты ${commandMap[self.move]}, оппонент — ${commandMap[enemy.move]}\n`,
        `📯 ${self.damage} | ${enemy.damage}`,
        `💬 ${outcomeMap[key]}`,
      ].join("\n")
    );
  }

  const scoreLine = `🏁 Счёт: ${result.player1Score} : ${result.player2Score}`;
  const verdict =
    result.winner === "draw"
      ? "👨‍❤️‍💋‍👨 Ничья"
      : result.winner === player
      ? "🏆 Ты победил"
      : "🫵🏿 Ты проиграл";

  lines.push(`${scoreLine}\n${verdict}`);

  return lines;
}
