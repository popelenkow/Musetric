import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FC } from 'react';
import { StageBubble } from './StageBubble.js';
import { StageItem } from './stageTypes.js';

export type StageRailProps = {
  stages: StageItem[];
  celebrateDelivery?: boolean;
};

export const StageRail: FC<StageRailProps> = (props) => {
  const { stages, celebrateDelivery = false } = props;
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const columns = isTablet ? 2 : 4;

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
            celebrate={celebrateDelivery && stage.key === 'delivery'}
          />
        ))}
      </Box>
    </Box>
  );
};
