import fs from "fs/promises";
import path from "path";
import { Markup } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { UserController } from "@controller";
import { UserDto, SquadMemberDto } from "@domain/dtos";
import { SquadMemberRole } from "@prisma/generated";
import { userActionsLogger, serviceLogger } from "@infrastructure/logger";

export function formatDateToDDMMYYYY(date: Date): string {
  if (isNaN(date.getTime())) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
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

export const isValidCombo = (combo: string): boolean => {
  return /^[1-6]{6}$/.test(combo);
};

export const emojiMap: Record<SquadMemberRole, string> = {
  ADMIN: "👨🏿‍✈️",
  RECRUITER: "🕵🏿‍♂️",
  MEMBER: "👨🏿‍🌾",
};

export function formatSquadMembers(members: SquadMemberDto[]): string[] {
  const getRoleEmoji = (role: SquadMemberRole): string => {
    return emojiMap[role] || "👤";
  };

  return members.map((member, index) => {
    const username = member.user.username
      ? `https://t.me/${member.user.username}`
      : "#";
    return `${getRoleEmoji(member.role)} [${
      member.user.nickname
    }](${username}) — ${member.user.seasonalFame} Fame`;
  });
}

export function getSquadKeyboardByRole(
  role: SquadMemberRole,
  squadName: string
) {
  const BUTTONS = {
    KICK_MEMBER: {
      text: "👨🏿‍⚖️ Выгнать",
      callback: `KICK_MEMBER_${squadName}`,
    },
    INVITE_MEMBER: {
      text: "👶🏿 Пригласить",
      callback: `INVITE_MEMBER_${squadName}`,
    },
    LEAVE_SQUAD: {
      text: "🏃🏿 Покинуть объединение",
      callback: `LEAVE_SQUAD_${squadName}`,
    },
    CHANGE_ROLE: {
      text: "👨🏿‍💼 Настроить роли",
      callback: `PRE-CHANGE_ROLE_${squadName}`,
    },
    DELETE_SQUAD: {
      text: "👊🏿 Распустить",
      callback: `DELETE_SQUAD_${squadName}`,
    },
  };

  switch (role) {
    case SquadMemberRole.ADMIN:
      return Markup.inlineKeyboard([
        [toButton(BUTTONS.KICK_MEMBER)],
        [toButton(BUTTONS.INVITE_MEMBER)],
        [toButton(BUTTONS.LEAVE_SQUAD)],
        [toButton(BUTTONS.CHANGE_ROLE)],
        [toButton(BUTTONS.DELETE_SQUAD)],
      ]);
    case SquadMemberRole.RECRUITER:
      return Markup.inlineKeyboard([
        [toButton(BUTTONS.INVITE_MEMBER)],
        [toButton(BUTTONS.LEAVE_SQUAD)],
      ]);
    case SquadMemberRole.MEMBER:
    default:
      return Markup.inlineKeyboard([[toButton(BUTTONS.LEAVE_SQUAD)]]);
  }
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
  await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
}
