import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { queryClient } from '../api/queryClient';
import { i18n } from '../translations';
import { AppRouter } from './router/AppRouter';
import { appTheme } from './theme';

export const App: FC = () => {
  return (
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <AppRouter />
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};
