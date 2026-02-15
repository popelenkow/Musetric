import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Stack, Typography } from '@mui/material';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

export type QueryNotFoundProps = {
  error: unknown;
};
export const QueryNotFound: FC<QueryNotFoundProps> = () => {
  const { t } = useTranslation();
  return (
    <Stack
      alignItems='center'
      justifyContent='center'
      width='100%'
      height='100%'
    >
      <ErrorOutlineIcon color='warning' fontSize='large' />
      <Typography color='warning'>{t('common.queryView.notFound')}</Typography>
    </Stack>
  );
};
