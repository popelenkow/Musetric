import { CssBaseline, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { appTheme } from './theme';

const run = () => {
  const rootElement = document.getElementById('root');
  const splashScreen = document.getElementById('splashScreen');
  if (!rootElement || !splashScreen) {
    throw new Error('Root element or splash screen not found');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>,
  );
  splashScreen.remove();
};

run();
