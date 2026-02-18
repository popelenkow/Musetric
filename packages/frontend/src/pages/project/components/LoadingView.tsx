import { CircularProgress, Stack, Typography } from '@mui/material';
import { type FC } from 'react';

export type LoadingViewProps = {
  message?: string;
};

export const LoadingView: FC<LoadingViewProps> = (props) => {
  const { message } = props;

  return (
    <Stack
      width='100%'
      height='100%'
      alignItems='center'
      justifyContent='center'
      gap={0.5}
      flex={1}
    >
      <CircularProgress size={24} thickness={4} />
      {message ? (
        <Typography variant='body2' color='text.primary'>
          {message}
        </Typography>
      ) : undefined}
    </Stack>
  );
};
