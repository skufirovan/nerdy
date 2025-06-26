export function formatDateToDDMMYYYY(date: Date) {
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

type NicknameValidationResult = {
  isValid: boolean;
  error?: "TOO_SHORT" | "TOO_LONG" | "INVALID_CHARS" | "EMOJI" | "CONTAINS_AT";
};

export function validateNickname(nickname: string): NicknameValidationResult {
  if (!nickname || nickname.trim().length <= 3) {
    return { isValid: false, error: "TOO_SHORT" };
  }

  if (nickname.length > 40) {
    return { isValid: false, error: "TOO_LONG" };
  }

  if (nickname.includes("@")) {
    return { isValid: false, error: "CONTAINS_AT" };
  }

  if (/\p{Emoji}/u.test(nickname)) {
    return { isValid: false, error: "EMOJI" };
  }

  if (!/^[а-яА-ЯёЁa-zA-Z0-9_\-\.,!? ]+$/u.test(nickname)) {
    return { isValid: false, error: "INVALID_CHARS" };
  }

  return { isValid: true };
}
