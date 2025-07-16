import { SquadMemberDto } from "@domain/dtos";
import { SquadMemberRole } from "@prisma/generated";
import { Markup } from "telegraf";

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
  return /^[1-4]{4}$/.test(combo);
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
