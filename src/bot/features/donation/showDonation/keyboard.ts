import { toButton } from "@utils/index";
import { Markup } from "telegraf";

export const DONATION_BUTTONS = {
  NERD_PASS: { text: "⭐️ Купить NERD PASS", callback: "BUY_NERD_PASS" },
};

export const donationKeyboard = Markup.inlineKeyboard([
  [toButton(DONATION_BUTTONS.NERD_PASS)],
]);
