import { TextField } from '@mui/material';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type NameValue } from './schema.js';

export type NameFieldProps = {
  value?: NameValue;
  setValue: (value?: NameValue) => void;
  error?: string;
  disabled?: boolean;
};
export const NameField: FC<NameFieldProps> = (props) => {
  const { value, setValue, disabled, error } = props;

  const { t } = useTranslation();

  return (
    <TextField
      value={value ?? ''}
      multiline
      rows={3}
      size='small'
      label={t('pages.projects.fields.name.label')}
      disabled={disabled}
      error={!!error}
      helperText={error}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      }}
      onChange={(event) => {
        const text = event.target.value;
        const newValue = text.replace(/(\r\n|\n|\r)/g, ' ');
        setValue(newValue);
      }}
    />
  );
};
