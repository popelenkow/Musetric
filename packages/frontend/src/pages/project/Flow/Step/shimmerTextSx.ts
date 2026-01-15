import { keyframes } from '@mui/material/styles';

const shimmerTextKeyframes = keyframes`
  0% {
    background-position: 103% 0;
  }
  100% {
    background-position: -3% 0;
  }
`;

export const getShimmerTextSx = (color: string) =>
  ({
    backgroundImage: `linear-gradient(120deg, ${color} 0%, ${color} 47%, #fff 50%, ${color} 53%, ${color} 100%)`,
    backgroundSize: '200% 100%',
    backgroundClip: 'text',
    color: 'transparent',
    animation: `${shimmerTextKeyframes} 2.3s ease-in-out infinite`,
  }) as const;
