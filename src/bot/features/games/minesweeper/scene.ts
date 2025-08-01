import { Markup, Scenes } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { UserController } from "@controller/UserController";
import { MinesweeperRepository } from "@infrastructure/repositories";
import { handleError, requireUser } from "@utils/index";

const MINESWEEPER_BET = 500;
const FIELD_SIZE = 4;
const MINES_COUNT = 6;

interface MinesweeperField {
  cells: { x: number; y: number; isMine: boolean; isOpen: boolean }[];
  openCount: number;
}

export const minesweeperGameScene = new Scenes.BaseScene<MyContext>(
  "minesweeperGame"
);

function generateField(): MinesweeperField {
  const cells: { x: number; y: number; isMine: boolean; isOpen: boolean }[] =
    [];

  for (let x = 0; x < FIELD_SIZE; x++) {
    for (let y = 0; y < FIELD_SIZE; y++) {
      cells.push({ x, y, isMine: false, isOpen: false });
    }
  }

  const mineIndices = new Set<number>();

  while (mineIndices.size < MINES_COUNT) {
    const index = Math.floor(Math.random() * FIELD_SIZE * FIELD_SIZE);
    mineIndices.add(index);
  }

  mineIndices.forEach((index) => {
    cells[index].isMine = true;
  });

  return { cells, openCount: 0 };
}

function calculateWin(openCount: number): number {
  let multiplier = 1;
  for (let i = 0; i < openCount; i++) {
    multiplier *= 1.2 + i * 0.1;
  }
  return Math.floor(MINESWEEPER_BET * multiplier);
}

function renderField(field: MinesweeperField, currentWin: number) {
  const keyboard = [];

  for (let x = 0; x < FIELD_SIZE; x++) {
    const row = [];
    for (let y = 0; y < FIELD_SIZE; y++) {
      const cell = field.cells.find((c) => c.x === x && c.y === y)!;
      const text = cell.isOpen ? (cell.isMine ? "💣" : "✅") : "⬜";
      row.push(Markup.button.callback(text, `cell:${x}:${y}`));
    }
    keyboard.push(row);
  }
  keyboard.push([
    Markup.button.callback(`Забрать ${currentWin} 🪙`, "MINESWEEPER_TAKE_WIN"),
  ]);
  return Markup.inlineKeyboard(keyboard);
}

minesweeperGameScene.enter(async (ctx) => {
  try {
    const accountId = ctx.user!.accountId;
    const user = await requireUser(ctx);

    if (!user || user.racks < MINESWEEPER_BET) {
      await ctx.reply("🤚🏿 Тебе нужно 500 рексов, чтобы депнуть");
      return ctx.scene.leave();
    }

    const activeGame = await MinesweeperRepository.findActiveByAccountId(
      accountId
    );
    if (activeGame) {
      await ctx.reply("🤚🏿 У тебя уже есть активная лудка");
      return ctx.scene.leave();
    }

    await UserController.updateUserInfo(accountId, {
      racks: user.racks - MINESWEEPER_BET,
    });

    const field = generateField();
    const game = await MinesweeperRepository.create(
      accountId,
      JSON.stringify(field)
    );

    await ctx.reply(
      "🦹🏿‍♂️ Мы не рискуем, не входим в азарт. Поставили - забрали",
      renderField(field, game.currentWin)
    );
  } catch (error) {
    await handleError(ctx, error, "minesweeperGameScene.enter");
    return ctx.scene.leave();
  }
});

minesweeperGameScene.action(/cell:(\d):(\d)/, async (ctx) => {
  try {
    const accountId = ctx.user!.accountId;
    const match = ctx.match as RegExpMatchArray;
    const x = parseInt(match[1]);
    const y = parseInt(match[2]);

    const game = await MinesweeperRepository.findActiveByAccountId(accountId);
    if (!game) {
      await ctx.answerCbQuery("🤚🏿 Игра не найдена");
      return ctx.scene.leave();
    }

    const field: MinesweeperField = JSON.parse(game.field);
    const cell = field.cells.find((c) => c.x === x && c.y === y);

    if (!cell || cell.isOpen) {
      await ctx.answerCbQuery("🤚🏿 Ячейка уже открыта");
      return;
    }

    cell.isOpen = true;
    field.openCount += 1;

    if (cell.isMine) {
      await MinesweeperRepository.update(game.id, {
        isActive: false,
        currentWin: 0,
      });
      await ctx.editMessageText("💥 Щит гаддем, ниггер, ты проебал");
      return ctx.scene.leave();
    }

    const newWin = calculateWin(field.openCount);
    await MinesweeperRepository.update(game.id, {
      field: JSON.stringify(field),
      currentWin: newWin,
    });

    await ctx.editMessageText(
      "🦹🏿‍♂️ Мы не рискуем, не входим в азарт. Поставили - забрали",
      renderField(field, newWin)
    );
    await ctx.answerCbQuery("✅ Ячейка открыта");
  } catch (error) {
    await handleError(ctx, error, "minesweeperGameScene.cell");
    return ctx.scene.leave();
  }
});

minesweeperGameScene.action("MINESWEEPER_TAKE_WIN", async (ctx) => {
  try {
    const accountId = ctx.user!.accountId;
    const game = await MinesweeperRepository.findActiveByAccountId(accountId);
    const user = await requireUser(ctx);

    if (!game) {
      await ctx.answerCbQuery("🤚🏿 Игра не найдена");
      return ctx.scene.leave();
    }

    await MinesweeperRepository.update(game.id, { isActive: false });
    await UserController.updateUserInfo(accountId, {
      racks: user!.racks + game.currentWin,
    });

    await ctx.editMessageText(
      `🃏 Гребаная ракетка наказана, ты вынес ${game.currentWin} 🪙`
    );
    await ctx.answerCbQuery(`✅ Выигрыш ${game.currentWin} 🪙 получен!`);
    return ctx.scene.leave();
  } catch (error) {
    await handleError(ctx, error, "minesweeperScene.take_win");
    return ctx.scene.leave();
  }
});
