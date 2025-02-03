import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CssBaseline /> {/* Normalizes styles for MUI */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
