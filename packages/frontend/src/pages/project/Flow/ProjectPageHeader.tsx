import { Box, Stack, Typography, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FC } from 'react';

export type ProjectPageHeaderProps = {
  title: string;
  subtitle?: string;
  overallProgressPercent?: number;
  overallLabel?: string;
};

export const ProjectPageHeader: FC<ProjectPageHeaderProps> = (props) => {
  const {
    title,
    subtitle,
    overallProgressPercent,
    overallLabel = 'Overall',
  } = props;
  const theme = useTheme();
  const showOverallProgress = overallProgressPercent !== undefined;
  const overallProgressPercentValue = overallProgressPercent ?? 0;

  return (
    <Stack spacing={1.5} width='100%'>
      {showOverallProgress ? (
        <Stack
          direction='row'
          alignItems='center'
          width='100%'
          gap={2}
        >
          <Box flexGrow={1} />
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
              {overallLabel}
            </Typography>
            <Typography variant='h5' fontWeight={800}>
              {overallProgressPercentValue}%
            </Typography>
          </Box>
        </Stack>
      ) : undefined}
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
        {showOverallProgress ? (
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
                width: `${overallProgressPercentValue}%`,
                transition: 'width 0.6s ease',
                boxShadow: `0 0 18px ${alpha(
                  theme.palette.primary.main,
                  0.4,
                )}`,
              }}
            />
          </Box>
        ) : undefined}
      </Stack>
    </Stack>
  );
};
