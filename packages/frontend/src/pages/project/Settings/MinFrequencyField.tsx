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
      key={minFrequency}
      size='small'
      type='number'
      label={t('pages.project.settings.fields.minFrequency.label')}
      defaultValue={minFrequency}
      onBlur={(event) => {
        const value = Number(event.target.value);
        if (Number.isNaN(value)) return;
        setMinFrequency(Math.max(value, 0));
      }}
      slotProps={{
        input: {
          onKeyDown: (event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur();
            }
          },
        },
      }}
    />
  );
};
