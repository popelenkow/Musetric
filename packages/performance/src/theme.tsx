import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  palette: { mode: 'dark' },
  components: {
    MuiButton: {
      styleOverrides: {
        root: (state) => {
          const { theme } = state;
          return {
            ...theme.typography.body1,
            textTransform: 'none',
          };
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: (state) => {
          const { theme } = state;
          return {
            ...theme.typography.body1,
            textTransform: 'none',
          };
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: (state) => {
          const { theme } = state;
          return {
            padding: theme.spacing(0.5, 0.5),
          };
        },
      },
    },
  },
});
