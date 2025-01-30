import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
import { CssBaseline } from '@mui/material'; // MUI global styles

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CssBaseline /> {/* Normalizes styles for MUI */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
