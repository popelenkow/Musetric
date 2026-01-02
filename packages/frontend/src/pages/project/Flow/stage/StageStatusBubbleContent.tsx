import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { api } from '@musetric/api';
import { TFunction } from 'i18next';
import { FC, JSX } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getStatusColor,
  StageKey,
  StageStatus,
  stageProgressByKey,
} from '../common.js';

type StageStatusBubbleContentProps = {
  project: api.project.Item;
  stageKey: StageKey;
};

const statusTranslations: Record<StageStatus, (t: TFunction) => string> = {
  pending: (t) => t('pages.project.progress.status.pending'),
  active: (t) => t('pages.project.progress.status.live'),
  done: (t) => t('pages.project.progress.status.done'),
};

const statusIcons: Record<StageStatus, (color: string) => JSX.Element> = {
  pending: (color) => <RadioButtonCheckedIcon sx={{ color, fontSize: 26 }} />,
  active: (color) => <GraphicEqIcon sx={{ color, fontSize: 26 }} />,
  done: (color) => <CheckCircleRoundedIcon sx={{ color, fontSize: 26 }} />,
};

export const StageStatusBubbleContent: FC<StageStatusBubbleContentProps> = (
  props,
) => {
  const { project, stageKey } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const { percent, status } = stageProgressByKey[stageKey](project);
  const iconColor = getStatusColor(status, theme);
  return (
    <Stack
      alignItems='center'
      justifyContent='center'
      padding={1}
      height='100%'
    >
      {statusIcons[status](iconColor)}
      <Typography variant='body2' color='text.secondary'>
        {statusTranslations[status](t)}
      </Typography>
      {typeof percent === 'number' && (
        <Typography variant='body2'>{percent.toFixed(2)}%</Typography>
      )}
    </Stack>
  );
};
