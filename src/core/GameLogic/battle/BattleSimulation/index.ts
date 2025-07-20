type Action = 1 | 2 | 3 | 4 | 5 | 6;

type RoundLog = {
  round: number;
  move: Action;
  damage: number;
};

const damageTable: Record<string, number> = {
  "1-1": 10,
  "1-2": -10,
  "1-3": 10,
  "1-4": 10,
  "1-5": 10,
  "1-6": 10,

  "2-1": 10,
  "2-2": 0,
  "2-3": 0,
  "2-4": 0,
  "2-5": 0,
  "2-6": 0,

  "3-1": 10,
  "3-2": 10,
  "3-3": 10,
  "3-4": -10,
  "3-5": 10,
  "3-6": 10,

  "4-1": 0,
  "4-2": 0,
  "4-3": 10,
  "4-4": 0,
  "4-5": 0,
  "4-6": 0,

  "5-1": 10,
  "5-2": 10,
  "5-3": 10,
  "5-4": 10,
  "5-5": 10,
  "5-6": -10,

  "6-1": 0,
  "6-2": 0,
  "6-3": 0,
  "6-4": 0,
  "6-5": 10,
  "6-6": 0,
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

  for (let i = 0; i < 6; i++) {
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
  2: "надел беруши",
  3: "въебал со спины",
  4: "резко обернулся",
  5: "донес Мизулиной",
  6: "улетел в Дубай",
};

const outcomeMap: Record<string, string> = {
  "1-1": "Почему так качает? Ааа ето макан",
  "1-2": "Как открытую книгу прочитали",
  "1-3": "Размен",
  "1-4": "Он явно что-то знал",
  "1-5": "И че делать",
  "1-6": "Он не выдержал",

  "2-1": "МАКАН - В С Е",
  "2-2": "Макана тут нет",
  "2-3": "А мог ведь услышать",
  "2-4": "Допустим..",
  "2-5": "Надо было в Дубай..",
  "2-6": "Ладно..",

  "3-1": "Размен",
  "3-2": "Ёбнул оппу, он был в биркенштоках",
  "3-3": "Встретлись как-то два фаната облы",
  "3-4": "Бро, подучись у облы как это делается",
  "3-5": "Побежал жаловаться..",
  "3-6": "Получил пизды прям на трапе",

  "4-1": "Чтоб лучше расслышать",
  "4-2": "Допустим..",
  "4-3": "Обла больше не страшен",
  "4-4": "Пососитесь теперь епта",
  "4-5": "За что",
  "4-6": "Ладно..",

  "5-1": "Ну а хули он",
  "5-2": "Пизда ему",
  "5-3": "Побежал жаловаться..",
  "5-4": "За что",
  "5-5": "+2 иноагента",
  "5-6": "Пасасал",

  "6-1": "Весь полет играл BRATLAND",
  "6-2": "Ладно..",
  "6-3": "Получил пизды прям на трапе",
  "6-4": "Ладно..",
  "6-5": "Биг бой Абу Даби",
  "6-6": "И правильно, нахуй эти баттлы",
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

  lines.push(`${scoreLine}`);

  return lines;
}
