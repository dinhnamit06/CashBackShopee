const DEFAULT_ESTIMATE_RATE = 0.056;

export function estimateCashback(
  orderValue: number,
  rate = DEFAULT_ESTIMATE_RATE
): number {
  if (!Number.isFinite(orderValue) || !Number.isFinite(rate)) {
    return 0;
  }

  return Math.max(0, Math.round(orderValue * Math.max(0, rate)));
}
