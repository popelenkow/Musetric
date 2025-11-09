import { Chip } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type StageChipProps = {
  projectInfo: api.project.Item;
};

export const StageChip: FC<StageChipProps> = (props) => {
  const { projectInfo } = props;
  const { t } = useTranslation();

  if (projectInfo.stage === 'progress') {
    const { separationProgress } = projectInfo;
    const progress =
      separationProgress === undefined
        ? '--'
        : (separationProgress * 100).toFixed(2);
    return <Chip size='small' color='info' label={`${progress}%`} />;
  }

  if (projectInfo.stage === 'pending') {
    return (
      <Chip
        size='small'
        color='warning'
        label={t('pages.projects.stages.pending')}
      />
    );
  }

  return undefined;
};
