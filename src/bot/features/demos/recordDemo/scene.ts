import path from "path";
import { Scenes } from "telegraf";
import { MyContext, SessionData } from "../../scenes";
import {
  DemoController,
  UserController,
  EquipmentController,
} from "@controller/index";
import { GifRepository } from "@infrastructure/repositories";
import { UserDto } from "@domain/dtos";
import {
  getRandomImage,
  requireUser,
  handleError,
  getESMPaths,
} from "@utils/index";
import { updateFileIdIfNeeded } from "@utils/fileId";
import { SECTION_EMOJI } from "@utils/constants";

export const recordDemoScene = new Scenes.BaseScene<MyContext>("recordDemo");

recordDemoScene.enter(async (ctx: MyContext) => {
  try {
    const session = ctx.session as SessionData;

    session.demo = {};

    const gif = await GifRepository.findByName("DEMO_1");

    const fileId = await updateFileIdIfNeeded({
      currentFileId: gif!.fileId,
      localPath: `public/videos/${gif!.name}.gif`,
      telegram: ctx.telegram,
      chatId: process.env.PRIVATE_CHAT!,
      onUpdate: async (newFileId) => {
        await GifRepository.updateFileId(gif!.name, newFileId);
      },
    });

    await ctx.replyWithAnimation(fileId, {
      caption:
        "📀 Фаа, сделал дело — рэпуй смело. Накидай баров текстом или отправь аудиофайл",
    });
  } catch (error) {
    await handleError(ctx, error, "recordDemoScene.enter");
    return ctx.scene.leave();
  }
});

recordDemoScene.on("message", async (ctx: MyContext) => {
  const accountId = ctx.user!.accountId;
  const session = ctx.session as SessionData;
  const message = ctx.message;

  if (!message) {
    return await ctx.reply("⚠️ Отправь текст или аудифайл");
  }

  try {
    const user = await requireUser(ctx);
    if (!user) return ctx.scene.leave();

    if (!session.demo!.text && !session.demo!.fileId) {
      if ("text" in message) {
        session.demo!.text = message.text.trim();
      } else if ("audio" in message) {
        const file = message.audio;
        session.demo!.fileId = file.file_id;
      } else {
        return await ctx.reply(
          "🦸🏿 Че ты мне пытаешься впарить, ниггер, давай заново"
        );
      }

      const gif = await GifRepository.findByName("DEMO_2");

      const fileId = await updateFileIdIfNeeded({
        currentFileId: gif!.fileId,
        localPath: `public/videos/${gif!.name}.gif`,
        telegram: ctx.telegram,
        chatId: process.env.PRIVATE_CHAT!,
        onUpdate: async (newFileId) => {
          await GifRepository.updateFileId(gif!.name, newFileId);
        },
      });

      return await ctx.replyWithAnimation(fileId, {
        caption:
          "💪🏿 Базару нет, ты немощь. Придумай название демки, оно не должно повторяться!",
      });
    }

    if (!session.demo!.name && "text" in message) {
      session.demo!.name = message.text.trim();

      const name = session.demo!.name;
      const text = session.demo!.text || null;
      const fileId = session.demo!.fileId || null;

      const equipment = await EquipmentController.findUserEquipped(accountId);
      const equipmentMultiplier = equipment.reduce(
        (acc, item) => acc * item.equipment.multiplier,
        1
      );
      const levelMultiplier = 1 + user.level / 100;

      const baseFameReward = user.hasPass ? 400 : 300;
      const baseRacksReward = user.hasPass ? 400 : 300;

      const fameReward = Math.floor(
        baseFameReward * equipmentMultiplier * levelMultiplier
      );
      const racksReward = Math.floor(
        baseRacksReward * equipmentMultiplier * levelMultiplier
      );

      let messageId = null;
      if (fileId) {
        const result = await ctx.telegram.sendAudio(
          process.env.DEMO_CHAT!,
          fileId!,
          {
            caption: `${user.accountId} @${user.username} - ${name}`,
          }
        );
        messageId = result.message_id;
      }

      await DemoController.create(accountId, name, text, fileId, messageId);
      await UserController.updateUserInfo(accountId, {
        racks: user.racks + racksReward,
      });

      const { __dirname } = getESMPaths(import.meta.url);
      const imagePath = await getRandomImage(
        path.resolve(__dirname, `../../../assets/images/DEMO`),
        path.resolve(__dirname, `../../../assets/images/DEMO/1.jpg`)
      );

      await ctx.replyWithPhoto(
        { source: imagePath },
        {
          caption: `🧖🏿 Демочка записана\n🧌 +${fameReward} фейма\n🪙 +${racksReward} рексов`,
        }
      );

      await updateUserRewards(ctx, user, accountId, fameReward, racksReward);

      delete session.demo;
      return ctx.scene.leave();
    }

    await ctx.reply("🦸🏿 Че ты мне пытаешься впарить, ниггер, давай заново");
  } catch (error) {
    await handleError(ctx, error, "recordDemoScene.on");
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
