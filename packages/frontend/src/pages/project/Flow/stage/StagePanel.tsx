import { Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { FC, ReactNode } from 'react';

export type StagePanelProps = {
  children: ReactNode;
  title?: string;
  hint?: string;
};

export const StagePanel: FC<StagePanelProps> = (props) => {
  const { children, title, hint } = props;
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        px: { xs: 2.5, sm: 3, md: 3.5 },
        py: { xs: 2.5, sm: 3 },
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        border: `1px solid ${alpha(
          theme.palette.text.primary,
          theme.palette.mode === 'dark' ? 0.15 : 0.08,
        )}`,
        boxShadow: `0 16px 38px ${alpha(
          theme.palette.common.black,
          theme.palette.mode === 'dark' ? 0.45 : 0.14,
        )}`,
      }}
    >
      <Stack spacing={2.5}>
        {(title || hint) && (
          <Stack
            spacing={0.6}
            alignItems={{ xs: 'center', md: 'flex-start' }}
            textAlign={{ xs: 'center', md: 'left' }}
          >
            {title ? (
              <Typography variant='subtitle1' fontWeight={800}>
                {title}
              </Typography>
            ) : undefined}
            {hint ? (
              <Typography variant='body2' color='text.secondary'>
                {hint}
              </Typography>
            ) : undefined}
          </Stack>
        )}
        {children}
      </Stack>
    </Paper>
  );
};
