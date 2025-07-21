import { PAGINATE_BUTTONS } from "@bot/features/pagination/keyboard";
import { toButton } from "@utils/index";
import { Markup } from "telegraf";

export const SHOW_EQUIPMENT_BUTTONS = {
  EQUIP_EQUIPMENT: {
    text: "👨🏿‍💻 Использовать",
    callback: "EQUIP_EQUIPMENT",
  },
};

export const showEquipmentKeyboard = Markup.inlineKeyboard([
  [toButton(PAGINATE_BUTTONS.PREV), toButton(PAGINATE_BUTTONS.NEXT)],
  [toButton(SHOW_EQUIPMENT_BUTTONS.EQUIP_EQUIPMENT)],
]);

export const showOneEquipmentKeyboard = Markup.inlineKeyboard([
  [toButton(SHOW_EQUIPMENT_BUTTONS.EQUIP_EQUIPMENT)],
]);
