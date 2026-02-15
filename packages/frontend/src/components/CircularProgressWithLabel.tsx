import {
  Box,
  CircularProgress,
  type CircularProgressProps,
} from '@mui/material';
import { type PropsWithChildren } from 'react';

export const CircularProgressWithLabel = (
  props: CircularProgressProps & PropsWithChildren,
) => {
  const { children, ...restProps } = props;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress {...restProps} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
