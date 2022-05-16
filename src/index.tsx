import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { watch } from 'veest';
import 'react-toastify/dist/ReactToastify.css';
import { CssBaseline } from '@mui/material';
import { ServiceContainer } from '@/veest';
import { services } from '@/services';
import { ThemeProvider } from '@ui/theme/component';
import { App } from '@containers/bootstrap/container';

watch(services, { showDiff: true, showCurrent: false });

ReactDOM.render(
    <>
        <BrowserRouter>
            <ThemeProvider>
                <ServiceContainer />
                <CssBaseline>
                    <App />
                </CssBaseline>
            </ThemeProvider>
        </BrowserRouter>
        <ToastContainer theme="dark" position="top-center" hideProgressBar autoClose={2000} />
    </>,
    document.getElementById('root'),
);
