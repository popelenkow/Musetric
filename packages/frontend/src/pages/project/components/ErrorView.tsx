import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Stack, Typography } from '@mui/material';
import { type FC } from 'react';

export type ErrorViewProps = {
  message: string;
};

export const ErrorView: FC<ErrorViewProps> = (props) => {
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
