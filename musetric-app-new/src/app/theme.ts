import { createTheme } from '@mui/material';

export const appTheme = createTheme({
    spacing: 4,
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'Cera PRO, "Helvetica Neue", Arial, sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    '& .MuiTypography-root, & .MuiSvgIcon-root': {
                        color: 'inherit',
                    },
                    width: 'fit-content',
                },
            },
        },
        MuiCardMedia: {
            styleOverrides: {
                root: {
                    objectFit: 'contain',
                },
            },
        },
        MuiLink: {
            defaultProps: {
                underline: 'hover',
            },
            styleOverrides: {
                root: {
                    '& .MuiTypography-root, & .MuiSvgIcon-root': {
                        color: 'inherit',
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    width: 'fit-content',
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: (props) => ({
                    alignItems: 'center',
                    gap: props.theme.spacing(2),
                    padding: props.theme.spacing(2),
                }),
                icon: (props) => ({
                    padding: props.theme.spacing(1),
                    margin: 0,
                }),
                action: {
                    padding: 0,
                    margin: 0,
                },
            },
        },
    },
});
