import { blueGrey, grey } from '@mui/material/colors';

export const contentPlaceholderPattern = `
  repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 0px,
    rgba(255, 255, 255, 0.1) 4px,
    transparent 4px,
    transparent 10px
  ),
  linear-gradient(120deg, ${grey[900]},${blueGrey[800]})
`;
