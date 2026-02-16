import { Stack } from '@mui/material';
import { type api } from '@musetric/api';
import { type FC } from 'react';
import { usePlayerStore } from '../store/player.js';
import { SegmentLCurrent } from './SegmentLCurrent.js';
import { SegmentNext } from './SegmentNext.js';

type SubtitleLines = {
  current?: api.subtitle.Segment;
  next?: api.subtitle.Segment;
  currentTime: number;
};

const getSegmentEnd = (segment: api.subtitle.Segment) => {
  const words = segment.words;
  if (words && words.length > 0) {
    return words[words.length - 1].end;
  }
  return segment.end;
};

const getSubtitleLines = (
  subtitle: api.subtitle.Segment[],
  buffer: { duration: number } | undefined,
  progress: number,
): SubtitleLines => {
  if (!buffer || subtitle.length === 0) {
    return {
      current: undefined,
      next: undefined,
      currentTime: 0,
    };
  }

  const currentTime = buffer.duration * progress;
  const currentIndex = subtitle.findIndex(
    (segment) => currentTime < getSegmentEnd(segment),
  );
  const current = currentIndex === -1 ? undefined : subtitle[currentIndex];
  const next = currentIndex === -1 ? undefined : subtitle[currentIndex + 1];

  return { current, next, currentTime };
};

export type SubtitleProps = {
  subtitle: api.subtitle.Segment[];
};
export const Subtitle: FC<SubtitleProps> = (props) => {
  const { subtitle } = props;

  const buffer = usePlayerStore((s) => s.buffer);
  const progress = usePlayerStore((s) => s.progress);

  const { current, next, currentTime } = getSubtitleLines(
    subtitle,
    buffer,
    progress,
  );

  return (
    <Stack alignItems='center' gap={0.5}>
      <SegmentLCurrent segment={current} currentTime={currentTime} />
      <SegmentNext segment={next} />
    </Stack>
  );
};
