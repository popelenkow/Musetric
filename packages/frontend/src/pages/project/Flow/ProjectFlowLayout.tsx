import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Stack, Typography, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { routes } from '../../../app/router/routes.js';

export type ProjectFlowLayoutProps = {
  children: ReactNode;
  variant: 'progress' | 'ready';
  overallProgressPercent?: number;
};

export const ProjectFlowLayout: FC<ProjectFlowLayoutProps> = (props) => {
  const { children, variant, overallProgressPercent } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const title =
    variant === 'progress'
      ? t('pages.project.progress.trackTitle')
      : t('pages.project.title');
  const subtitle =
    variant === 'progress'
      ? t('pages.project.progress.subTitle')
      : undefined;

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: `radial-gradient(circle at 16% 18%, ${alpha(
          theme.palette.primary.main,
          0.08,
        )}, transparent 32%), radial-gradient(circle at 82% 12%, ${alpha(
          theme.palette.success.main,
          0.08,
        )}, transparent 28%), linear-gradient(180deg, ${alpha(
          theme.palette.background.default,
          0.9,
        )}, ${alpha(theme.palette.background.paper, 0.96)})`,
      }}
      padding={{ xs: 2.5, sm: 3.5, md: 4 }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 50% 60%, ${alpha(
            theme.palette.primary.light,
            theme.palette.mode === 'dark' ? 0.08 : 0.04,
          )}, transparent 42%)`,
          filter: 'blur(24px)',
          opacity: 0.7,
        }}
      />
      <Stack width='100%' maxWidth={1220} position='relative' zIndex={1}>
        <Box
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(
              theme.palette.divider,
              theme.palette.mode === 'dark' ? 0.25 : 0.14,
            )}`,
            backgroundColor: alpha(
              theme.palette.background.paper,
              theme.palette.mode === 'dark' ? 0.86 : 0.9,
            ),
            boxShadow: `0 24px 64px ${alpha(
              theme.palette.common.black,
              theme.palette.mode === 'dark' ? 0.55 : 0.18,
            )}`,
            backdropFilter: 'blur(8px)',
            overflow: 'hidden',
          }}
        >
          <Stack
            spacing={{ xs: 2.5, md: 3 }}
            padding={{ xs: 2.5, sm: 3, md: 3.5 }}
          >
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
                {t('pages.project.progress.backHome')}
              </Button>
              <Box flexGrow={1} />
              {overallProgressPercent !== undefined && (
                <Box
                  sx={{
                    padding: theme.spacing(1.2, 1.5),
                    borderRadius: 2,
                    backgroundColor: alpha(
                      theme.palette.primary.main,
                      theme.palette.mode === 'dark' ? 0.12 : 0.08,
                    ),
                    minWidth: 150,
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      theme.palette.mode === 'dark' ? 0.3 : 0.2,
                    )}`,
                  }}
                >
                  <Typography variant='caption' color='text.secondary'>
                    {t('pages.project.progress.overall')}
                  </Typography>
                  <Typography variant='h5' fontWeight={800}>
                    {overallProgressPercent}%
                  </Typography>
                </Box>
              )}
            </Stack>
            <Stack spacing={1} alignItems='center' width='100%'>
              <Typography variant='h4' textAlign='center' fontWeight={800}>
                {title}
              </Typography>
              {subtitle ? (
                <Typography
                  variant='body1'
                  color='text.secondary'
                  textAlign='center'
                  sx={{ maxWidth: 920, lineHeight: 1.6 }}
                >
                  {subtitle}
                </Typography>
              ) : undefined}
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
                    height: 12,
                    overflow: 'hidden',
                    border: `1px solid ${alpha(
                      theme.palette.text.primary,
                      theme.palette.mode === 'dark' ? 0.2 : 0.12,
                    )}`,
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
        </Box>
      </Stack>
    </Box>
  );
};
