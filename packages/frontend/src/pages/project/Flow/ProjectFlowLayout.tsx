import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Stack, Typography, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FC, ReactNode } from 'react';
import { routes } from '../../../app/router/routes.js';

export type ProjectFlowLayoutProps = {
  children: ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
  overallProgressPercent?: number;
  backButtonLabel: string;
  overallProgressLabel: string;
};

export const ProjectFlowLayout: FC<ProjectFlowLayoutProps> = (props) => {
  const {
    children,
    pageTitle,
    pageSubtitle,
    overallProgressPercent,
    backButtonLabel,
    overallProgressLabel,
  } = props;
  const theme = useTheme();

  return (
    <Stack
      width='100%'
      height='100dvh'
      alignItems='center'
      justifyContent='center'
      padding={{ xs: 3, sm: 4, md: 6 }}
      sx={{
        background: `radial-gradient(circle at 20% 20%, ${alpha(
          theme.palette.primary.main,
          0.04,
        )}, transparent 30%), radial-gradient(circle at 80% 10%, ${alpha(
          theme.palette.success.main,
          0.04,
        )}, transparent 26%), linear-gradient(180deg, ${alpha(
          theme.palette.background.default,
          0.9,
        )}, ${alpha(theme.palette.background.paper, 0.94)})`,
      }}
    >
      <Stack spacing={2.5} alignItems='center' width='100%' maxWidth={1180}>
        <Stack
          direction='row'
          alignItems='center'
          width='100%'
          gap={2}
        >
          <Button
            component={routes.home.Link}
            startIcon={<ArrowBackIcon />}
            variant='outlined'
            color='default'
          >
            {backButtonLabel}
          </Button>
          <Box flexGrow={1} />
          {overallProgressPercent !== undefined && (
            <Box
              sx={{
                padding: theme.spacing(1.1, 1.4),
                borderRadius: 2,
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === 'dark' ? 0.12 : 0.06,
                ),
                minWidth: 150,
              }}
            >
              <Typography variant='caption' color='text.secondary'>
                {overallProgressLabel}
              </Typography>
              <Typography variant='h5' fontWeight={800}>
                {overallProgressPercent}%
              </Typography>
            </Box>
          )}
        </Stack>
        <Stack spacing={1} alignItems='center' width='100%'>
          <Typography variant='h4' textAlign='center' fontWeight={800}>
            {pageTitle}
          </Typography>
          {pageSubtitle && (
            <Typography
              variant='body1'
              color='text.secondary'
              textAlign='center'
              sx={{ maxWidth: 900, lineHeight: 1.6 }}
            >
              {pageSubtitle}
            </Typography>
          )}
          {overallProgressPercent !== undefined && (
            <Box
              sx={{
                width: '100%',
                mt: 0.5,
                position: 'relative',
                borderRadius: 999,
                backgroundColor: alpha(
                  theme.palette.text.primary,
                  theme.palette.mode === 'dark' ? 0.16 : 0.08,
                ),
                height: 10,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(90deg, ${alpha(
                    theme.palette.success.main,
                    0.9,
                  )}, ${alpha(theme.palette.primary.main, 0.9)})`,
                  width: `${overallProgressPercent}%`,
                  transition: 'width 0.6s ease',
                  boxShadow: `0 0 18px ${alpha(
                    theme.palette.primary.main,
                    0.4,
                  )}`,
                }}
              />
            </Box>
          )}
        </Stack>
        <Box width='100%'>{children}</Box>
      </Stack>
    </Stack>
  );
};
