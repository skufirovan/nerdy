import { Telegraf } from "telegraf";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import { MyContext, SessionData } from "../scenes";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { DemoDto, UserEquipmentDto } from "@domain/dtos";
import { formatDateToDDMMYYYY, hasCaption } from "@utils/index";
import { PAGINATE_BUTTONS } from "./keyboard";

export interface PaginationData<T> {
  items: T[];
  currentIndex: number;
  type: string;
  replyMarkup?: InlineKeyboardMarkup;
}

export function formatPaginated(item: unknown, type: string): string {
  switch (type) {
    case "demos":
      const demo = item as DemoDto;
      return [
        `🎤 <b>${demo.name}</b>`,
        `🕓 ${formatDateToDDMMYYYY(demo.recordedAt)}`,
        "",
        demo.text,
      ].join("\n");
    case "equipment":
      const userEquipment = item as UserEquipmentDto;
      const equipment = userEquipment.equipment;
      const emoji =
        equipment.type === "MICROPHONE"
          ? "🎤"
          : equipment.type === "HEADPHONES"
          ? "🎧"
          : "🎛";
      return [
        `${emoji} <b>${equipment.brand} ${equipment.model}</b>`,
        "",
        `Множитель: ${equipment.multiplier}`,
        `Цена: ${equipment.price}`,
        `Дата приобретения: ${formatDateToDDMMYYYY(userEquipment.createdAt)}`,
      ].join("\n");
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
  bot.action(PAGINATE_BUTTONS.NEXT.callback, async (ctx) => {
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
          reply_markup: pagination.replyMarkup,
        });

        session.pagination = pagination;
      }
    } catch (error) {
      userActionsLogger(
        "error",
        "paginateActions",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
    }
  });

  bot.action(PAGINATE_BUTTONS.PREV.callback, async (ctx) => {
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
          reply_markup: pagination.replyMarkup,
        });

        session.pagination = pagination;
      }
    } catch (error) {
      userActionsLogger(
        "error",
        "paginateActions",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
    }
  });
};
