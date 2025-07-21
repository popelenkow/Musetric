import { useState, FC, useMemo } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Typography,
} from '@mui/material';
import { fourierModes, windowSizes } from '../constants';
import type { FourierMode } from '@musetric/audio-view';
import { MetricsTable } from './MetricsTable';
import { BenchmarkRunner } from './BenchmarkRunner';
import type { BenchmarkData } from '../runBenchmarks';

type Task = {
  fourierMode: FourierMode;
  windowSize: number;
};

const initialData: BenchmarkData = fourierModes.reduce((acc, mode) => {
  acc[mode] = {};
  return acc;
}, {} as BenchmarkData);

const allTasks: Task[] = fourierModes.flatMap((fourierMode) =>
  windowSizes.map((windowSize) => ({ fourierMode, windowSize })),
);

export const App: FC = () => {
  const [data, setData] = useState<BenchmarkData>(initialData);
  const [showFirst, setShowFirst] = useState(false);
  const [showPercent, setShowPercent] = useState(false);
  const [mode, setMode] = useState<FourierMode>(fourierModes[0]);
  const [toDo, setToDo] = useState<Task[]>(allTasks);

  const status = useMemo(() => {
    const total = allTasks.length;
    const done = total - toDo.length;
    const progress = total > 0 ? (done / total) * 100 : 0;
    return { total, done, progress };
  }, [toDo]);

  const task = toDo[0];

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <FormControlLabel
        control={
          <Checkbox checked={showFirst} onChange={(_, v) => setShowFirst(v)} />
        }
        label='Show first run'
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showPercent}
            onChange={() => setShowPercent(!showPercent)}
          />
        }
        label='Show percent'
      />
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, v) => v && setMode(v)}
        sx={{ my: 2 }}
      >
        {fourierModes.map((m) => (
          <ToggleButton key={m} value={m}>
            {m}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box sx={{ width: '100%', mb: 3 }}>
        <Typography variant='body2' sx={{ mt: 1, textAlign: 'center' }}>
          {`${status.done} of ${status.total} tasks completed`}
        </Typography>
        <LinearProgress variant='determinate' value={status.progress} />
      </Box>

      <MetricsTable
        mode={mode}
        results={data[mode]}
        showFirst={showFirst}
        showPercent={showPercent}
      />

      {task && (
        <BenchmarkRunner
          fourierMode={task.fourierMode}
          windowSize={task.windowSize}
          onUpdate={(metrics) => {
            setData({
              ...data,
              [task.fourierMode]: {
                ...data[task.fourierMode],
                [task.windowSize]: metrics,
              },
            });
            setToDo((prev) => prev.slice(1));
          }}
        />
      )}
    </Box>
  );
};
