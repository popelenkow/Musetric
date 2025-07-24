import { TextField } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/settings';

export const MaxFrequencyField: FC = () => {
  const { t } = useTranslation();
  const maxFrequency = useSettingsStore((s) => s.maxFrequency);
  const setMaxFrequency = useSettingsStore((s) => s.setMaxFrequency);

  return (
    <TextField
      size='small'
      type='number'
      label={t('pages.project.settings.fields.maxFrequency.label')}
      value={maxFrequency}
      onChange={(event) => {
        const value = Number(event.target.value);
        setMaxFrequency(value);
      }}
    />
  );
};
