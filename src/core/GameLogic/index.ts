import { levelThresholds, racksPerLevel } from "@domain/config/levelThresholds";

type WaitingTimeResult = {
  recordDemoRT: number;
  recordVideoRT: number;
};

export function getWaitingTime(hasPass: boolean): WaitingTimeResult {
  const recordDemoRT = hasPass ? 1 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
  const recordVideoRT = hasPass ? 1 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000;

  return { recordDemoRT, recordVideoRT };
}

export function getRemainingTimeText(remainingTimeMs: number): string {
  const totalMinutes = Math.floor(remainingTimeMs / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours} ч ${minutes} мин`;
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
