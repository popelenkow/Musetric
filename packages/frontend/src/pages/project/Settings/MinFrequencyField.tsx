import { TextField } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/settings';

export const MinFrequencyField: FC = () => {
  const { t } = useTranslation();
  const minFrequency = useSettingsStore((s) => s.minFrequency);
  const setMinFrequency = useSettingsStore((s) => s.setMinFrequency);

  return (
    <TextField
      size='small'
      type='number'
      label={t('pages.project.settings.fields.minFrequency.label')}
      value={minFrequency}
      onChange={(event) => {
        const value = Number(event.target.value);
        setMinFrequency(value);
      }}
    />
  );
};
