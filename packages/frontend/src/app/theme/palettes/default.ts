/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { type PaletteColor, type PaletteColorOptions } from '@mui/material';
import { grey } from '@mui/material/colors';
import { black, white } from '../colors.js';

declare module '@mui/material/styles' {
  interface Palette {
    default: PaletteColor;
  }
  interface PaletteOptions {
    default?: PaletteColorOptions;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    default: true;
  }
}
declare module '@mui/material/Slider' {
  interface SliderPropsColorOverrides {
    default: true;
  }
}

export const defaultPalette = {
  light: grey[400],
  main: white,
  dark: grey[400],
  contrastText: black,
};
