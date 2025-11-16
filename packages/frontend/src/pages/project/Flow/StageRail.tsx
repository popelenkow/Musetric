import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { api } from '@musetric/api';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StageBubble } from './StageBubble.js';
import { buildStageItems } from './stageProgress.js';

export type StageRailProps = {
  project: api.project.Item;
  isFinishing?: boolean;
};

export const StageRail: FC<StageRailProps> = (props) => {
  const { project, isFinishing = false } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const columns = isTablet ? 2 : 4;
  const stages = buildStageItems(project, t);

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 1.5, md: 2 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {stages.map((stage) => (
          <StageBubble
            key={stage.key}
            stage={stage}
            celebrate={isFinishing && stage.key === 'delivery'}
          />
        ))}
      </Box>
    </Box>
  );
};
