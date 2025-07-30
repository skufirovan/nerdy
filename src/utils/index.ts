import fs from "fs/promises";
import path from "path";
import { Markup } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { UserController } from "@controller/index";
import { UserDto, SquadMemberWithUserAndSquadDto } from "@domain/dtos";
import { SquadMemberRole } from "@prisma/generated";
import { userActionsLogger, serviceLogger } from "@infrastructure/logger";
import { UserError } from "@infrastructure/error";

export function formatDateToDDMMYYYY(date: Date): string {
  if (isNaN(date.getTime())) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function getLastFriday(from: Date): Date {
  const date = new Date(from);
  const day = date.getDay();
  const diff = day >= 5 ? day - 5 : 7 + day - 5;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getLastTwoFridays(): [Date, Date] {
  const now = new Date();
  const lastFriday = new Date(now);
  lastFriday.setDate(now.getDate() - ((now.getDay() + 2) % 7));
  lastFriday.setHours(0, 0, 0, 0);

  const prevFriday = new Date(lastFriday);
  prevFriday.setDate(lastFriday.getDate() - 7);

  return [prevFriday, lastFriday];
}

type ValidationResult<T> = {
  isValid: boolean;
  error?: T;
};

export type ValidationError = "TOO_SHORT" | "TOO_LONG" | "INVALID_CHARS";

export function validate(str: string): ValidationResult<ValidationError> {
  if (!str || str.trim().length < 3) {
    return { isValid: false, error: "TOO_SHORT" };
  }

  if (str.length > 40) {
    return { isValid: false, error: "TOO_LONG" };
  }

  if (!/^[а-яА-ЯёЁa-zA-Z0-9_\-\.,!? ]+$/u.test(str)) {
    return { isValid: false, error: "INVALID_CHARS" };
  }

  return { isValid: true };
}

export function hasCaption(message: unknown): message is { caption: string } {
  return (
    !!message &&
    typeof message === "object" &&
    "caption" in message &&
    typeof (message as { caption: unknown }).caption === "string"
  );
}

type Button = {
  text: string;
  callback: string;
};

export const toButton = ({ text, callback }: Button) =>
  Markup.button.callback(text, callback);

export const emojiMap: Record<SquadMemberRole, string> = {
  ADMIN: "👨🏿‍✈️",
  RECRUITER: "🕵🏿‍♂️",
  MEMBER: "👨🏿‍🌾",
};

export function formatSquad(members: SquadMemberWithUserAndSquadDto[]): string {
  const getRoleEmoji = (role: SquadMemberRole): string => {
    return emojiMap[role] || "👤";
  };

  const title = `🧌 ${members[0].squadName} - ${members[0].squad.seasonalFame} Fame\n`;

  const body = members.map((member) => {
    const username = member.user.username
      ? `https://t.me/${member.user.username}`
      : "#";
    return `${getRoleEmoji(member.role)} <a href="${username}">${
      member.user.nickname
    }</a> — ${member.user.seasonalFame} Fame`;
  });

  return [title, ...body].join("\n");
}

export async function getRandomImage(
  folderPath: string,
  fallbackImagePath: string
): Promise<string> {
  try {
    const files = await fs.readdir(folderPath);

    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      return fallbackImagePath;
    }

    const randomImage =
      imageFiles[Math.floor(Math.random() * imageFiles.length)];
    return path.join(folderPath, randomImage);
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    serviceLogger("error", "getRandomImage", err);
    return fallbackImagePath;
  }
}

export async function requireUser(ctx: MyContext): Promise<UserDto | null> {
  const accountId = ctx.user?.accountId;
  if (!accountId) {
    await ctx.reply("⚠️ Не удалось определить твой Telegram ID");
    return null;
  }

  const user = await UserController.findByAccountId(accountId);
  if (!user) {
    await ctx.reply(
      "🚫 Ты не зарегистрирован. Пропиши /start или обратись к администратору"
    );
    return null;
  }

  return user;
}

export async function handleError(
  ctx: MyContext,
  error: unknown,
  scope: string
) {
  const err = error instanceof Error ? error.message : String(error);

  userActionsLogger("error", scope, err, {
    accountId: ctx.user!.accountId,
    username: ctx.user!.username,
  });

  if (error instanceof UserError) {
    await ctx.reply(`🚫 ${error.message}`);
  } else {
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
  }
}

export function extractEquipmenNameFromCaption(caption: string): {
  brand: string;
  model: string;
} {
  const lines = caption.split("\n");
  const firstLine = lines[0];

  const cleaned = firstLine.replace(/[🎤🎧🎛]/g, "").trim();

  const [brand, model] = cleaned.split("\u200B");

  return {
    brand: brand?.trim() || "",
    model: model?.trim() || "",
  };
}
