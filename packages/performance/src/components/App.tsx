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
import { windowSizes } from '../constants';
import { allFourierModes, type FourierMode } from '@musetric/audio-view';
import { MetricsTable } from './MetricsTable';
import { BenchmarkRunner } from './BenchmarkRunner';
import type { BenchmarkData } from '../runBenchmarks';

type Task = {
  fourierMode: FourierMode;
  windowSize: number;
};

const initialData: BenchmarkData = allFourierModes.reduce((acc, mode) => {
  acc[mode] = {};
  return acc;
}, {} as BenchmarkData);

const allTasks: Task[] = allFourierModes.flatMap((fourierMode) =>
  windowSizes.map((windowSize) => ({ fourierMode, windowSize })),
);

export const App: FC = () => {
  const [data, setData] = useState<BenchmarkData>(initialData);
  const [showFirst, setShowFirst] = useState(false);
  const [showPercent, setShowPercent] = useState(false);
  const [mode, setMode] = useState<FourierMode>(allFourierModes[0]);
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
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={showFirst}
            onClick={() => setShowFirst(!showFirst)}
          />
        }
        label='Show first run'
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showPercent}
            onClick={() => setShowPercent(!showPercent)}
          />
        }
        label='Show percent'
      />
      <ToggleButtonGroup value={mode} exclusive sx={{ my: 2 }}>
        {allFourierModes.map((fourierMode) => (
          <ToggleButton
            key={fourierMode}
            value={fourierMode}
            onClick={() => setMode(fourierMode)}
          >
            {fourierMode}
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
