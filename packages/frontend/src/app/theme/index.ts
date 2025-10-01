import { createTheme } from '@mui/material';
import { noNumberInputSpin } from './noNumberInputSpin.js';
import { defaultPalette } from './palettes/default.js';
import { neutralButton, neutralPalette } from './palettes/neutral.js';
import { themeScrollbar } from './scrollbar.js';
import { themeTypography } from './typography.js';

export const appTheme = createTheme({
  spacing: 4,
  palette: {
    mode: 'dark',
    neutral: neutralPalette,
    default: defaultPalette,
  },
  typography: themeTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...themeScrollbar,
        body: {
          fontFamily: themeTypography.fontFamily,
        },
        ...noNumberInputSpin,
      },
    },
    MuiButton: {
      variants: [...neutralButton],
      defaultProps: {
        color: 'default',
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
        color: 'default',
      },
    },
    MuiSlider: {
      defaultProps: {
        color: 'default',
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
