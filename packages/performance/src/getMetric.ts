import { MetricsData } from './runBenchmarks';

export const toPercent = (value: number, total: number) =>
  (value / total) * 100;

export const getMetric = (
  data: MetricsData,
  metric: string,
  showFirst: boolean,
  showPercent: boolean,
  showDeviations?: boolean,
) => {
  if (!data) return undefined;

  if (showDeviations) {
    const deviation = data.maxDeviation[metric];
    if (!deviation) return undefined;

    const positiveValue = showPercent
      ? toPercent(deviation.positive, data.average.total)
      : deviation.positive;
    const negativeValue = showPercent
      ? toPercent(deviation.negative, data.average.total)
      : deviation.negative;

    return `+${positiveValue.toFixed(2)} / -${negativeValue.toFixed(2)}`;
  }

  const metricData = showFirst ? data.first : data.average;
  const value = metricData[metric];
  const total = metricData.total;
  return showPercent ? toPercent(value, total) : value;
};
