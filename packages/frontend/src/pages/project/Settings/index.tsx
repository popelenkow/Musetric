import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/settings';
import { FourierModeField } from './FourierModeField';
import { MaxFrequencyField } from './MaxFrequencyField';
import { MinDecibelField } from './MinDecibelField';
import { MinFrequencyField } from './MinFrequencyField';
import { VisibleTimeAfterField } from './VisibleTimeAfterField';
import { VisibleTimeBeforeField } from './VisibleTimeBeforeField';
import { WindowFilterField } from './WindowFilterField';
import { WindowSizeField } from './WindowSizeField';
import { ZeroPaddingFactorField } from './ZeroPaddingFactorField';

export const Settings: FC = () => {
  const { t } = useTranslation();
  const open = useSettingsStore((s) => s.open);
  const setOpen = useSettingsStore((s) => s.setOpen);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ ml: 2 }}>
        <SettingsIcon />
      </IconButton>
      <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
        <Box width={280} p={2} role='presentation'>
          <Stack gap={4}>
            <Stack direction='row' alignItems='center'>
              <Typography variant='h6' sx={{ flexGrow: 1 }}>
                {t('pages.project.settings.title')}
              </Typography>
              <IconButton size='small' onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <FourierModeField />
            <WindowFilterField />
            <WindowSizeField />
            <MinFrequencyField />
            <MaxFrequencyField />
            <MinDecibelField />
            <VisibleTimeBeforeField />
            <VisibleTimeAfterField />
            <ZeroPaddingFactorField />
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};
