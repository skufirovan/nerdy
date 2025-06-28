import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "../scenes";
import DemoDto from "@domain/dtos/DemoDto";
import { keyboards } from "@bot/markup/keyboards";
import { formatDateToDDMMYYYY, hasCaption } from "@utils/index";

export interface PaginationData<T> {
  items: T[];
  currentIndex: number;
  type: string;
}

export function formatPaginated(item: unknown, type: string): string {
  switch (type) {
    case "demos":
      const demo = item as DemoDto;
      return `🎤 <b>${demo.name}</b>\n🕓 ${formatDateToDDMMYYYY(
        demo.recordedAt
      )}\n\n${demo.text}`;
    default:
      return "❌ Неизвестный формат";
  }
}

export function paginate<T>(
  data: PaginationData<T>,
  direction: "NEXT" | "PREV"
): PaginationData<T> {
  let index = data.currentIndex;

  if (direction === "NEXT") {
    index = (index + 1) % data.items.length;
  } else if (direction === "PREV") {
    index = (index - 1 + data.items.length) % data.items.length;
  }

  return { ...data, currentIndex: index };
}

export const paginateActions = (bot: Telegraf<MyContext>) => {
  bot.action("PAGINATE_NEXT", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const session = ctx.session as SessionData;
      let pagination = session.pagination;

      if (!pagination) return;

      pagination = paginate(pagination, "NEXT");

      const currentItem = pagination.items[pagination.currentIndex];
      const message = ctx.update.callback_query.message;
      const newCaption = formatPaginated(currentItem, pagination.type);
      const currentCaption = hasCaption(message) ? message.caption : undefined;

      if (currentCaption !== newCaption) {
        await ctx.editMessageCaption(newCaption, {
          parse_mode: "HTML",
          reply_markup: keyboards.demos.reply_markup,
        });

        session.pagination = pagination;
      }
    } catch (error) {
      console.error(error);
    }
  });

  bot.action("PAGINATE_PREV", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const session = ctx.session as SessionData;
      let pagination = session.pagination;

      if (!pagination) return;

      pagination = paginate(pagination, "PREV");

      const currentItem = pagination.items[pagination.currentIndex];
      const message = ctx.update.callback_query.message;
      const newCaption = formatPaginated(currentItem, pagination.type);
      const currentCaption = hasCaption(message) ? message.caption : undefined;

      if (currentCaption !== newCaption) {
        await ctx.editMessageCaption(newCaption, {
          parse_mode: "HTML",
          reply_markup: keyboards.demos.reply_markup,
        });

        session.pagination = pagination;
      }
    } catch (error) {
      console.error(error);
    }
  });
};
