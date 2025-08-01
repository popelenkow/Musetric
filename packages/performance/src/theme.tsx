import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  palette: { mode: 'dark' },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography.body1,
          textTransform: 'none',
        }),
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography.body1,
          textTransform: 'none',
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(0.5, 0.5),
        }),
      },
    },
  },
});
