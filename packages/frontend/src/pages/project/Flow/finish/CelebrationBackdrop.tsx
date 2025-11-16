import { Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { FC } from 'react';

export type CelebrationBackdropProps = {
  accent: string;
};

export const CelebrationBackdrop: FC<CelebrationBackdropProps> = (props) => {
  const { accent } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: { xs: -60, md: -110 },
        background: `radial-gradient(circle at 22% 30%, ${alpha(
          accent,
          0.16,
        )}, transparent 40%), radial-gradient(circle at 78% 16%, ${alpha(
          theme.palette.primary.main,
          0.16,
        )}, transparent 36%), radial-gradient(circle at 50% 82%, ${alpha(
          theme.palette.info.main,
          0.16,
        )}, transparent 42%)`,
        filter: 'blur(26px)',
        opacity: 0.9,
        pointerEvents: 'none',
      }}
    />
  );
};
