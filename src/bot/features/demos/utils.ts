import { DistributedDemoWithDemoAndLikesDto } from "@domain/dtos";

export function extractDemoNameFromCaption(caption: string): string | null {
  const match = caption.match(/📝 (.+?)(?=\n|$)/);
  return match ? match[1] : null;
}

export function extractNameAndNicknameFromCaption(caption: string): {
  name: string | null;
  nickname: string | null;
} {
  const nameMatch = caption.match(/🎵 (.+?) — (.+)/);
  if (!nameMatch) return { name: null, nickname: null };
  return { nickname: nameMatch[1], name: nameMatch[2] };
}

export function formatDistributedDemo(
  distributedDemo: DistributedDemoWithDemoAndLikesDto
): string {
  const username =
    distributedDemo.user.username && distributedDemo.user.hasPass
      ? `https://t.me/${distributedDemo.user.username}`
      : "#";

  const text = [
    `🎵 <a href="${username}">${distributedDemo.user.nickname}</a> — ${distributedDemo.demo.name}\n`,
    `❤️ ${distributedDemo.likes.length}`,
  ].join("\n");

  return text;
}
