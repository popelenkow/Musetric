/* eslint-disable @typescript-eslint/consistent-type-definitions */
import {
  ComponentsVariants,
  PaletteColor,
  PaletteColorOptions,
  Theme,
} from '@mui/material';
import { black, neutral, white } from '../colors.js';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: PaletteColor;
  }
  interface PaletteOptions {
    neutral?: PaletteColorOptions;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}
declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    neutral: true;
  }
}
declare module '@mui/material/Slider' {
  interface SliderPropsColorOverrides {
    neutral: true;
  }
}

export const neutralPalette = {
  light: neutral[200],
  main: neutral[500],
  dark: neutral[700],
  contrastText: black,
};
export const neutralButton = [
  {
    props: { variant: 'contained', color: 'neutral' },
    style: () => ({
      backgroundColor: neutral[800],
      color: white,
      '&:hover': {
        backgroundColor: neutral[700],
      },
    }),
  },
] satisfies ComponentsVariants<Theme>['MuiButton'];
