type WaitingTimeResult = {
  recordDemoRT: number;
};

export function getWaitingTime(hasPass: boolean): WaitingTimeResult {
  const recordDemoRT = hasPass ? 4 * 60 * 60 * 1000 : 6 * 60 * 60 * 1000;

  return { recordDemoRT };
}

export function getRemainingTimeText(remainingTimeMs: number): string {
  const remainingHours = Math.floor(remainingTimeMs / (60 * 60 * 1000));
  const remainingMinutes = Math.ceil(
    (remainingTimeMs % (60 * 60 * 1000)) / (60 * 1000)
  );

  return `${remainingHours} ч ${remainingMinutes} мин`;
}
