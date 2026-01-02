import { Chip } from '@mui/material';
import { api } from '@musetric/api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { computeOverallPercent } from '../../../project/Flow/common.js';

export type StageChipProps = {
  projectInfo: api.project.Item;
};

export const StageChip: FC<StageChipProps> = (props) => {
  const { projectInfo } = props;
  const { t } = useTranslation();

  const overallPercent = computeOverallPercent(projectInfo);

  if (overallPercent === 0) {
    return (
      <Chip
        size='small'
        color='warning'
        label={t('pages.projects.stages.pending')}
      />
    );
  }

  if (overallPercent !== 100) {
    return (
      <Chip size='small' color='info' label={`${overallPercent.toFixed(2)}%`} />
    );
  }

  return undefined;
};
