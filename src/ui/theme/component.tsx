import React, { FC } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { countRenderedTimes } from '@/veest';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export const ThemeProvider: FC = ({ children }) => {
    countRenderedTimes('component');
    return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
};
