import { useTheme } from '@mui/material';
import { ViewColors } from '@musetric/audio-view';
import { FC, useEffect } from 'react';
import { useSettingsStore } from '../store/settings.js';

export const ThemeViewColors: FC = () => {
  const theme = useTheme();
  const setColors = useSettingsStore((s) => s.setColors);

  useEffect(() => {
    const colors: ViewColors = {
      played: theme.palette.primary.main,
      unplayed: theme.palette.default.main,
      background: theme.palette.background.default,
    };
    setColors(colors);
  }, [theme, setColors]);

  return undefined;
};
