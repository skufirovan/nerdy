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

export type NicknameError = "TOO_SHORT" | "TOO_LONG" | "INVALID_CHARS";

type NicknameValidationResult = {
  isValid: boolean;
  error?: NicknameError;
};

export function validateNickname(nickname: string): NicknameValidationResult {
  if (!nickname || nickname.trim().length < 3) {
    return { isValid: false, error: "TOO_SHORT" };
  }

  if (nickname.length > 40) {
    return { isValid: false, error: "TOO_LONG" };
  }

  if (!/^[а-яА-ЯёЁa-zA-Z0-9_\-\.,!? ]+$/u.test(nickname)) {
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
