import { PAGINATE_BUTTONS } from "@bot/features/pagination/keyboard";
import { toButton } from "@utils/index";
import { Markup } from "telegraf";

export const EQUIPMENT_SHOP_BUTTONS = {
  BUY_EQUIPMENT: {
    text: "📈 Закупить",
    callback: "SHOP_BUY_EQUIPMENT",
  },
};

export const equipmentShopKeyboard = Markup.inlineKeyboard([
  [toButton(PAGINATE_BUTTONS.PREV), toButton(PAGINATE_BUTTONS.NEXT)],
  [toButton(EQUIPMENT_SHOP_BUTTONS.BUY_EQUIPMENT)],
]);

export const oneEquipmentShopKeyboard = Markup.inlineKeyboard([
  [toButton(EQUIPMENT_SHOP_BUTTONS.BUY_EQUIPMENT)],
]);
