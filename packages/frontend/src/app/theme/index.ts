import { createTheme } from '@mui/material';
import { neutralButton, neutralPalette } from './neutral';
import { themeScrollbar } from './scrollbar';
import { themeTypography } from './typography';

export const appTheme = createTheme({
  spacing: 4,
  palette: {
    mode: 'dark',
    neutral: neutralPalette,
  },
  typography: themeTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...themeScrollbar,
        body: {
          fontFamily: themeTypography.fontFamily,
        },
      },
    },
    MuiButton: {
      variants: [...neutralButton],
      defaultProps: {
        color: 'neutral',
      },
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography.body1,
          textTransform: 'none',
        }),
        startIcon: ({ theme }) => ({
          marginRight: theme.spacing(1),
        }),
        endIcon: ({ theme }) => ({
          marginLeft: theme.spacing(1),
        }),
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'neutral',
      },
    },
    MuiSlider: {
      defaultProps: {
        color: 'neutral',
      },
    },
    MuiTextField: {
      defaultProps: {
        autoComplete: 'off',
      },
    },
    MuiInputBase: {
      defaultProps: {
        inputProps: { autoComplete: 'off' },
      },
    },
    MuiDialog: {
      defaultProps: {
        scroll: 'body',
      },
    },
  },
});
