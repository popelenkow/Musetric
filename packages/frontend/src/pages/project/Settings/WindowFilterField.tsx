import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { spectrogram } from '@musetric/audio-view';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/settings';

export const WindowFilterField: FC = () => {
  const { t } = useTranslation();
  const currentFilter = useSettingsStore((s) => s.windowFilter);
  const setFilter = useSettingsStore((s) => s.setWindowFilter);

  return (
    <FormControl size='small'>
      <InputLabel>
        {t('pages.project.settings.fields.windowFilter.label')}
      </InputLabel>
      <Select
        value={currentFilter}
        label={t('pages.project.settings.fields.windowFilter.label')}
      >
        {spectrogram.windowFilterKeys.map((name) => (
          <MenuItem key={name} value={name} onClick={() => setFilter(name)}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
