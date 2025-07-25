import path from "path";
import { Telegram } from "telegraf";

export async function isFileIdValid(
  fileId: string,
  telegram: Telegram
): Promise<boolean> {
  try {
    await telegram.getFile(fileId);
    return true;
  } catch {
    return false;
  }
}

export async function refreshFileIdFromLocalFile(
  relativeFilePath: string,
  telegram: Telegram,
  chatId: string
): Promise<string> {
  const fullPath = path.resolve(relativeFilePath);
  const result = await telegram.sendPhoto(chatId, { source: fullPath });

  if (!result.photo || result.photo.length === 0) {
    throw new Error(`Не удалось отправить фото из ${relativeFilePath}`);
  }

  return result.photo.at(-1)!.file_id;
}

export async function updateFileIdIfNeeded({
  currentFileId,
  localPath,
  telegram,
  chatId,
  onUpdate,
}: {
  currentFileId: string;
  localPath: string;
  telegram: Telegram;
  chatId: string;
  onUpdate: (newFileId: string) => Promise<void>;
}): Promise<string> {
  const isValid = await isFileIdValid(currentFileId, telegram);
  if (isValid) return currentFileId;

  const newFileId = await refreshFileIdFromLocalFile(
    localPath,
    telegram,
    chatId
  );
  await onUpdate(newFileId);
  return newFileId;
}
