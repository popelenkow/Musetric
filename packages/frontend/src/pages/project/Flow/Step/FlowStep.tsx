import { alpha, Card, LinearProgress, Stack, Typography } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import { api } from '@musetric/api';
import { FC } from 'react';
import { FlowStepDownload } from './FlowStepDownload.js';
import { FlowStepStatus } from './FlowStepStatus.js';

const getStatusColor = (
  status: api.project.ProcessingStepStatus,
  theme: Theme,
): string => {
  if (status === 'processing') {
    return theme.palette.primary.main;
  }
  if (status === 'done') {
    return theme.palette.success.main;
  }
  return theme.palette.grey[500];
};

export type FlowStepProps = {
  title: string;
  step: api.project.ProcessingStep;
};

export const FlowStep: FC<FlowStepProps> = (props) => {
  const { title, step } = props;
  const theme = useTheme();
  const accent = getStatusColor(step.status, theme);

  return (
    <Card
      component={Stack}
      gap={2}
      sx={{
        padding: 2,
        border: `1px solid ${alpha(accent, 0.4)}`,
        backgroundColor: `${alpha(accent, 0.1)}`,
      }}
    >
      <Stack direction='row' alignItems='center' gap={2}>
        <Typography variant='subtitle1' fontWeight='bold'>
          {title}
        </Typography>
        <FlowStepStatus step={step} />
      </Stack>
      {step.progress !== undefined && (
        <LinearProgress variant='determinate' value={step.progress * 100} />
      )}
      <FlowStepDownload step={step} />
    </Card>
  );
};
