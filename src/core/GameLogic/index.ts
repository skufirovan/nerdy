import { levelThresholds, racksPerLevel } from "@domain/config/levelThresholds";

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

export function calculateLevelAndRacks(
  currentLevel: number,
  currentFame: number
): { level: number; racks: number } {
  let newLevel = currentLevel;
  let racks = 0;

  while (
    newLevel < levelThresholds.length &&
    currentFame >= levelThresholds[newLevel]
  ) {
    racks += racksPerLevel[newLevel];
    newLevel++;
  }

  return { level: newLevel, racks };
}
