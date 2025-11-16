import { CircularProgress, Stack } from '@mui/material';
import { FC } from 'react';

export const QueryPending: FC = () => (
  <Stack alignItems='center' justifyContent='center' width='100%' height='100%'>
    <CircularProgress />
  </Stack>
);
