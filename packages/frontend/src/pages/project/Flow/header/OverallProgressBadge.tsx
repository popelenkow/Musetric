import { alpha, Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { api } from '@musetric/api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { computeOverallPercent } from '../common.js';

export type OverallProgressBadgeProps = {
  project: api.project.Item;
};

export const OverallProgressBadge: FC<OverallProgressBadgeProps> = (props) => {
  const { project } = props;
  const { t } = useTranslation();
  const theme = useTheme();

  const progressPercent = computeOverallPercent(project);
  if (progressPercent === undefined) {
    return undefined;
  }

  return (
    <Stack direction='row' alignItems='center' width='100%' gap={2}>
      <Box flexGrow={1} />
      <Box
        sx={{
          padding: theme.spacing(1, 2),
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          minWidth: 150,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Typography variant='caption' color='text.secondary'>
          {t('pages.project.progress.overall')}
        </Typography>
        <Typography variant='h5'>{progressPercent.toFixed(2)}%</Typography>
      </Box>
    </Stack>
  );
};
