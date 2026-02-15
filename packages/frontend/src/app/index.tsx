import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { type FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { queryClient } from '../api/queryClient.js';
import { i18n } from '../translations/index.js';
import { AppRouter } from './router/AppRouter.js';
import { appTheme } from './theme/index.js';

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
