import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { SFC } from '../common/react';
import { AppRouter } from './AppRouter';
import { appTheme } from './theme';

export const App: SFC = () => {
    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </ThemeProvider>
    );
};
