import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import Loader from "../components/Loader";

const App = ({ Component, pageProps }) => {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <ThemeProvider>
      {!loaderDone && <Loader onDone={() => setLoaderDone(true)} />}
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
