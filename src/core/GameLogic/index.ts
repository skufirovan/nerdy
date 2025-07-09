import { levelThresholds } from "@domain/config/levelThresholds";

type WaitingTimeResult = {
  recordDemoRT: number;
  recordVideoRT: number;
};

export function getWaitingTime(hasPass: boolean): WaitingTimeResult {
  const recordDemoRT = hasPass ? 4 * 60 * 60 * 1000 : 6 * 60 * 60 * 1000;
  const recordVideoRT = hasPass ? 4 * 60 * 60 * 1000 : 6 * 60 * 60 * 1000;

  return { recordDemoRT, recordVideoRT };
}

export function getRemainingTimeText(remainingTimeMs: number): string {
  const remainingHours = Math.floor(remainingTimeMs / (60 * 60 * 1000));
  const remainingMinutes = Math.ceil(
    (remainingTimeMs % (60 * 60 * 1000)) / (60 * 1000)
  );

  return `${remainingHours} ч ${remainingMinutes} мин`;
}

export function calculateLevel(
  currentLevel: number,
  currentFame: number
): number {
  let newLevel = currentLevel;

  while (
    newLevel < levelThresholds.length &&
    currentFame >= levelThresholds[newLevel]
  ) {
    newLevel++;
  }

  return newLevel;
}
