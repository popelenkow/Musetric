import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Stack, Typography } from '@mui/material';
import { type FC } from 'react';

export type ViewErrorProps = {
  message: string;
};

export const ViewError: FC<ViewErrorProps> = (props) => {
  const { message } = props;

  return (
    <Stack
      width='100%'
      height='100%'
      alignItems='center'
      justifyContent='center'
      gap={0.5}
    >
      <ErrorOutlineIcon color='error' fontSize='medium' />
      <Typography variant='body2' color='text.primary' textAlign='center'>
        {message}
      </Typography>
    </Stack>
  );
};
