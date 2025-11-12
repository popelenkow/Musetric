import { Stack, Typography } from '@mui/material';
import { api } from '@musetric/api';
import { UseQueryResult } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgressWithLabel } from '../../components/CircularProgressWithLabel.js';
import { QueryError } from '../../components/QueryView/QueryError.js';

type LabelResult = {
  isDeterminate: boolean;
  value?: number;
  label: string;
};
const getLabel = (
  project: api.project.Item | undefined,
  t: TFunction,
): LabelResult => {
  if (!project) {
    return {
      isDeterminate: false,
      label: t('pages.project.progress.loading'),
    };
  }

  if (project.stage === 'pending') {
    return {
      isDeterminate: false,
      label: t('pages.project.progress.pending'),
    };
  }

  if (project.stage === 'progress') {
    const { separationProgress } = project;
    if (separationProgress === undefined) {
      return {
        isDeterminate: false,
        label: t('pages.project.progress.starting'),
      };
    }
    if (separationProgress === 0) {
      return {
        isDeterminate: false,
        label: t('pages.project.progress.starting'),
      };
    }
    const value = separationProgress * 100;
    return {
      isDeterminate: true,
      value,
      label: `${value.toFixed(0)}%\n${t('pages.project.progress.separating')}`,
    };
  }

  return {
    isDeterminate: false,
    label: t('pages.project.progress.loading'),
  };
};

export type ProjectPageProgressProps = {
  project: UseQueryResult<api.project.Item>;
};
export const ProjectPageProgress: FC<ProjectPageProgressProps> = (props) => {
  const { project } = props;
  const { t } = useTranslation();

  if (project.isError) {
    return (
      <Stack
        width='100%'
        height='100dvh'
        padding={4}
        alignItems='center'
        justifyContent='center'
      >
        <QueryError error={project.error} />
      </Stack>
    );
  }

  const { isDeterminate, value, label } = getLabel(project.data, t);

  return (
    <Stack
      width='100%'
      height='100dvh'
      padding={4}
      alignItems='center'
      justifyContent='center'
    >
      <CircularProgressWithLabel
        enableTrackSlot={true}
        variant={isDeterminate ? 'determinate' : 'indeterminate'}
        value={value}
        size={200}
        thickness={2}
      >
        <Typography textAlign='center' sx={{ whiteSpace: 'pre-line' }}>
          {label}
        </Typography>
      </CircularProgressWithLabel>
    </Stack>
  );
};
