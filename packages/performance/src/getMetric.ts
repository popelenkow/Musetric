import { MetricsData } from './runBenchmarks';

export const toPercent = (value: number, total: number) =>
  (value / total) * 100;

export const getMetric = (
  data: MetricsData,
  metric: string,
  showFirst: boolean,
  showPercent: boolean,
) => {
  if (!data) return undefined;
  const metricData = showFirst ? data.first : data.average;
  const value = metricData[metric];
  const total = metricData.total;
  return showPercent ? toPercent(value, total) : value;
};
