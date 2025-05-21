import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { initI18next } from './translations';

const runApp = async () => {
  await initI18next();

  const root = document.getElementById('root')!;
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  const splashScreen = document.getElementById('splashScreen')!;
  splashScreen.style.display = 'none';
};

runApp();
