import { MyContext } from "@bot/features/scenes";
import { UserController, EquipmentController } from "@controller/index";
import { PromocodeRepository } from "@infrastructure/repositories";
import { handleError, requireUser } from "@utils/index";

export const handlePromo = async (ctx: MyContext) => {
  try {
    const accountId = ctx.user!.accountId;
    const code =
      ctx.message && "text" in ctx.message
        ? ctx.message.text.split(" ")[1]
        : null;

    if (!code) {
      return await ctx.reply("🤚🏿 Укажи промокод: /promo <код>");
    }

    const promocode = await PromocodeRepository.findByCode(code);
    if (!promocode) {
      return await ctx.reply("🤚🏿 Промокод не найден");
    }

    if (promocode.expiresAt && new Date() > promocode.expiresAt) {
      return await ctx.reply("🤚🏿 Промокод истёк");
    }

    if (await PromocodeRepository.hasUsedPromocode(accountId, promocode.id)) {
      return await ctx.reply("🤚🏿 Ты уже использовал этот промокод");
    }

    if (promocode.maxUses > 0) {
      const uses = await PromocodeRepository.countUses(promocode.id);
      if (uses >= promocode.maxUses) {
        return await ctx.reply("🤚🏿 Промокод исчерпал лимит использований");
      }
    }

    const user = await requireUser(ctx);

    await PromocodeRepository.usePromocode(accountId, promocode.id);
    let rewardMessage = "";

    switch (promocode.rewardType) {
      case "racks":
        await UserController.updateUserInfo(accountId, {
          racks: user!.racks + promocode.rewardValue,
        });
        rewardMessage = `🪙 Получено ${promocode.rewardValue} рексов`;
        break;
      case "equipment":
        const existed = await EquipmentController.findUserEquipment(
          accountId,
          BigInt(promocode.rewardValue)
        );
        if (existed) {
          rewardMessage = `🎙 У тебя уже есть <b>${existed.equipment.brand} ${existed.equipment.model}</b>`;
          break;
        }

        const userEquipment = await EquipmentController.create(
          accountId,
          BigInt(promocode.rewardValue)
        );
        rewardMessage = `🎙 Получена новая оборудка — <b>${userEquipment.equipment.brand} ${userEquipment.equipment.model}</b>`;
        break;
      case "pass":
        let passUntil = new Date();
        if (user?.passExpiresAt && user.passExpiresAt > passUntil) {
          passUntil = new Date(user.passExpiresAt);
        }
        passUntil.setDate(passUntil.getDate() + promocode.rewardValue);
        await UserController.updateUserInfo(accountId, {
          hasPass: true,
          passExpiresAt: passUntil,
        });
        rewardMessage = `⭐️ Пасс продлён на ${promocode.rewardValue} дней`;
        break;
      default:
        rewardMessage = "❌ Неизвестный тип награды";
    }

    await ctx.reply(rewardMessage, { parse_mode: "HTML" });
  } catch (error) {
    await handleError(ctx, error, "handlePromo");
  }
};
