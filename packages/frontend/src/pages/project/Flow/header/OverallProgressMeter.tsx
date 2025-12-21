import { alpha, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { api } from '@musetric/api';
import { FC } from 'react';
import { computeOverallPercent } from '../common.js';

export type OverallProgressMeterProps = {
  project: api.project.Item;
};

export const OverallProgressMeter: FC<OverallProgressMeterProps> = (props) => {
  const { project } = props;
  const theme = useTheme();
  const overallProgressPercent = computeOverallPercent(project);
  if (overallProgressPercent === undefined) return undefined;

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        borderRadius: 999,
        backgroundColor: alpha(theme.palette.text.primary, 0.12),
        height: 12,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
          width: `${overallProgressPercent}%`,
          transition: 'width 0.6s ease',
          boxShadow: theme.shadows[4],
        }}
      />
    </Box>
  );
};
