import type { TFunction } from 'i18next';

const byteUnits = ['b', 'kb', 'mb', 'gb', 'tb'] as const;
export type ByteUnit = (typeof byteUnits)[number];

const unitLabels: Record<ByteUnit, (t: TFunction) => string> = {
  b: (t) => t('common.units.bytes.b'),
  kb: (t) => t('common.units.bytes.kb'),
  mb: (t) => t('common.units.bytes.mb'),
  gb: (t) => t('common.units.bytes.gb'),
  tb: (t) => t('common.units.bytes.tb'),
};

const getUnitIndexByValue = (value: number): number =>
  Math.min(Math.floor(Math.log(value) / Math.log(1024)), byteUnits.length - 1);

const getDividerByIndex = (index: number): number => 1024 ** index;

export const formatBytesWithUnit = (
  valueInBytes: number,
  t: TFunction,
): string => {
  const unitIndex = getUnitIndexByValue(valueInBytes);
  const unit = byteUnits[unitIndex];
  const divider = getDividerByIndex(unitIndex);
  const value = valueInBytes / divider;

  return `${value.toFixed(1)} ${unitLabels[unit](t)}`;
};

export const formatBytesToUnit = (
  valueInBytes: number,
  baseValueInBytes: number,
) => {
  const unitIndex = getUnitIndexByValue(baseValueInBytes);
  const divider = getDividerByIndex(unitIndex);
  const value = valueInBytes / divider;

  return value.toFixed(1);
};
