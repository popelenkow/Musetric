import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { skipPromise } from './common/skipPromise';
import { initTranslations } from './locale/translations';

const run = async () => {
    const elementId = 'root';
    const rootElement = document.getElementById(elementId)!;

    const root = createRoot(rootElement);
    await initTranslations();
    root.render(<StrictMode><App /></StrictMode>);
    document.getElementById('splashScreen')!.style.display = 'none';
};

skipPromise(run());
