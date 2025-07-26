import path from "path";
import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import { VideoController, DemoController, UserController } from "@controller";
import { UserDto } from "@domain/dtos";
import { getRandomImage, requireUser, handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const recordVideoScene = new Scenes.BaseScene<MyContext>("recordVideo");

recordVideoScene.enter(async (ctx: MyContext) => {
  try {
    const accountId = ctx.user!.accountId;
    const session = ctx.session as SessionData;

    const { canRecord, remainingTimeText } = await VideoController.canRecord(
      accountId
    );

    if (!canRecord) {
      const imagePath = await getRandomImage(
        path.resolve(__dirname, `../../assets/images/REMAINING`),
        path.resolve(__dirname, `../../assets/images/REMAINING/1.jpg`)
      );
      await ctx.replyWithPhoto(
        { source: imagePath },
        { caption: `☁️ Охлади траханье, приходи через ${remainingTimeText!}` }
      );
      return ctx.scene.leave();
    }

    session.video = {};
    await ctx.reply("📱 Напиши название демки, под которую снимешь ТТ");
  } catch (error) {
    await handleError(ctx, error, "recordVideoScene.enter");
    return ctx.scene.leave();
  }
});

recordVideoScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message))
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");

  const accountId = ctx.user!.accountId;
  const session = ctx.session as SessionData;
  const msg = ctx.message.text.trim();

  try {
    const user = await requireUser(ctx);

    if (!user) return ctx.scene.leave();

    if (!session.video!.demo) {
      const demo = await DemoController.findByName(accountId, msg);

      if (demo) {
        session.video!.demo = demo;
        return await ctx.reply(
          "💪🏿 Демочка выбрана, накидай описание для видоса"
        );
      } else {
        await ctx.reply("😣 Нема демки (( проверь название..");
        return ctx.scene.leave();
      }
    }

    if (!session.video!.description) {
      session.video!.description = msg;

      const demoId = session.video!.demo!.id;
      const description = session.video!.description;

      const levelMultiplier = 1 + user.level / 100;
      const inRecommendations = Math.random() < 0.1;

      const baseRacksReward = user.level >= 5 ? (user.hasPass ? 400 : 300) : 0;
      const baseFameReward = user.hasPass ? 400 : 300;

      const fameReward = Math.floor(
        inRecommendations
          ? baseFameReward * levelMultiplier * 20
          : baseFameReward * levelMultiplier
      );
      const racksReward = Math.floor(
        inRecommendations
          ? baseRacksReward * levelMultiplier * 10
          : baseRacksReward * levelMultiplier
      );

      await VideoController.create(accountId, demoId, description);
      await UserController.updateUserInfo(accountId, {
        racks: user.racks + baseRacksReward,
      });

      let caption = `🧖🏿 3к видосов под звуком и дропаю.. Ты получил +${fameReward} фейма`;

      if (racksReward > 0) {
        caption += ` и +${baseRacksReward} рексов`;
      }

      await ctx.replyWithAnimation(
        { source: path.resolve(__dirname, `../../assets/images/VIDEO/1.gif`) },
        { caption }
      );

      await updateUserRewards(
        ctx,
        user,
        accountId,
        fameReward,
        baseRacksReward
      );

      delete session.video;
      await ctx.scene.leave();
    }
  } catch (error) {
    await handleError(ctx, error, "recordVideoScene.enter");
    return ctx.scene.leave();
  }
});

async function updateUserRewards(
  ctx: MyContext,
  user: UserDto,
  accountId: bigint,
  fameReward: number,
  racksReward: number
) {
  const updatedUser = await UserController.addFame(accountId, fameReward);

  if (user.level !== updatedUser.level) {
    const racksGained = updatedUser.racks - user.racks - racksReward;
    await ctx.reply(
      `${SECTION_EMOJI} Уровень сваги подрос, ты залутал +${racksGained} рексов`
    );
  }
}
