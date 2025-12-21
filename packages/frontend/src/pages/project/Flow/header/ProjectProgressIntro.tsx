import { Stack, Typography } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { OverallProgressMeter } from './OverallProgressMeter.js';

export type ProjectProgressIntroProps = {
  project: api.project.Item;
};

export const ProjectProgressIntro: FC<ProjectProgressIntroProps> = (props) => {
  const { project } = props;
  const { t } = useTranslation();

  return (
    <Stack gap={1} alignItems='center' width='100%'>
      <Typography variant='h4' textAlign='center' fontWeight={800}>
        {t('pages.project.progress.trackTitle')}
      </Typography>
      <Typography
        variant='body1'
        color='text.secondary'
        textAlign='center'
        sx={{ maxWidth: 900, lineHeight: 1.5 }}
      >
        {t('pages.project.progress.subTitle')}
      </Typography>
      <OverallProgressMeter project={project} />
    </Stack>
  );
};
