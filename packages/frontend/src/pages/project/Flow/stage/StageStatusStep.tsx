import { alpha, Card, LinearProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { api } from '@musetric/api';
import { TFunction } from 'i18next';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { getStatusColor, StageKey, stageProgressByKey } from '../common.js';
import { StageStatusStepDownload } from './StageStatusStepDownload.js';
import { StageStatusStepStatus } from './StageStatusStepStatus.js';

const titleByStageKey: Record<StageKey, (t: TFunction) => string> = {
  separation: (t) => t('pages.project.progress.steps.separation.label'),
  transcription: (t) => t('pages.project.progress.steps.transcription.label'),
};

export type StageStatusStepProps = {
  project: api.project.Item;
  stageKey: StageKey;
};

export const StageStatusStep: FC<StageStatusStepProps> = (props) => {
  const { project, stageKey } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const { percent, status } = stageProgressByKey[stageKey](project);
  const accent = getStatusColor(status, theme);

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
          {titleByStageKey[stageKey](t)}
        </Typography>
        <StageStatusStepStatus project={project} stageKey={stageKey} />
      </Stack>
      {percent !== undefined && (
        <LinearProgress variant='determinate' value={percent} />
      )}
      <StageStatusStepDownload project={project} stageKey={stageKey} />
    </Card>
  );
};
