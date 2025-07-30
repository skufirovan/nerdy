import path from "path";
import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { EquipmentController } from "controller/EquipmentController";
import { formatPaginated } from "@bot/features/pagination/action";
import { SHOP_BUTTONS } from "../showShopMenu/keyboard";
import { equipmentShopKeyboard, oneEquipmentShopKeyboard } from "./keyboard";
import {
  getRandomImage,
  handleError,
  requireUser,
  getESMPaths,
} from "@utils/index";

export const showEquipmentShopAction = (bot: Telegraf<MyContext>) => {
  bot.action(SHOP_BUTTONS.EQUIPMENT.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const accountId = ctx.user!.accountId;
      const user = await requireUser(ctx);
      const shopItems = await EquipmentController.findShopEquipment(accountId);

      if (!shopItems || shopItems.length === 0)
        return await ctx.reply(`😔 Оборудку раскупили`);

      if (!user) return;

      const replyMarkup =
        shopItems.length > 1
          ? equipmentShopKeyboard.reply_markup
          : oneEquipmentShopKeyboard.reply_markup;

      const session = ctx.session as SessionData;
      session.pagination = {
        items: shopItems,
        currentIndex: 0,
        type: "equipment",
        replyMarkup,
      };

      const { __dirname } = getESMPaths(import.meta.url);
      const imagePath = await getRandomImage(
        path.resolve(__dirname, "../../../assets/images/EQUIPMENT"),
        path.resolve(__dirname, "../../../assets/images/EQUIPMENT/1.jpg")
      );

      const first = shopItems[0];

      await ctx.replyWithPhoto(
        { source: imagePath },
        {
          caption: formatPaginated(first, "equipment"),
          parse_mode: "HTML",
          reply_markup: replyMarkup,
        }
      );
    } catch (error) {
      handleError(ctx, error, "equipmentShopAction");
    }
  });
};
